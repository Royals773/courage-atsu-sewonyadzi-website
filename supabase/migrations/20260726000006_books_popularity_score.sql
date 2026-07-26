-- Additive column needed for the "Most Popular" catalogue sort, carried
-- over from the Step 2 placeholder field on the static content layer
-- (src/lib/content/types.ts). A real popularity signal (e.g. rolling
-- order_items volume) can replace this later without changing callers.

alter table public.books
  add column popularity_score integer not null default 0;

comment on column public.books.popularity_score is
  'Placeholder "Most Popular" ranking signal (higher = more popular) until real order/sales aggregation exists. Never displayed to users as a stat.';
