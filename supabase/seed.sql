-- ============================================================================
-- FICTIONAL SEED DATA — for development/demo purposes only.
-- These are placeholder books mirroring src/lib/content/books.ts. Do not
-- present as real published titles, sales, or endorsements.
-- ============================================================================

-- book_categories --------------------------------------------------------------

insert into public.book_categories (id, slug, name, description) values
  ('11111111-1111-1111-1111-111111111101', 'leadership', 'Leadership', 'Fictional seed category — Leadership.'),
  ('11111111-1111-1111-1111-111111111102', 'business', 'Business', 'Fictional seed category — Business.'),
  ('11111111-1111-1111-1111-111111111103', 'personal-development', 'Personal Development', 'Fictional seed category — Personal Development.'),
  ('11111111-1111-1111-1111-111111111104', 'care-quality', 'Care Quality', 'Fictional seed category — Care Quality.'),
  ('11111111-1111-1111-1111-111111111105', 'entrepreneurship', 'Entrepreneurship', 'Fictional seed category — Entrepreneurship.'),
  ('11111111-1111-1111-1111-111111111106', 'africa-investment', 'Africa & Investment', 'Fictional seed category — Africa & Investment.');

-- books ---------------------------------------------------------------------------

insert into public.books (
  id, slug, title, subtitle, description, author_note, key_lessons, who_its_for,
  table_of_contents, publication_date, featured, is_new, has_sample_chapter, status,
  popularity_score
) values
(
  '22222222-2222-2222-2222-222222222201',
  'the-quiet-architecture-of-leadership',
  'The Quiet Architecture of Leadership',
  'Building organisations that outlast the people who lead them',
  '[FICTIONAL SEED] A field-tested guide to designing teams, systems and culture that hold up under pressure — for leaders who want their organisation to work even when they''re not in the room.',
  '[FICTIONAL SEED] Placeholder author''s note — replace with a short, personal reflection on why this book was written.',
  array[
    'How to design decisions systems instead of relying on heroics',
    'Building accountability without fear',
    'Turning frontline insight into strategic change'
  ],
  array[
    'Business owners scaling past founder-led operations',
    'Care-sector leaders responsible for quality and compliance',
    'Managers stepping into their first strategic leadership role'
  ],
  '[
    {"title": "1. The Cost of Heroic Leadership"},
    {"title": "2. Systems, Not Saviours"},
    {"title": "3. Culture as Infrastructure"},
    {"title": "4. Accountability Without Fear"},
    {"title": "5. Leading Through Pressure"}
  ]'::jsonb,
  '2025-03-01', true, true, true, 'published', 92
),
(
  '22222222-2222-2222-2222-222222222202',
  'frontline-to-boardroom',
  'Frontline to Boardroom',
  'A practical playbook for care-sector leaders moving into strategy',
  '[FICTIONAL SEED] Written for professionals who earned their expertise on the frontline and are now navigating the very different demands of strategic leadership and quality governance.',
  '[FICTIONAL SEED] Placeholder author''s note — replace with a short, personal reflection on why this book was written.',
  array[
    'Translating operational excellence into strategic credibility',
    'Building a culture of quality and accountability',
    'Managing regulatory relationships with confidence'
  ],
  array[
    'Care-sector managers moving into senior leadership',
    'Quality and compliance leads',
    'Anyone leading a team through a CQC or regulatory transition'
  ],
  '[
    {"title": "1. Two Different Jobs"},
    {"title": "2. Earning Strategic Trust"},
    {"title": "3. Quality as a Leadership Discipline"},
    {"title": "4. Regulators as Partners"}
  ]'::jsonb,
  '2024-06-10', true, false, true, 'published', 78
),
(
  '22222222-2222-2222-2222-222222222203',
  'the-opportunity-in-between',
  'The Opportunity In Between',
  'Notes on entrepreneurship, investment and building across borders',
  '[FICTIONAL SEED] An exploration of the practical realities — and real opportunities — of building businesses and investing between the UK, Ghana and wider Africa.',
  '[FICTIONAL SEED] Placeholder author''s note — replace with a short, personal reflection on why this book was written.',
  array[
    'Spotting genuine opportunity versus hype',
    'Building trust-based cross-border partnerships',
    'Practical steps for first-time diaspora investors'
  ],
  array[
    'Aspiring entrepreneurs exploring African markets',
    'Diaspora professionals considering their first investment',
    'Community leaders building cross-border initiatives'
  ],
  '[
    {"title": "1. Two Markets, One Mindset"},
    {"title": "2. Due Diligence Across Borders"},
    {"title": "3. Trust as Currency"},
    {"title": "4. Starting Small, Thinking Long"}
  ]'::jsonb,
  '2026-01-15', true, true, false, 'published', 65
);

-- book_category_books --------------------------------------------------------------

insert into public.book_category_books (book_id, category_id) values
  ('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111101'), -- book1 -> leadership
  ('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111102'), -- book1 -> business
  ('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111104'), -- book2 -> care-quality
  ('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111101'), -- book2 -> leadership
  ('22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111105'), -- book3 -> entrepreneurship
  ('22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111106'); -- book3 -> africa-investment

-- book_formats ------------------------------------------------------------------------

insert into public.book_formats (id, book_id, format_type, label, price_amount, is_digital, sku, is_active, digital_file_storage_path) values
  ('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', 'paperback', 'Paperback', 1699, false, 'QAL-PB', true, null),
  ('33333333-3333-3333-3333-333333333302', '22222222-2222-2222-2222-222222222201', 'ebook',     'eBook',     999, true,  'QAL-EB', true, 'ebooks/the-quiet-architecture-of-leadership.epub'),
  ('33333333-3333-3333-3333-333333333303', '22222222-2222-2222-2222-222222222201', 'signed',    'Signed Paperback', 2499, false, 'QAL-SG', true, null),

  ('33333333-3333-3333-3333-333333333304', '22222222-2222-2222-2222-222222222202', 'hardcover', 'Hardcover', 2199, false, 'FTB-HC', true, null),
  ('33333333-3333-3333-3333-333333333305', '22222222-2222-2222-2222-222222222202', 'ebook',     'eBook',     1199, true,  'FTB-EB', true, 'ebooks/frontline-to-boardroom.epub'),

  ('33333333-3333-3333-3333-333333333306', '22222222-2222-2222-2222-222222222203', 'paperback', 'Paperback', 1599, false, 'OIB-PB', true, null),
  ('33333333-3333-3333-3333-333333333307', '22222222-2222-2222-2222-222222222203', 'ebook',     'eBook',      899, true,  'OIB-EB', true, 'ebooks/the-opportunity-in-between.epub'),
  ('33333333-3333-3333-3333-333333333308', '22222222-2222-2222-2222-222222222203', 'bundle',    'Book Bundle (all 3 titles)', 3999, false, 'OIB-BN', true, null);

-- book_images (placeholder covers only — no real files uploaded yet) -----------------

insert into public.book_images (book_id, storage_path, alt_text, position, is_cover) values
  ('22222222-2222-2222-2222-222222222201', 'covers/the-quiet-architecture-of-leadership.jpg', 'Cover placeholder — The Quiet Architecture of Leadership', 0, true),
  ('22222222-2222-2222-2222-222222222202', 'covers/frontline-to-boardroom.jpg', 'Cover placeholder — Frontline to Boardroom', 0, true),
  ('22222222-2222-2222-2222-222222222203', 'covers/the-opportunity-in-between.jpg', 'Cover placeholder — The Opportunity In Between', 0, true);

-- inventory ----------------------------------------------------------------------------

insert into public.inventory (book_format_id, tracks_stock, quantity_on_hand, stock_status) values
  ('33333333-3333-3333-3333-333333333301', true,  42, 'in_stock'),
  ('33333333-3333-3333-3333-333333333302', false, null, 'in_stock'),
  ('33333333-3333-3333-3333-333333333303', true,  4,  'low_stock'),

  ('33333333-3333-3333-3333-333333333304', true,  65, 'in_stock'),
  ('33333333-3333-3333-3333-333333333305', false, null, 'in_stock'),

  ('33333333-3333-3333-3333-333333333306', true,  0,  'preorder'),
  ('33333333-3333-3333-3333-333333333307', false, null, 'preorder'),
  ('33333333-3333-3333-3333-333333333308', true,  0,  'preorder');

-- discount_codes (one fictional example, inactive by default) ------------------------

insert into public.discount_codes (code, description, discount_type, discount_value, is_active) values
  ('WELCOME10', '[FICTIONAL SEED] Example 10% welcome discount — inactive until reviewed.', 'percentage', 10, false);
