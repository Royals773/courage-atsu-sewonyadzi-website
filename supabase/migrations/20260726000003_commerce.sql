-- Commerce: baskets, discounts, addresses, orders, payments, digital downloads.
--
-- These tables reference auth.users(id), so this migration must be run
-- against an actual Supabase project (which provisions the auth schema),
-- not a bare Postgres database.

create type public.basket_status as enum ('active', 'converted', 'abandoned');
create type public.order_status as enum ('pending', 'paid', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'refunded');
create type public.payment_status as enum ('pending', 'succeeded', 'failed', 'refunded', 'partially_refunded');
create type public.discount_type as enum ('percentage', 'fixed_amount');

-- baskets ------------------------------------------------------------------

create table public.baskets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  session_token uuid unique,
  status public.basket_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint baskets_owner_check check (user_id is not null or session_token is not null)
);

comment on table public.baskets is
  'A basket belongs to either a signed-in user (user_id) or a guest, identified by an opaque session_token stored in an httpOnly cookie. Guest baskets are only readable/writable via the service role (see RLS policy notes).';

create unique index baskets_one_active_per_user_idx on public.baskets (user_id) where status = 'active' and user_id is not null;
create index baskets_session_token_idx on public.baskets (session_token);

create trigger set_updated_at
  before update on public.baskets
  for each row execute function public.set_updated_at();

-- basket_items ---------------------------------------------------------------

create table public.basket_items (
  id uuid primary key default gen_random_uuid(),
  basket_id uuid not null references public.baskets (id) on delete cascade,
  book_format_id uuid not null references public.book_formats (id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  unit_price_amount integer not null check (unit_price_amount >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (basket_id, book_format_id)
);

comment on table public.basket_items is 'unit_price_amount is captured at the time the item is added, so later price changes do not silently change an open basket.';

create index basket_items_basket_id_idx on public.basket_items (basket_id);

create trigger set_updated_at
  before update on public.basket_items
  for each row execute function public.set_updated_at();

-- discount_codes ---------------------------------------------------------------

create table public.discount_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text,
  discount_type public.discount_type not null,
  discount_value integer not null check (discount_value > 0),
  currency text not null default 'GBP',
  max_redemptions integer check (max_redemptions > 0),
  times_redeemed integer not null default 0 check (times_redeemed >= 0),
  starts_at timestamptz,
  expires_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint discount_percentage_range check (
    discount_type <> 'percentage' or (discount_value between 1 and 100)
  )
);

comment on table public.discount_codes is
  'discount_value is a whole-number percentage (1-100) for discount_type = percentage, or a minor-currency-unit amount for fixed_amount.';

create trigger set_updated_at
  before update on public.discount_codes
  for each row execute function public.set_updated_at();

-- shipping_addresses -------------------------------------------------------------

create table public.shipping_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  full_name text not null,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  region text,
  postal_code text not null,
  country text not null,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.shipping_addresses is
  'Reused for both shipping and billing addresses (orders has separate shipping_address_id / billing_address_id columns pointing at this same table). Guest addresses have user_id = null and are only reachable via order ownership.';

create index shipping_addresses_user_id_idx on public.shipping_addresses (user_id);

create trigger set_updated_at
  before update on public.shipping_addresses
  for each row execute function public.set_updated_at();

-- orders --------------------------------------------------------------------------

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default public.generate_order_number(),
  user_id uuid references auth.users (id) on delete set null,
  guest_email text,
  status public.order_status not null default 'pending',
  subtotal_amount integer not null check (subtotal_amount >= 0),
  discount_amount integer not null default 0 check (discount_amount >= 0),
  shipping_amount integer not null default 0 check (shipping_amount >= 0),
  tax_amount integer not null default 0 check (tax_amount >= 0),
  total_amount integer not null check (total_amount >= 0),
  currency text not null default 'GBP',
  discount_code_id uuid references public.discount_codes (id) on delete set null,
  shipping_address_id uuid references public.shipping_addresses (id) on delete set null,
  billing_address_id uuid references public.shipping_addresses (id) on delete set null,
  tracking_number text,
  tracking_url text,
  internal_notes text,
  placed_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_owner_check check (user_id is not null or guest_email is not null)
);

comment on table public.orders is 'One row per checkout. Guest orders (user_id null) must carry guest_email for confirmation/lookup.';
comment on column public.orders.internal_notes is 'Admin-only notes, never shown to the customer.';

create index orders_user_id_idx on public.orders (user_id);
create index orders_status_idx on public.orders (status);
create index orders_placed_at_idx on public.orders (placed_at desc);

create trigger set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- order_items ------------------------------------------------------------------------

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  book_format_id uuid references public.book_formats (id) on delete set null,
  book_title text not null,
  format_label text not null,
  is_digital boolean not null default false,
  unit_price_amount integer not null check (unit_price_amount >= 0),
  quantity integer not null check (quantity > 0),
  line_total_amount integer not null check (line_total_amount >= 0),
  created_at timestamptz not null default now()
);

comment on table public.order_items is
  'book_title/format_label/unit_price_amount are snapshotted at purchase time so order history stays accurate even if the book, format or price changes or is deleted later.';

create index order_items_order_id_idx on public.order_items (order_id);
create index order_items_book_format_id_idx on public.order_items (book_format_id);

-- payments -----------------------------------------------------------------------------

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  provider text not null default 'stripe',
  provider_payment_intent_id text unique,
  provider_charge_id text,
  status public.payment_status not null default 'pending',
  amount integer not null check (amount >= 0),
  currency text not null default 'GBP',
  failure_message text,
  refunded_amount integer not null default 0 check (refunded_amount >= 0),
  raw_response jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.payments is
  'One row per payment attempt against an order. provider_payment_intent_id / raw_response are populated once Stripe is wired up in a later step.';

create index payments_order_id_idx on public.payments (order_id);
create index payments_status_idx on public.payments (status);

create trigger set_updated_at
  before update on public.payments
  for each row execute function public.set_updated_at();

-- digital_downloads --------------------------------------------------------------------

create table public.digital_downloads (
  id uuid primary key default gen_random_uuid(),
  order_item_id uuid not null references public.order_items (id) on delete cascade,
  book_format_id uuid not null references public.book_formats (id) on delete cascade,
  storage_path text not null,
  download_token uuid not null default gen_random_uuid() unique,
  expires_at timestamptz not null default (now() + interval '7 days'),
  max_downloads integer not null default 5 check (max_downloads > 0),
  download_count integer not null default 0 check (download_count >= 0),
  last_downloaded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.digital_downloads is
  'Issued after successful payment for a digital order_item. download_token backs a time-limited, single-purpose download link — never expose storage_path directly to the client.';

create index digital_downloads_order_item_id_idx on public.digital_downloads (order_item_id);
create index digital_downloads_token_idx on public.digital_downloads (download_token);

create trigger set_updated_at
  before update on public.digital_downloads
  for each row execute function public.set_updated_at();
