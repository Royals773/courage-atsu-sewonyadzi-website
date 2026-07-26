-- RLS for every table introduced in Phase 5 (Speaking Platform).
--
-- Posture matches Step 4: public read of published/curated content,
-- admin-only for anything operational (enquiries, events, calendar) or
-- still in draft. Enquiries additionally allow an anonymous INSERT so the
-- public booking form can write without authentication, but never a
-- public SELECT — nobody but an admin can read enquiry contents back.

alter table public.speaking_topics enable row level security;
alter table public.speaking_topic_faqs enable row level security;
alter table public.speaking_enquiries enable row level security;
alter table public.speaking_events enable row level security;
alter table public.speaking_calendar_entries enable row level security;
alter table public.press_items enable row level security;
alter table public.videos enable row level security;

-- Speaking topics: public read of published rows -----------------------------

create policy "Anyone can view published speaking topics"
  on public.speaking_topics for select
  to anon, authenticated
  using (is_published = true);

create policy "Admins manage speaking topics"
  on public.speaking_topics for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Anyone can view faqs of published topics"
  on public.speaking_topic_faqs for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.speaking_topics t
      where t.id = topic_id and t.is_published = true
    )
  );

create policy "Admins manage speaking topic faqs"
  on public.speaking_topic_faqs for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Enquiries: public can submit, only admins can read/manage -------------------

create policy "Anyone can submit a speaking enquiry"
  on public.speaking_enquiries for insert
  to anon, authenticated
  with check (true);

create policy "Admins manage speaking enquiries"
  on public.speaking_enquiries for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Events: admin-only, except events explicitly marked public -----------------

create policy "Anyone can view public upcoming events"
  on public.speaking_events for select
  to anon, authenticated
  using (is_public = true);

create policy "Admins manage speaking events"
  on public.speaking_events for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Calendar: admin-only ---------------------------------------------------------

create policy "Admins manage speaking calendar"
  on public.speaking_calendar_entries for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Press: public read of published rows -----------------------------------------

create policy "Anyone can view published press items"
  on public.press_items for select
  to anon, authenticated
  using (is_published = true);

create policy "Admins manage press items"
  on public.press_items for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Videos: public read of published rows -----------------------------------------

create policy "Anyone can view published videos"
  on public.videos for select
  to anon, authenticated
  using (is_published = true);

create policy "Admins manage videos"
  on public.videos for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
