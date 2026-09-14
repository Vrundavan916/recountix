-- Recountix generic multi-business platform migration
-- Applied to staging through the Supabase connector on 2026-09-14.
alter table public.shops add column if not exists business_type text not null default 'Other';

alter table public.shops drop constraint if exists shops_business_type_check;
alter table public.shops add constraint shops_business_type_check
check (business_type in (
  'Jewellery','Finance / Loan','Electronics','Furniture','Automobile',
  'Wholesale / Distribution','Education / Fees','Real Estate','Services','Other'
));

-- The deployed migration also creates public.app_set_business_type(text, uuid, text),
-- a SECURITY DEFINER RPC that verifies an active Super Admin session before updating.
