-- Extensions and shared helper functions used by every table below.

create extension if not exists "pgcrypto" with schema extensions;

-- Generic "touch updated_at" trigger, attached to every table that has one.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function public.set_updated_at() is
  'Trigger function: sets updated_at = now() on every UPDATE.';

-- Human-friendly, unique order numbers (e.g. ORD-20260726-9F3A1C2B).
-- Collision risk is negligible (8 hex chars of a UUID per day), but the
-- unique constraint on orders.order_number is the real guarantee.
create or replace function public.generate_order_number()
returns text
language sql
as $$
  select 'ORD-' || to_char(now(), 'YYYYMMDD') || '-' ||
         upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
$$;

comment on function public.generate_order_number() is
  'Generates a human-friendly order number, e.g. ORD-20260726-9F3A1C2B.';
