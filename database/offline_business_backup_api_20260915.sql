-- Recountix per-business offline backup API
create or replace function public.app_backup_export(p_token text, p_shop_id uuid default null)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user public.users%rowtype;
  v_shop uuid;
  v_shop_row public.shops%rowtype;
  v_table text;
  v_rows jsonb;
  v_tables jsonb := '{}'::jsonb;
begin
  select u.* into v_user
  from public.app_sessions s join public.users u on u.id=s.user_id
  where s.token_hash=encode(extensions.digest(p_token,'sha256'),'hex')
    and s.revoked_at is null and s.expires_at>now() and u.is_active=true;
  if not found then raise exception 'invalid_session'; end if;

  if v_user.role='super_admin' then
    v_shop:=coalesce(p_shop_id,v_user.shop_id);
  else
    v_shop:=v_user.shop_id;
    if p_shop_id is not null and p_shop_id<>v_shop then raise exception 'access_denied'; end if;
  end if;
  if v_shop is null then raise exception 'shop_required'; end if;
  select * into v_shop_row from public.shops where id=v_shop and is_active=true;
  if not found then raise exception 'invalid_shop'; end if;

  foreach v_table in array array['settings','customers','customer_invoices','promises_to_pay','recoveries','customer_balances','agent_tasks','agent_activity_log','reminder_queue','payment_links','legal_notices','escalations','receipts','erp_sync_log','reminder_rules']
  loop
    execute format('select coalesce(jsonb_agg(to_jsonb(t)),''[]''::jsonb) from public.%I t where t.shop_id=$1',v_table)
      into v_rows using v_shop;
    v_tables:=v_tables||jsonb_build_object(v_table,v_rows);
  end loop;

  return jsonb_build_object(
    'format','recountix-offline-backup',
    'version',1,
    'shop_id',v_shop,
    'shop_code',v_shop_row.code,
    'shop_name',v_shop_row.name,
    'exported_at',now(),
    'tables',v_tables
  );
end;
$$;

create or replace function public.app_backup_restore(p_token text, p_backup jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user public.users%rowtype;
  v_shop uuid;
  v_table text;
  v_rows jsonb;
  v_row jsonb;
  v_counts jsonb:='{}'::jsonb;
begin
  select u.* into v_user
  from public.app_sessions s join public.users u on u.id=s.user_id
  where s.token_hash=encode(extensions.digest(p_token,'sha256'),'hex')
    and s.revoked_at is null and s.expires_at>now() and u.is_active=true;
  if not found then raise exception 'invalid_session'; end if;
  if coalesce(p_backup->>'format','')<>'recountix-offline-backup'
     or coalesce((p_backup->>'version')::int,0)<>1 then
    raise exception 'invalid_backup_format';
  end if;
  v_shop:=(p_backup->>'shop_id')::uuid;
  if v_user.role<>'super_admin' and v_user.shop_id<>v_shop then raise exception 'shop_mismatch'; end if;
  if not exists(select 1 from public.shops where id=v_shop and is_active=true) then raise exception 'invalid_shop'; end if;

  foreach v_table in array array['settings','customers','customer_invoices','promises_to_pay','recoveries','customer_balances','agent_tasks','agent_activity_log','reminder_queue','payment_links','legal_notices','escalations','receipts','erp_sync_log','reminder_rules']
  loop
    v_rows:=coalesce(p_backup->'tables'->v_table,'[]'::jsonb);
    if jsonb_typeof(v_rows)<>'array' then raise exception 'invalid_table_data:%',v_table; end if;
    for v_row in select value from jsonb_array_elements(v_rows)
    loop
      if coalesce(v_row->>'shop_id','')<>v_shop::text then raise exception 'shop_mismatch:%',v_table; end if;
    end loop;
  end loop;

  -- Break the only circular reference; it is restored after recoveries exist.
  v_rows:=coalesce(p_backup->'tables'->'promises_to_pay','[]'::jsonb);
  select coalesce(jsonb_agg(value-'kept_recovery_id'),'[]'::jsonb) into v_rows
    from jsonb_array_elements(v_rows);
  execute 'insert into public.settings select * from jsonb_populate_recordset(null::public.settings,$1) on conflict do nothing'
    using coalesce(p_backup->'tables'->'settings','[]'::jsonb);
  execute 'insert into public.customers select * from jsonb_populate_recordset(null::public.customers,$1) on conflict do nothing'
    using coalesce(p_backup->'tables'->'customers','[]'::jsonb);
  execute 'insert into public.customer_invoices select * from jsonb_populate_recordset(null::public.customer_invoices,$1) on conflict do nothing'
    using coalesce(p_backup->'tables'->'customer_invoices','[]'::jsonb);
  execute 'insert into public.promises_to_pay select * from jsonb_populate_recordset(null::public.promises_to_pay,$1) on conflict do nothing'
    using v_rows;
  execute 'insert into public.recoveries select * from jsonb_populate_recordset(null::public.recoveries,$1) on conflict do nothing'
    using coalesce(p_backup->'tables'->'recoveries','[]'::jsonb);

  for v_row in select value from jsonb_array_elements(coalesce(p_backup->'tables'->'promises_to_pay','[]'::jsonb))
  loop
    if nullif(v_row->>'kept_recovery_id','') is not null then
      update public.promises_to_pay p
      set kept_recovery_id=(v_row->>'kept_recovery_id')::uuid
      where p.id=(v_row->>'id')::uuid and p.shop_id=v_shop
        and exists(select 1 from public.recoveries r where r.id=(v_row->>'kept_recovery_id')::uuid and r.shop_id=v_shop);
    end if;
  end loop;

  foreach v_table in array array['customer_balances','agent_tasks','agent_activity_log','reminder_queue','payment_links','legal_notices','escalations','receipts','erp_sync_log','reminder_rules']
  loop
    v_rows:=coalesce(p_backup->'tables'->v_table,'[]'::jsonb);
    execute format('insert into public.%I select * from jsonb_populate_recordset(null::public.%I,$1) on conflict do nothing',v_table,v_table)
      using v_rows;
  end loop;

  foreach v_table in array array['settings','customers','customer_invoices','promises_to_pay','recoveries','customer_balances','agent_tasks','agent_activity_log','reminder_queue','payment_links','legal_notices','escalations','receipts','erp_sync_log','reminder_rules']
  loop
    v_counts:=v_counts||jsonb_build_object(v_table,jsonb_array_length(coalesce(p_backup->'tables'->v_table,'[]'::jsonb)));
  end loop;
  insert into public.audit_log(shop_id,user_id,username,action,entity_type,details)
  values(v_shop,v_user.id,v_user.username,'backup_restore','shop',v_counts::text);
  return jsonb_build_object('ok',true,'shop_id',v_shop,'processed',v_counts);
end;
$$;

revoke all on function public.app_backup_export(text,uuid) from public;
revoke all on function public.app_backup_restore(text,jsonb) from public;
grant execute on function public.app_backup_export(text,uuid) to anon,authenticated;
grant execute on function public.app_backup_restore(text,jsonb) to anon,authenticated;