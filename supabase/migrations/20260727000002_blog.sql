-- Blog CMS: categories, tags, posts.

create type public.blog_post_status as enum ('draft', 'scheduled', 'published');

create table public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at
  before update on public.blog_categories
  for each row execute function public.set_updated_at();

create table public.blog_tags (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  -- Markdown source, rendered to HTML at read time on the public site.
  content text not null default '',
  category_id uuid references public.blog_categories (id) on delete set null,
  author_id uuid references auth.users (id) on delete set null,
  featured_image_path text,
  seo_title text,
  seo_description text,
  status public.blog_post_status not null default 'draft',
  published_at timestamptz,
  scheduled_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.blog_posts is
  'content is Markdown, rendered to HTML for display. status=scheduled posts become visible once scheduled_at has passed (enforced in the storefront query, not by a background job).';
comment on column public.blog_posts.featured_image_path is 'Path within the "media" Supabase Storage bucket.';

create index blog_posts_status_idx on public.blog_posts (status) where deleted_at is null;
create index blog_posts_published_at_idx on public.blog_posts (published_at desc);
create index blog_posts_category_idx on public.blog_posts (category_id);

create trigger set_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

create table public.blog_post_tags (
  post_id uuid not null references public.blog_posts (id) on delete cascade,
  tag_id uuid not null references public.blog_tags (id) on delete cascade,
  primary key (post_id, tag_id)
);

create index blog_post_tags_tag_idx on public.blog_post_tags (tag_id);
