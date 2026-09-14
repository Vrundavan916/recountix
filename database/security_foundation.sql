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


-- Field agents: PIN verification and customer access stay server-side.
create table if not exists public.field_sessions (
  token_hash text primary key,
  agent_id uuid not null references public.users(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
alter table public.field_sessions enable row level security;
revoke all on public.field_sessions from anon, authenticated;

create or replace function public.app_field_login(p_agent_code text, p_pin text)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare v_user public.users%rowtype; v_token text; v_key text;
begin
  v_key := 'field:' || lower(trim(coalesce(p_agent_code,'')));
  if length(p_pin) < 4 then return jsonb_build_object('error','invalid_credentials'); end if;
  if exists(select 1 from public.login_attempts where username=v_key and locked_until>now()) then
    return jsonb_build_object('error','temporarily_locked');
  end if;
  select * into v_user from public.users where lower(agent_code)=lower(trim(p_agent_code))
    and is_active=true and is_field_agent=true limit 1;
  if not found or not (
      (v_user.field_pin like '$2%' and crypt(p_pin,v_user.field_pin)=v_user.field_pin)
      or (v_user.field_pin !~ '^\\$2' and v_user.field_pin=p_pin)
    ) then
    insert into public.login_attempts(username,failed_count,locked_until,last_attempt_at)
    values(v_key,1,null,now()) on conflict(username) do update
      set failed_count=public.login_attempts.failed_count+1,
          locked_until=case when public.login_attempts.failed_count+1>=5 then now()+interval '15 minutes' else null end,
          last_attempt_at=now();
    return jsonb_build_object('error','invalid_credentials');
  end if;
  delete from public.login_attempts where username=v_key;
  if v_user.field_pin !~ '^\\$2' then
    update public.users set field_pin=crypt(p_pin,gen_salt('bf',12)) where id=v_user.id;
  end if;
  v_token:=encode(gen_random_bytes(32),'hex');
  insert into public.field_sessions(token_hash,agent_id,expires_at)
    values(encode(digest(v_token,'sha256'),'hex'),v_user.id,now()+interval '8 hours');
  return jsonb_build_object('token',v_token,'agent',jsonb_build_object(
    'id',v_user.id,'display_name',v_user.display_name,'username',v_user.username));
end $$;

create or replace function public.app_field_customers(p_token text)
returns table(id uuid,name text,village text)
language sql security definer set search_path=public,pg_temp as $$
  select c.id,c.name,c.village from public.field_sessions fs
  join public.users u on u.id=fs.agent_id
  join public.customers c on c.shop_id=u.shop_id
    and trim(coalesce(c.executive,''))=trim(coalesce(u.display_name,''))
  where fs.token_hash=encode(digest(p_token,'sha256'),'hex')
    and fs.expires_at>now() and u.is_active=true and u.is_field_agent=true
  order by c.name
$$;

create or replace function public.app_field_checkin(
  p_token text,p_customer_id uuid,p_activity_type text,p_notes text,p_lat numeric,p_lng numeric)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare v_user public.users%rowtype; v_ok boolean;
begin
  select u.* into v_user from public.field_sessions fs join public.users u on u.id=fs.agent_id
   where fs.token_hash=encode(digest(p_token,'sha256'),'hex') and fs.expires_at>now()
     and u.is_active=true and u.is_field_agent=true;
  if not found then return jsonb_build_object('ok',false,'error','invalid_session'); end if;
  select exists(select 1 from public.customers c where c.id=p_customer_id and c.shop_id=v_user.shop_id
    and trim(coalesce(c.executive,''))=trim(coalesce(v_user.display_name,''))) into v_ok;
  if not v_ok then return jsonb_build_object('ok',false,'error','customer_not_assigned'); end if;
  if p_activity_type not in ('visit','call','whatsapp') then
    return jsonb_build_object('ok',false,'error','invalid_activity');
  end if;
  insert into public.agent_activity_log(shop_id,agent_id,customer_id,activity_type,outcome,notes,gps_lat,gps_lng)
  values(v_user.shop_id,v_user.id,p_customer_id,p_activity_type,'field_checkin',
    left(coalesce(p_notes,'Public check-in'),2000),p_lat,p_lng);
  return jsonb_build_object('ok',true);
end $$;

revoke all on function public.app_field_login(text,text) from public;
revoke all on function public.app_field_customers(text) from public;
revoke all on function public.app_field_checkin(text,uuid,text,text,numeric,numeric) from public;
grant execute on function public.app_field_login(text,text) to anon,authenticated;
grant execute on function public.app_field_customers(text) to anon,authenticated;
grant execute on function public.app_field_checkin(text,uuid,text,text,numeric,numeric) to anon,authenticated;


-- Maintenance and advertisement authorization.
create or replace function public.app_maintenance_status()
returns jsonb language sql security definer set search_path=public,pg_temp as $$
  select coalesce((select jsonb_build_object(
    'enabled',coalesce(maintenance_mode,false),
    'message',coalesce(maintenance_message,''))
    from public.system_config where id=1),
    jsonb_build_object('enabled',false,'message',''))
$$;

create or replace function public.app_set_maintenance(p_token text,p_enabled boolean,p_message text)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare v_role text;
begin
  select u.role into v_role from public.app_sessions s join public.users u on u.id=s.user_id
   where s.token_hash=encode(digest(p_token,'sha256'),'hex')
     and s.revoked_at is null and s.expires_at>now() and u.is_active=true;
  if v_role is distinct from 'super_admin' then raise exception 'access_denied'; end if;
  insert into public.system_config(id,maintenance_mode,maintenance_message,updated_at)
  values(1,coalesce(p_enabled,false),left(coalesce(p_message,''),500),now())
  on conflict(id) do update set maintenance_mode=excluded.maintenance_mode,
    maintenance_message=excluded.maintenance_message,updated_at=now();
  return jsonb_build_object('ok',true);
end $$;

create or replace function public.app_active_ads(p_token text)
returns setof public.ads language plpgsql security definer set search_path=public,pg_temp as $$
declare v_shop uuid;
begin
  select u.shop_id into v_shop from public.app_sessions s join public.users u on u.id=s.user_id
   where s.token_hash=encode(digest(p_token,'sha256'),'hex')
     and s.revoked_at is null and s.expires_at>now() and u.is_active=true;
  if not found then raise exception 'invalid_session'; end if;
  return query select a.* from public.ads a where a.is_active=true
    and a.start_at<=now() and a.end_at>=now()
    and (a.target_type='all' or (a.target_type='shop' and a.target_shop_id=v_shop))
    order by a.created_at desc;
end $$;

create or replace function public.app_manage_ads(p_token text,p_action text,p_payload jsonb)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare v_role text; v_id uuid; v_row public.ads%rowtype;
begin
  select u.role into v_role from public.app_sessions s join public.users u on u.id=s.user_id
   where s.token_hash=encode(digest(p_token,'sha256'),'hex')
     and s.revoked_at is null and s.expires_at>now() and u.is_active=true;
  if v_role is distinct from 'super_admin' then raise exception 'access_denied'; end if;
  if p_action='list' then
    return coalesce((select jsonb_agg(to_jsonb(a) order by a.created_at desc) from public.ads a),'[]'::jsonb);
  elsif p_action='delete' then
    v_id:=(p_payload->>'id')::uuid; delete from public.ads where id=v_id;
    return jsonb_build_object('ok',true);
  elsif p_action in ('create','update') then
    if length(trim(coalesce(p_payload->>'title','')))<1 then raise exception 'title_required'; end if;
    if (p_payload->>'end_at')::timestamptz <= (p_payload->>'start_at')::timestamptz then
      raise exception 'invalid_schedule';
    end if;
    if p_action='create' then
      insert into public.ads(title,description,image_url,link_url,cta_text,target_type,target_shop_id,start_at,end_at,is_active)
      values(left(p_payload->>'title',150),left(coalesce(p_payload->>'description',''),500),
        nullif(p_payload->>'image_url',''),nullif(p_payload->>'link_url',''),
        left(coalesce(p_payload->>'cta_text','Learn More'),50),coalesce(p_payload->>'target_type','all'),
        nullif(p_payload->>'target_shop_id','')::uuid,(p_payload->>'start_at')::timestamptz,
        (p_payload->>'end_at')::timestamptz,coalesce((p_payload->>'is_active')::boolean,false))
      returning * into v_row;
    else
      v_id:=(p_payload->>'id')::uuid;
      update public.ads set title=left(p_payload->>'title',150),
        description=left(coalesce(p_payload->>'description',''),500),
        image_url=nullif(p_payload->>'image_url',''),link_url=nullif(p_payload->>'link_url',''),
        cta_text=left(coalesce(p_payload->>'cta_text','Learn More'),50),
        target_type=coalesce(p_payload->>'target_type','all'),
        target_shop_id=nullif(p_payload->>'target_shop_id','')::uuid,
        start_at=(p_payload->>'start_at')::timestamptz,end_at=(p_payload->>'end_at')::timestamptz,
        is_active=coalesce((p_payload->>'is_active')::boolean,false)
       where id=v_id returning * into v_row;
    end if;
    return to_jsonb(v_row);
  end if;
  raise exception 'invalid_action';
end $$;

create or replace function public.app_ad_click(p_token text,p_ad_id uuid)
returns void language plpgsql security definer set search_path=public,pg_temp as $$
begin
  if not exists(select 1 from public.app_sessions s where
    s.token_hash=encode(digest(p_token,'sha256'),'hex') and s.revoked_at is null and s.expires_at>now())
    then raise exception 'invalid_session'; end if;
  update public.ads set clicks=clicks+1 where id=p_ad_id and is_active=true
    and start_at<=now() and end_at>=now();
end $$;

revoke all on function public.app_maintenance_status() from public;
revoke all on function public.app_set_maintenance(text,boolean,text) from public;
revoke all on function public.app_active_ads(text) from public;
revoke all on function public.app_manage_ads(text,text,jsonb) from public;
revoke all on function public.app_ad_click(text,uuid) from public;
grant execute on function public.app_maintenance_status() to anon,authenticated;
grant execute on function public.app_set_maintenance(text,boolean,text) to anon,authenticated;
grant execute on function public.app_active_ads(text) to anon,authenticated;
grant execute on function public.app_manage_ads(text,text,jsonb) to anon,authenticated;
grant execute on function public.app_ad_click(text,uuid) to anon,authenticated;

drop policy if exists "ads_public_manage" on public.ads;
drop policy if exists "ads_public_read" on public.ads;
revoke all on public.ads from anon,authenticated;
revoke all on public.system_config from anon,authenticated;
