-- Contact form backend. The public contact page previously rendered a
-- disabled form with no way to actually submit — this gives it somewhere
-- to write to, matching the speaking_enquiries pattern: public INSERT via
-- the form, admin-only SELECT (nobody but an admin can read submitted
-- messages back), and an email notification sent on submit rather than
-- requiring an admin UI to notice new rows.

create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  created_at timestamptz not null default now()
);

create index contact_submissions_created_at_idx on public.contact_submissions (created_at desc);

alter table public.contact_submissions enable row level security;

create policy "Anyone can submit a contact message"
  on public.contact_submissions for insert
  to anon, authenticated
  with check (true);

create policy "Admins manage contact submissions"
  on public.contact_submissions for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
