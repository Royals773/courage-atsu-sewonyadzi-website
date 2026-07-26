-- Phase 5 (Speaking Platform): the booking enquiry pipeline.

create type public.speaking_enquiry_status as enum (
  'new',
  'contacted',
  'discovery',
  'proposal_sent',
  'negotiating',
  'confirmed',
  'delivered',
  'closed'
);

create table public.speaking_enquiries (
  id uuid primary key default gen_random_uuid(),
  organisation text not null,
  contact_name text not null,
  email text not null,
  phone text,
  event_type text not null,
  venue text,
  country text,
  audience_size integer,
  event_date date,
  budget_range text,
  preferred_topic_id uuid references public.speaking_topics(id) on delete set null,
  notes text,
  status public.speaking_enquiry_status not null default 'new',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index speaking_enquiries_status_idx on public.speaking_enquiries (status, created_at desc);

create trigger set_updated_at
  before update on public.speaking_enquiries
  for each row execute function public.set_updated_at();
