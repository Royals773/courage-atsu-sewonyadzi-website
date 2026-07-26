-- Phase 5 (Speaking Platform): the testimonials taxonomy is replaced with
-- the five categories the Speaking Platform spec calls for (Conferences,
-- Leadership, Corporate, Training, Books), superseding the more
-- book/press-oriented set from Step 4. No live project has real
-- testimonial rows yet (see the Step 3/4 reports), so this is a clean
-- swap rather than an additive change; the mapping below is only a
-- fallback for any rows that do exist and should be reviewed in
-- /admin/testimonials afterwards:
--   book-review, event-organiser -> books / conferences (best fit)
--   speaking                     -> conferences
--   consulting, media            -> corporate

create type public.testimonial_category_new as enum (
  'conferences',
  'leadership',
  'corporate',
  'training',
  'books'
);

alter table public.testimonials
  alter column category type public.testimonial_category_new
  using (
    case category::text
      when 'book-review' then 'books'
      when 'speaking' then 'conferences'
      when 'event-organiser' then 'conferences'
      when 'consulting' then 'corporate'
      when 'media' then 'corporate'
      else 'corporate'
    end
  )::public.testimonial_category_new;

drop type public.testimonial_category;
alter type public.testimonial_category_new rename to testimonial_category;

-- Media kit: curate a subset of existing media_items (photos, logos) for
-- the downloadable media kit page, without a separate table.
alter table public.media_items add column kit_category text;
