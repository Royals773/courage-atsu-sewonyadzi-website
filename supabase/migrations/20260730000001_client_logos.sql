-- Phase 8 (Premium Personal Brand Content System): client/organisation logos
-- shown in the homepage "Trusted by" strip. Mirrors the press_items shape.

create table public.client_logos (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_path text not null,
  website_url text,
  is_published boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index client_logos_published_idx on public.client_logos (is_published, position);

create trigger set_updated_at
  before update on public.client_logos
  for each row execute function public.set_updated_at();

alter table public.client_logos enable row level security;

create policy "Anyone can view published client logos"
  on public.client_logos for select
  to anon, authenticated
  using (is_published = true);

create policy "Admins manage client logos"
  on public.client_logos for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
