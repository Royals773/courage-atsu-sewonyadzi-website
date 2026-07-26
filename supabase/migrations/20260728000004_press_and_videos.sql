-- Phase 5 (Speaking Platform): press page and video library.

create type public.press_item_type as enum (
  'interview',
  'podcast',
  'publication',
  'video',
  'press_release'
);

create table public.press_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type public.press_item_type not null,
  publication_name text,
  url text,
  description text,
  published_date date,
  is_featured boolean not null default false,
  is_published boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index press_items_published_idx on public.press_items (is_published, published_date desc);

create trigger set_updated_at
  before update on public.press_items
  for each row execute function public.set_updated_at();

create type public.video_platform as enum ('youtube', 'vimeo', 'upload');

create table public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  platform public.video_platform not null,
  video_url text,
  storage_path text,
  thumbnail_storage_path text,
  category text,
  is_featured boolean not null default false,
  is_published boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index videos_published_idx on public.videos (is_published, position);

create trigger set_updated_at
  before update on public.videos
  for each row execute function public.set_updated_at();
