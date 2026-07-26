-- RLS for every table introduced in Step 4.
--
-- Posture: public storefront content (published blog posts, approved
-- testimonials, FAQs, site settings) is readable by anon/authenticated
-- via `is_admin()`-gated write policies. Fully admin-only tables (media,
-- newsletter subscribers, blog drafts) have no anon/authenticated policy
-- at all — the admin UI reads/writes them through server actions using
-- the service-role client (same pattern as Step 1/3), which also lets us
-- enforce the finer-grained editor-vs-administrator distinction in
-- application code rather than in SQL.

alter table public.blog_categories enable row level security;
alter table public.blog_tags enable row level security;
alter table public.blog_posts enable row level security;
alter table public.blog_post_tags enable row level security;
alter table public.media_folders enable row level security;
alter table public.media_items enable row level security;
alter table public.testimonials enable row level security;
alter table public.faq_items enable row level security;
alter table public.site_settings enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- Blog: public read of published content, full admin read/write ------------

create policy "Anyone can view blog categories"
  on public.blog_categories for select
  to anon, authenticated
  using (true);

create policy "Admins manage blog categories"
  on public.blog_categories for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Anyone can view blog tags"
  on public.blog_tags for select
  to anon, authenticated
  using (true);

create policy "Admins manage blog tags"
  on public.blog_tags for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Anyone can view published posts"
  on public.blog_posts for select
  to anon, authenticated
  using (
    deleted_at is null
    and status = 'published'
    and (scheduled_at is null or scheduled_at <= now())
  );

create policy "Admins view and manage all posts"
  on public.blog_posts for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Anyone can view tags of published posts"
  on public.blog_post_tags for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.blog_posts p
      where p.id = post_id and p.status = 'published' and p.deleted_at is null
    )
  );

create policy "Admins manage post tags"
  on public.blog_post_tags for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Media library: admin-only ---------------------------------------------------

create policy "Admins manage media folders"
  on public.media_folders for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins manage media items"
  on public.media_items for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Testimonials: public read of approved rows only -----------------------------

create policy "Anyone can view approved testimonials"
  on public.testimonials for select
  to anon, authenticated
  using (is_approved = true);

create policy "Admins manage testimonials"
  on public.testimonials for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- FAQs: public read -----------------------------------------------------------

create policy "Anyone can view faqs"
  on public.faq_items for select
  to anon, authenticated
  using (true);

create policy "Admins manage faqs"
  on public.faq_items for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Site settings: public read (no secrets are stored here — see the Step 4
-- report), admin write ---------------------------------------------------

create policy "Anyone can view site settings"
  on public.site_settings for select
  to anon, authenticated
  using (true);

create policy "Admins manage site settings"
  on public.site_settings for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- newsletter_subscribers: no anon/authenticated policy at all. Signups go
-- through a server action (service role) so we can validate/rate-limit;
-- admins read/export through the same service-role path.
