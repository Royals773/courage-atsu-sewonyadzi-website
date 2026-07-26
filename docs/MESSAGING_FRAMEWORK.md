# Messaging Framework — Courage Atsu Sewonyadzi

Companion to `docs/BRAND_GUIDELINES.md` (visual identity). This document is
the reference for words: positioning, tagline, mission, vision, sector
breadth, and tone — pulled directly into the CMS defaults
(`src/lib/content/site-config.ts`, `src/lib/settings/keys.ts`) so the
website, emails and any print collateral stay in sync. Update the CMS
defaults and this document together.

## 1. Positioning statement

> Author | Keynote Speaker | Leadership Strategist | Entrepreneur

This is the primary, consistent identifier — use it in full wherever a
professional descriptor is needed (site metadata, speaker introductions,
media kit, LinkedIn headline). Adult Social Care is a **recognised area of
expertise**, not the positioning itself — it appears in expertise lists and
biography detail, never in the headline descriptor.

## 2. Core brand message

Courage helps leaders build **organisations that people trust, cultures
where people thrive, and systems that create lasting impact** — thinking
that applies across sectors, not just one industry.

### Sector breadth
The site should read as credible across all of the following, not confined
to any single one:

Leadership · Organisational Culture · Strategy · Governance ·
Entrepreneurship · Business Growth · AI-Enabled Transformation ·
Public Service · Education · Healthcare · Adult Social Care ·
Africa's Economic Development · Community Leadership

## 3. Tagline

> **Helping Leaders Build Better Organisations, Stronger Cultures and
> Lasting Impact.**

This is the central message — used prominently but **not repeated on every
page**. Variations, so the same idea doesn't read as copy-pasted:

| Context | Line |
|---|---|
| Homepage hero | "Helping leaders build better organisations, stronger cultures and lasting impact." (used in full, as the hero headline) |
| Footer | "Building better organisations, stronger cultures, lasting impact." |
| About page | "A leadership strategist helping organisations build what lasts." |
| Media kit | "Author, keynote speaker and leadership strategist helping organisations build better cultures and lasting impact." |
| Speaking profile (for organisers) | "Courage Atsu Sewonyadzi helps leaders build organisations people trust, cultures where people thrive, and systems that create lasting impact." |
| Email signature | "Helping leaders build better organisations, stronger cultures and lasting impact." (one line beneath name/title) |
| LinkedIn headline field | "Author \| Keynote Speaker \| Leadership Strategist \| Entrepreneur — Helping leaders build better organisations, stronger cultures and lasting impact." |
| LinkedIn "About" opening line | "I help leaders across business, public service, education and beyond build organisations people trust, cultures where people thrive, and systems that create lasting impact." |

## 4. Mission

> To equip leaders with the thinking, systems and practical strategies they
> need to build organisations that people trust, cultures where people
> thrive, and institutions that create lasting impact.

## 5. Vision

> A future in which leaders across business, public service, education and
> community life build institutions strong enough to outlast them and
> trusted enough to be worth the effort — with Africa's own leaders and
> enterprises recognised among the world's best.

Both are stored as drafts (`[Draft — pending your review]`) in
`site-config.ts`/`/admin/settings` pending your sign-off — see
`PRODUCTION_CHECKLIST.md`.

## 6. Tone of voice

Intelligent · Practical · Calm · Confident · Thought-provoking · Human ·
Credible · Optimistic.

- Complete, confident sentences — no rhetorical questions, no stacked
  exclamation points, no hustle-culture energy.
- Concrete over abstract: "stronger cultures and lasting impact" beats
  "amazing transformation."
- Warmth comes from clarity and respect for the reader's time, not from
  enthusiasm.
- Never invent specifics (numbers, client names, awards, dates, past
  engagements). Where a fact isn't confirmed, the copy says so plainly —
  see the `[Placeholder — ...]` / "Content pending final approval"
  convention used throughout `/admin/settings`.
- Avoid exaggerated marketing language generally — see
  `BRAND_GUIDELINES.md` §6 for the full do/don't list (also bans
  microphone/book/graduation-cap/crown/globe/map-of-Africa clichés in any
  future visual asset).

## 7. Suggested speaking themes

Not inserted as live content (speaking topics are admin-managed,
CMS-editable data — see `/admin/speaking/topics`) — a starting list to add
there when ready:

- Leadership Under Pressure
- Building High-Trust Organisations
- Strategy That Actually Works
- Culture Before Compliance
- Leading Through Change
- AI and the Future of Leadership
- Building Systems That Outlast Leaders
- Purpose-Driven Entrepreneurship
- Leadership Lessons from Frontline Experience

## 8. Thought-leadership categories

Seeded as `blog_categories` rows (via migration, admin-editable
thereafter) so they're ready to use in `/admin/blog`: Leadership, Strategy,
Governance, Culture, Business, Entrepreneurship, AI, Adult Social Care,
Africa, Personal Growth.
