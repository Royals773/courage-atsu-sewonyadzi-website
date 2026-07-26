-- Phase 5 (Speaking Platform): confirmed engagements and the availability
-- calendar. A calendar entry's unique `entry_date` is what actually
-- prevents double-booking at the database layer (application code also
-- checks before insert so the admin gets a friendly error, not a raw
-- constraint violation).

create table public.speaking_events (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid references public.speaking_enquiries(id) on delete set null,
  topic_id uuid references public.speaking_topics(id) on delete set null,
  client text not null,
  venue text,
  event_date date not null,
  fee_amount integer,
  expenses_amount integer,
  notes text,
  presentation_storage_path text,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index speaking_events_date_idx on public.speaking_events (event_date);

create trigger set_updated_at
  before update on public.speaking_events
  for each row execute function public.set_updated_at();

create type public.speaking_calendar_status as enum ('blocked', 'reserved', 'confirmed');

create table public.speaking_calendar_entries (
  id uuid primary key default gen_random_uuid(),
  entry_date date not null unique,
  status public.speaking_calendar_status not null,
  event_id uuid references public.speaking_events(id) on delete set null,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index speaking_calendar_entries_date_idx on public.speaking_calendar_entries (entry_date);

create trigger set_updated_at
  before update on public.speaking_calendar_entries
  for each row execute function public.set_updated_at();
