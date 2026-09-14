-- Recountix security foundation: server-verified sessions and login throttling.
-- Apply in Supabase SQL Editor before deploying the matching frontend branch.
-- This migration is idempotent and does not yet change application-table RLS.

create extension if not exists pgcrypto;

create table if not exists public.app_sessions (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique,
  user_id uuid not null references public.users(id) on delete cascade,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create index if not exists app_sessions_user_idx on public.app_sessions(user_id);
create index if not exists app_sessions_expiry_idx on public.app_sessions(expires_at);

create table if not exists public.login_attempts (
  username text primary key,
  failed_count integer not null default 0,
  locked_until timestamptz,
  last_attempt_at timestamptz not null default now()
);

alter table public.app_sessions enable row level security;
alter table public.login_attempts enable row level security;

revoke all on public.app_sessions from anon, authenticated;
revoke all on public.login_attempts from anon, authenticated;

create or replace function public.app_login(p_username text, p_password text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user public.users%rowtype;
  v_shop public.shops%rowtype;
  v_attempt public.login_attempts%rowtype;
  v_token text;
  v_valid boolean := false;
begin
  if length(trim(coalesce(p_username,''))) < 1 or length(coalesce(p_password,'')) < 1 then
    return jsonb_build_object('error','invalid_credentials');
  end if;

  select * into v_attempt from public.login_attempts
   where username = lower(trim(p_username));
  if found and v_attempt.locked_until is not null and v_attempt.locked_until > now() then
    return jsonb_build_object('error','temporarily_locked');
  end if;

  select * into v_user from public.users
   where lower(username) = lower(trim(p_username)) and is_active = true
   limit 1;

  if found then
    if v_user.password like '$2%' then
      v_valid := crypt(p_password, v_user.password) = v_user.password;
    elsif v_user.password ~ '^[a-f0-9]{64}$' then
      v_valid := encode(digest('VO-RM-v1-' || p_password, 'sha256'),'hex') = lower(v_user.password);
    end if;
  end if;

  if not v_valid then
    insert into public.login_attempts(username, failed_count, locked_until, last_attempt_at)
    values (lower(trim(p_username)), 1, null, now())
    on conflict (username) do update
      set failed_count = public.login_attempts.failed_count + 1,
          locked_until = case when public.login_attempts.failed_count + 1 >= 5
                              then now() + interval '15 minutes' else null end,
          last_attempt_at = now();
    return jsonb_build_object('error','invalid_credentials');
  end if;

  delete from public.login_attempts where username = lower(trim(p_username));

  if v_user.password !~ '^\\$2' then
    update public.users
       set password = crypt(p_password, gen_salt('bf', 12))
     where id = v_user.id;
  end if;

  if v_user.shop_id is not null then
    select * into v_shop from public.shops where id = v_user.shop_id;
    if found and v_shop.is_active = false and v_user.role <> 'super_admin' then
      return jsonb_build_object('error','shop_inactive');
    end if;
    if found and v_shop.license_expiry is not null
       and v_shop.license_expiry < current_date and v_user.role <> 'super_admin' then
      return jsonb_build_object('error','license_expired');
    end if;
  end if;

  v_token := encode(gen_random_bytes(32), 'hex');
  insert into public.app_sessions(token_hash, user_id, expires_at)
  values (encode(digest(v_token,'sha256'),'hex'), v_user.id, now() + interval '12 hours');

  return jsonb_build_object(
    'token', v_token,
    'user', jsonb_build_object(
      'id', v_user.id, 'username', v_user.username, 'role', v_user.role,
      'shop_id', v_user.shop_id, 'display_name', v_user.display_name
    )
  );
end;
$$;

create or replace function public.app_validate_session(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_session public.app_sessions%rowtype;
  v_user public.users%rowtype;
begin
  if coalesce(p_token,'') = '' then return jsonb_build_object('valid',false); end if;
  select * into v_session from public.app_sessions
   where token_hash = encode(digest(p_token,'sha256'),'hex')
     and revoked_at is null and expires_at > now();
  if not found then return jsonb_build_object('valid',false); end if;

  select * into v_user from public.users where id=v_session.user_id and is_active=true;
  if not found then return jsonb_build_object('valid',false); end if;

  update public.app_sessions set last_seen_at=now() where id=v_session.id;
  return jsonb_build_object(
    'valid',true,
    'user',jsonb_build_object('id',v_user.id,'username',v_user.username,'role',v_user.role,
      'shop_id',v_user.shop_id,'display_name',v_user.display_name),
    'expires_at',v_session.expires_at
  );
end;
$$;

create or replace function public.app_logout(p_token text)
returns void
language sql
security definer
set search_path = public, pg_temp
as $$
  update public.app_sessions set revoked_at=now()
   where token_hash=encode(digest(p_token,'sha256'),'hex') and revoked_at is null;
$$;

revoke all on function public.app_login(text,text) from public;
revoke all on function public.app_validate_session(text) from public;
revoke all on function public.app_logout(text) from public;
grant execute on function public.app_login(text,text) to anon, authenticated;
grant execute on function public.app_validate_session(text) to anon, authenticated;
grant execute on function public.app_logout(text) to anon, authenticated;

-- Remove obsolete sessions automatically from a scheduled maintenance job:
-- delete from public.app_sessions where expires_at < now() - interval '7 days' or revoked_at is not null;
