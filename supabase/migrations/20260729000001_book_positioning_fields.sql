-- Phase 8: book positioning fields, so each book page can answer "why it
-- matters" and "what a reader gets out of it" directly, alongside the
-- existing key_lessons/who_its_for fields.

alter table public.books
  add column why_it_matters text,
  add column practical_outcomes text[] not null default '{}';

comment on column public.books.why_it_matters is 'Short statement of why this book matters / the stakes it addresses.';
comment on column public.books.practical_outcomes is 'What a reader can practically do differently after reading — distinct from key_lessons (insights) and who_its_for (audience).';
