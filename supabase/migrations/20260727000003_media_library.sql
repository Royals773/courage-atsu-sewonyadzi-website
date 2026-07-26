-- Media library: folders + items (images, PDFs, ePub, video, audio).
-- Actual files live in the "media" Supabase Storage bucket; these tables
-- are just the organisational metadata layer on top.

create type public.media_file_type as enum ('image', 'pdf', 'epub', 'video', 'audio', 'other');

create table public.media_folders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  parent_id uuid references public.media_folders (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index media_folders_parent_idx on public.media_folders (parent_id);

create table public.media_items (
  id uuid primary key default gen_random_uuid(),
  folder_id uuid references public.media_folders (id) on delete set null,
  file_name text not null,
  storage_path text not null,
  mime_type text not null,
  file_type public.media_file_type not null default 'other',
  size_bytes bigint not null default 0,
  alt_text text,
  uploaded_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

comment on table public.media_items is 'storage_path is within the "media" Storage bucket.';

create index media_items_folder_idx on public.media_items (folder_id);
create index media_items_file_type_idx on public.media_items (file_type);
