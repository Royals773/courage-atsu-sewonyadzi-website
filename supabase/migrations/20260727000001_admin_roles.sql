-- Admin roles: Super Admin, Administrator, Editor.
--
-- One role per user, stored separately from auth.users so role checks
-- never require touching Supabase's managed auth schema. There is no
-- signup flow for admin accounts — the first Super Admin is created by
-- hand (see the setup guide in the Step 4 report); Super Admins can then
-- promote/demote other already-registered users from the admin UI.

create type public.admin_role as enum ('super_admin', 'administrator', 'editor');

create table public.user_roles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role public.admin_role not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.user_roles is
  'Grants an admin role to a user. Absence of a row means "not an admin" (an ordinary customer).';

create trigger set_updated_at
  before update on public.user_roles
  for each row execute function public.set_updated_at();

-- Role-check helpers -----------------------------------------------------------
--
-- security definer + a fixed search_path so these can be called from RLS
-- policies on public.user_roles itself without recursive-policy issues,
-- and from policies on every other admin-managed table.

create or replace function public.current_admin_role()
returns public.admin_role
language sql
security definer
set search_path = public
stable
as $$
  select role from public.user_roles where user_id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.user_roles where user_id = auth.uid());
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'super_admin'
  );
$$;

-- Administrator and Super Admin can manage commerce (books, orders,
-- customers, discount codes, settings). Editors are limited to content
-- (blog, media, testimonials, FAQs) — enforced both here and again at the
-- application layer for defense in depth.
create or replace function public.can_manage_commerce()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role in ('super_admin', 'administrator')
  );
$$;

comment on function public.is_admin() is 'True for any admin role (super_admin, administrator, editor).';
comment on function public.can_manage_commerce() is 'True for super_admin/administrator only — editors cannot manage commerce.';

alter table public.user_roles enable row level security;

-- Admins can see the full admin roster (needed to render a user-management
-- screen); only Super Admins can change roles.
create policy "Admins can view all admin roles"
  on public.user_roles for select
  to authenticated
  using (public.is_admin());

create policy "Super admins manage admin roles"
  on public.user_roles for all
  to authenticated
  using (public.is_super_admin())
  with check (public.is_super_admin());
