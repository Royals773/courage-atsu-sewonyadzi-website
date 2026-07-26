-- Phase 8: seed the thought-leadership category taxonomy so /admin/blog
-- has a sensible starting set reflecting the broadened leadership
-- positioning (adult social care is one category among these, not the
-- frame). Idempotent — safe to run against an existing database; admins
-- can rename/add/remove freely afterwards via /admin/blog.

insert into public.blog_categories (slug, name) values
  ('leadership', 'Leadership'),
  ('strategy', 'Strategy'),
  ('governance', 'Governance'),
  ('culture', 'Culture'),
  ('business', 'Business'),
  ('entrepreneurship', 'Entrepreneurship'),
  ('ai', 'AI'),
  ('adult-social-care', 'Adult Social Care'),
  ('africa', 'Africa'),
  ('personal-growth', 'Personal Growth')
on conflict (slug) do nothing;
