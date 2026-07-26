-- Editable-without-code content: testimonials, FAQs, site settings, and
-- newsletter subscribers.

create type public.testimonial_category as enum (
  'book-review', 'speaking', 'consulting', 'event-organiser', 'media'
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  author_name text not null,
  author_role text,
  organisation text,
  category public.testimonial_category not null,
  is_approved boolean not null default false,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.testimonials is 'Only is_approved = true rows are ever shown publicly.';

create index testimonials_approved_idx on public.testimonials (is_approved);

create trigger set_updated_at
  before update on public.testimonials
  for each row execute function public.set_updated_at();

create type public.faq_category as enum (
  'book-orders', 'delivery', 'digital-downloads', 'refunds',
  'speaking-engagements', 'travel', 'courses', 'media-enquiries', 'general-enquiries'
);

create table public.faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category public.faq_category not null,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index faq_items_category_idx on public.faq_items (category, position);

create trigger set_updated_at
  before update on public.faq_items
  for each row execute function public.set_updated_at();

-- site_settings: a flexible key/value store (JSONB values) for everything
-- under Settings + the editable marketing-page content sections (hero,
-- about, footer, navigation, contact, newsletter section, SEO defaults,
-- brand colours, logo, social links, email settings). New settings can be
-- introduced without a migration — the admin UI and storefront agree on
-- key names in application code (see src/lib/settings/keys.ts).

create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create trigger set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  first_name text,
  consent boolean not null default false,
  source text,
  tags text[] not null default '{}',
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create index newsletter_subscribers_active_idx on public.newsletter_subscribers (unsubscribed_at) where unsubscribed_at is null;
