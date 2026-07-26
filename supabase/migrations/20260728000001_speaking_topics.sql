-- Phase 5 (Speaking Platform): CMS-managed speaking topics, each with its
-- own learning objectives, audience, duration, delivery formats and FAQs.

create table public.speaking_topics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  learning_objectives text[] not null default '{}',
  audience text,
  duration text,
  delivery_format text[] not null default '{}',
  is_featured boolean not null default false,
  is_published boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index speaking_topics_published_idx on public.speaking_topics (is_published, position);

create trigger set_updated_at
  before update on public.speaking_topics
  for each row execute function public.set_updated_at();

create table public.speaking_topic_faqs (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.speaking_topics(id) on delete cascade,
  question text not null,
  answer text not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index speaking_topic_faqs_topic_idx on public.speaking_topic_faqs (topic_id, position);
