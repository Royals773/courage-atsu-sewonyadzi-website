-- Book catalogue: categories, books, formats, images, inventory.

create type public.book_status as enum ('draft', 'published', 'archived');
create type public.book_format_type as enum ('paperback', 'hardcover', 'ebook', 'audiobook', 'signed', 'bundle');
create type public.stock_status as enum ('in_stock', 'low_stock', 'preorder', 'out_of_stock');

-- book_categories ------------------------------------------------------

create table public.book_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.book_categories is 'Book category taxonomy (Leadership, Business, Care Quality, etc).';

create trigger set_updated_at
  before update on public.book_categories
  for each row execute function public.set_updated_at();

-- books ------------------------------------------------------------------

create table public.books (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  description text,
  author_note text,
  key_lessons text[] not null default '{}',
  who_its_for text[] not null default '{}',
  table_of_contents jsonb not null default '[]',
  publication_date date,
  featured boolean not null default false,
  is_new boolean not null default false,
  has_sample_chapter boolean not null default false,
  sample_chapter_storage_path text,
  status public.book_status not null default 'draft',
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.books is 'Core book records. A book is published for sale via one or more book_formats.';
comment on column public.books.table_of_contents is 'Array of {"title": string} objects, in reading order.';
comment on column public.books.sample_chapter_storage_path is 'Path within the private "book-samples" Supabase Storage bucket, not a public URL.';
comment on column public.books.deleted_at is 'Soft delete marker. Non-null rows should be excluded from all storefront queries.';

create index books_status_idx on public.books (status) where deleted_at is null;
create index books_featured_idx on public.books (featured) where deleted_at is null and status = 'published';
create index books_publication_date_idx on public.books (publication_date desc);

create trigger set_updated_at
  before update on public.books
  for each row execute function public.set_updated_at();

-- book_category_books (many-to-many join) --------------------------------

create table public.book_category_books (
  book_id uuid not null references public.books (id) on delete cascade,
  category_id uuid not null references public.book_categories (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (book_id, category_id)
);

comment on table public.book_category_books is
  'Join table for the books <-> book_categories many-to-many relationship. Not in the original table list but required for relational integrity instead of a denormalised category array.';

create index book_category_books_category_idx on public.book_category_books (category_id);

-- book_formats -------------------------------------------------------------

create table public.book_formats (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books (id) on delete cascade,
  format_type public.book_format_type not null,
  label text not null,
  price_amount integer not null check (price_amount >= 0),
  currency text not null default 'GBP',
  is_digital boolean not null default false,
  sku text unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.book_formats is 'Purchasable formats for a book (paperback, ebook, signed, bundle, ...).';
comment on column public.book_formats.price_amount is 'Price in minor currency units (e.g. pence) to avoid floating-point rounding errors.';

create index book_formats_book_id_idx on public.book_formats (book_id);
create index book_formats_active_idx on public.book_formats (is_active);

create trigger set_updated_at
  before update on public.book_formats
  for each row execute function public.set_updated_at();

-- book_images ----------------------------------------------------------------

create table public.book_images (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books (id) on delete cascade,
  storage_path text not null,
  alt_text text,
  position integer not null default 0,
  is_cover boolean not null default false,
  created_at timestamptz not null default now()
);

comment on table public.book_images is 'References to cover/gallery images stored in the "book-images" Supabase Storage bucket.';
comment on column public.book_images.storage_path is 'Path within the "book-images" Storage bucket, not a public URL.';

create index book_images_book_id_idx on public.book_images (book_id, position);
create unique index book_images_one_cover_per_book_idx on public.book_images (book_id) where is_cover;

-- inventory --------------------------------------------------------------------

create table public.inventory (
  id uuid primary key default gen_random_uuid(),
  book_format_id uuid not null unique references public.book_formats (id) on delete cascade,
  tracks_stock boolean not null default true,
  quantity_on_hand integer check (quantity_on_hand >= 0),
  quantity_reserved integer not null default 0 check (quantity_reserved >= 0),
  reorder_threshold integer not null default 0,
  stock_status public.stock_status not null default 'out_of_stock',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.inventory is 'One row per book_format. Digital formats typically have tracks_stock = false and unlimited (null) quantity.';
comment on column public.inventory.quantity_on_hand is 'Null means unlimited stock (used for digital formats). Ignored when tracks_stock = false.';

create trigger set_updated_at
  before update on public.inventory
  for each row execute function public.set_updated_at();
