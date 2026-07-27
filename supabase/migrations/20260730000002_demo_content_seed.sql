-- Phase 10 (Premium Content Population): draft/demo seed content requested
-- by the client so the CMS ships with realistic starting material instead
-- of empty tables. Two different safety postures are used depending on
-- what's being seeded:
--
--   * FAQs and speaking topics are the site owner's own service menu and
--     policies (not third-party claims), so they are inserted published
--     and live immediately — still full of bracketed placeholders
--     wherever a real, specific fact (fees, exact timelines) isn't known.
--
--   * Testimonials are third-party endorsements. Fabricated ones must
--     never be presented to a real visitor as genuine, so every row here
--     is inserted with is_approved = false — they sit in the
--     /admin/testimonials review queue, clearly separate from anything a
--     real client actually said, until the site owner replaces or
--     approves them.
--
-- No client logos are seeded here: that table requires an uploaded image
-- per row (see /admin/client-logos), which a SQL migration can't provide.

insert into public.faq_items (question, answer, category, position) values
(
  'What should I include when enquiring about a speaking engagement?',
  'Please share your event date, format (in-person or virtual), audience size, and the leadership, governance or transformation theme you''d like covered. The more context you provide, the faster a tailored proposal can be prepared.',
  'speaking-engagements',
  0
),
(
  'What is your speaking fee?',
  'Fees vary by format, location and event type. [Placeholder — provide a standard fee range or state that fees are quoted per engagement.] A speaking enquiry will always receive a clear quote before anything is confirmed.',
  'speaking-engagements',
  1
),
(
  'How far in advance should I book?',
  '[Placeholder — state your typical lead time, e.g. 6-8 weeks for domestic events and longer for international travel.] Earlier enquiries have a better chance of securing a preferred date.',
  'speaking-engagements',
  2
),
(
  'Do you speak at international events?',
  'Yes — international keynote engagements are welcomed. [Placeholder — note any regions you prioritise or travel restrictions.] Please include expected travel and visa requirements in your enquiry.',
  'travel',
  0
),
(
  'Do you require specific travel arrangements?',
  '[Placeholder — outline your standard travel and accommodation requirements, e.g. business class for flights over a certain duration, preferred arrival timing before an event.]',
  'travel',
  1
),
(
  'How can journalists or producers request an interview?',
  'Media and interview requests can be sent directly via the media enquiries email on the Contact page, or through the Media Kit page, which includes a short-form biography and downloadable assets once published.',
  'media-enquiries',
  0
),
(
  'Is a media kit available?',
  'Yes — the Media Kit page includes a speaker introduction, biography and (once uploaded) headshots and logos suitable for event programmes and press use.',
  'media-enquiries',
  1
),
(
  'How long does delivery take for physical book orders?',
  '[Placeholder — confirm your standard shipping window, e.g. 5-7 business days within the UK, longer for international orders.]',
  'delivery',
  0
),
(
  'How do I access a digital book purchase?',
  'Digital formats (ebook and audiobook, where available) are delivered via a secure download link sent to your email immediately after purchase, and remain accessible from your account order history.',
  'digital-downloads',
  0
),
(
  'What is your refund policy?',
  '[Placeholder — confirm your refund window and any conditions, e.g. physical books may be returned within 14 days if unused; digital downloads are non-refundable once accessed.] See the Terms & Conditions page for the full policy.',
  'refunds',
  0
),
(
  'When will the Courses platform launch?',
  'Courses are in development. Joining the priority list on the Courses page ensures you''re notified the moment enrolment opens — [Placeholder — add an estimated launch window once known.]',
  'courses',
  0
),
(
  'What is the best way to reach you for a general enquiry?',
  'The general enquiries email on the Contact page is monitored regularly. For speaking or media-specific requests, please use the dedicated speaking or media channels instead, so your enquiry reaches the right place faster.',
  'general-enquiries',
  0
)
on conflict do nothing;

insert into public.speaking_topics
  (slug, title, summary, learning_objectives, audience, duration, delivery_format, is_featured, is_published, position)
values
(
  'leadership-that-executes',
  'Leadership That Executes: Closing the Gap Between Strategy and Delivery',
  'Most organisations do not fail from a shortage of good strategy — they fail in the gap between deciding and doing. This keynote gives leaders a practical framework for closing that gap: the governance, culture and execution discipline that turns a plan on a slide into results in the building.',
  array[
    'Diagnose where their own organisation''s strategy typically stalls before it reaches delivery',
    'Apply a practical framework for translating decisions into accountable action',
    'Leave with one concrete execution habit to install within a week'
  ],
  'Executive teams, boards and senior leaders responsible for turning strategy into delivery',
  '45–60 minutes as a keynote; half-day and full-day workshop formats available',
  array['keynote', 'workshop', 'executive briefing'],
  true, true, 0
),
(
  'governance-under-pressure',
  'Governance Under Pressure: Building Institutions That Hold',
  'Regulation and scrutiny are not obstacles to leadership — they are one of its sharpest tests. Drawing on experience in highly regulated environments, this session equips leaders to build governance that protects trust and performance simultaneously, especially when both are under real pressure.',
  array[
    'Understand governance as a leadership discipline rather than a compliance function',
    'Identify the governance gaps most likely to surface during a crisis',
    'Build a practical playbook for protecting institutional trust under scrutiny'
  ],
  'Boards, regulated-sector executives and public service leaders',
  '45–60 minutes as a keynote; workshop and board-briefing formats available',
  array['keynote', 'board briefing', 'workshop'],
  true, true, 1
),
(
  'culture-is-a-system',
  'Culture Is a System: Engineering the Conditions for Trust and Performance',
  'Culture is too often treated as a slogan on a wall rather than a system that can be deliberately designed. This session reframes organisational culture as an engineering problem — one with levers leaders can actually pull — to build teams where trust and performance reinforce each other.',
  array[
    'See culture as a designed system rather than an inherited accident',
    'Identify the specific levers that shape trust and accountability day to day',
    'Leave with a practical culture audit to run within their own team'
  ],
  'People leaders, HR and organisational development functions, mid-to-senior management',
  '45–60 minutes as a keynote; half-day workshop format available',
  array['keynote', 'workshop'],
  true, true, 2
),
(
  'leading-transformation-without-losing-the-organisation',
  'Leading Transformation Without Losing the Organisation',
  'Transformation efforts frequently succeed on paper and fail in practice — because the organisation itself gets lost in the process. This keynote gives leaders a sequencing framework for driving innovation and change without breaking the culture, governance or trust that makes the organisation worth transforming in the first place.',
  array[
    'Understand why most transformation initiatives stall midway through delivery',
    'Apply a sequencing framework that protects culture and governance during change',
    'Leave with a first-90-days plan for their own transformation initiative'
  ],
  'Change leaders, transformation programme sponsors and executive teams',
  '45–60 minutes as a keynote; full-day workshop format available',
  array['keynote', 'workshop'],
  false, true, 3
),
(
  'regulation-as-a-leadership-discipline',
  'Regulation as a Leadership Discipline, Not a Compliance Afterthought',
  'In regulated sectors, the leaders who treat compliance as a leadership discipline — not an afterthought bolted on at the end — consistently outperform those who don''t. This session makes the case, with practical frameworks for embedding regulatory thinking into everyday leadership decisions.',
  array[
    'Reframe regulatory and compliance thinking as a leadership advantage, not a burden',
    'Identify where compliance is currently treated as an afterthought in their own organisation',
    'Apply a framework for embedding regulatory discipline into day-to-day decisions'
  ],
  'Leaders in regulated industries — healthcare, care, financial and public services',
  '45–60 minutes as a keynote; executive briefing format available',
  array['keynote', 'executive briefing'],
  false, true, 4
),
(
  'from-founder-to-institution',
  'From Founder to Institution: Entrepreneurial Leadership That Scales',
  'The instincts that build a business rarely scale an institution without deliberate change. This session is for founders and entrepreneurial leaders navigating the transition from personality-led leadership to institution-led leadership — without losing the energy that got them there.',
  array[
    'Recognise the specific point where founder-led leadership stops scaling',
    'Apply a framework for building governance and culture that outlast any one leader',
    'Leave with a concrete next step for professionalising their own leadership team'
  ],
  'Founders, entrepreneurs and leaders of fast-growing organisations',
  '45–60 minutes as a keynote; half-day workshop format available',
  array['keynote', 'workshop'],
  false, true, 5
)
on conflict (slug) do nothing;

-- Demo testimonials — fabricated, clearly fictional names and organisations,
-- inserted unapproved (is_approved = false) so they never render on the
-- public site until reviewed, edited and explicitly approved in
-- /admin/testimonials.
insert into public.testimonials (quote, author_name, author_role, organisation, category, is_approved, is_featured) values
(
  '[Demo testimonial — replace with a real quote] Courage brought a level of clarity to our governance conversations that our board had been circling for years. Within a month of the session, we had a concrete plan we actually executed.',
  'Amara Boateng',
  'Board Chair',
  'Meridian Public Sector Trust',
  'leadership',
  false, false
),
(
  '[Demo testimonial — replace with a real quote] Most keynote speakers leave you inspired for an afternoon. This one left our leadership team with a framework we still use in every strategy review.',
  'David Okonkwo',
  'Chief Executive',
  'Ashcombe Regional Health Partnership',
  'conferences',
  false, false
),
(
  '[Demo testimonial — replace with a real quote] The workshop on culture as a system changed how our entire management team talks about performance. It wasn''t theory — it was something we could apply the next morning.',
  'Helena Marsh',
  'Head of People & Culture',
  'Northbridge Leadership Institute',
  'training',
  false, false
),
(
  '[Demo testimonial — replace with a real quote] We brought Courage in during a genuinely difficult regulatory period. The session on governance under pressure gave our board language and structure we didn''t have before.',
  'Samuel Adeyemi',
  'Director of Governance',
  'Solace Care Alliance',
  'corporate',
  false, false
),
(
  '[Demo testimonial — replace with a real quote] A rare business book that reads like it was written by someone who has actually done the job, not just studied it. Practical from the first chapter to the last.',
  'Priya Ramanathan',
  'Founder',
  'Continental Growth Partners',
  'books',
  false, false
),
(
  '[Demo testimonial — replace with a real quote] Our leadership offsite needed more than energy — it needed a plan. This session delivered both, and our team is still working from the framework six months later.',
  'Thomas Iversen',
  'Managing Partner',
  'Fenwick & Vale Advisory',
  'leadership',
  false, false
)
on conflict do nothing;
