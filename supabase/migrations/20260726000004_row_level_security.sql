-- Row Level Security for every table created so far.
--
-- General posture:
--   * Catalogue tables (books, categories, formats, images, inventory) are
--     publicly readable (storefront needs this with the anon key) but have
--     no anon/authenticated write policies at all — content is managed
--     server-side with the service role key (which bypasses RLS entirely),
--     matching "only authorised administrators can manage content".
--   * Basket + address tables are owned by the authenticated user
--     (auth.uid() = user_id) and fully self-service.
--   * Guest baskets (user_id is null, identified by session_token) are
--     intentionally NOT reachable via the anon/authenticated RLS policies
--     below. Guest basket reads/writes must go through server-side code
--     (Route Handlers / Server Actions) using the service role key, which
--     verifies the session_token from an httpOnly cookie before touching
--     the row. This avoids trusting a client-supplied token as an RLS
--     credential. -- Decision flagged for approval in the Step 1 report.
--   * orders/order_items are readable by their owning user, but never
--     writable by anon/authenticated — only server-side checkout code and
--     Stripe webhook handlers (service role) create or transition orders.
--   * payments, digital_downloads and discount_codes have NO client-facing
--     policies at all (neither anon nor authenticated). They are
--     service-role-only for now:
--       - payments: contains provider identifiers or raw responses that
--         should never be client-readable.
--       - digital_downloads: storage_path must never be exposed directly;
--         a future secure Route Handler will validate download_token
--         server-side and stream/redirect to the file, rather than the
--         client selecting this table.
--       - discount_codes: a public SELECT policy (even "is_active = true")
--         would let anyone enumerate every valid discount code. Validation
--         will instead go through a server-side check (or a SECURITY
--         DEFINER RPC) in a later step.

alter table public.book_categories enable row level security;
alter table public.books enable row level security;
alter table public.book_category_books enable row level security;
alter table public.book_formats enable row level security;
alter table public.book_images enable row level security;
alter table public.inventory enable row level security;
alter table public.baskets enable row level security;
alter table public.basket_items enable row level security;
alter table public.discount_codes enable row level security;
alter table public.shipping_addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.digital_downloads enable row level security;

-- Catalogue: public read -----------------------------------------------------

create policy "Anyone can view book categories"
  on public.book_categories for select
  to anon, authenticated
  using (true);

create policy "Anyone can view published books"
  on public.books for select
  to anon, authenticated
  using (status = 'published' and deleted_at is null);

create policy "Anyone can view categories of published books"
  on public.book_category_books for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.books b
      where b.id = book_id and b.status = 'published' and b.deleted_at is null
    )
  );

create policy "Anyone can view active formats of published books"
  on public.book_formats for select
  to anon, authenticated
  using (
    is_active and exists (
      select 1 from public.books b
      where b.id = book_id and b.status = 'published' and b.deleted_at is null
    )
  );

create policy "Anyone can view images of published books"
  on public.book_images for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.books b
      where b.id = book_id and b.status = 'published' and b.deleted_at is null
    )
  );

create policy "Anyone can view stock status of published books"
  on public.inventory for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.book_formats bf
      join public.books b on b.id = bf.book_id
      where bf.id = book_format_id
        and bf.is_active
        and b.status = 'published'
        and b.deleted_at is null
    )
  );

-- Baskets: self-service for signed-in users -----------------------------------

create policy "Users manage their own basket"
  on public.baskets for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Users manage items in their own basket"
  on public.basket_items for all
  to authenticated
  using (
    exists (select 1 from public.baskets bk where bk.id = basket_id and bk.user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.baskets bk where bk.id = basket_id and bk.user_id = auth.uid())
  );

-- Addresses: self-service for signed-in users ---------------------------------

create policy "Users manage their own addresses"
  on public.shipping_addresses for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Orders: read-only for the owning user, write via service role only ---------

create policy "Users view their own orders"
  on public.orders for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users view items from their own orders"
  on public.order_items for select
  to authenticated
  using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

-- payments, digital_downloads, discount_codes intentionally have no
-- anon/authenticated policies at all (service role only). See the header
-- comment for why.
