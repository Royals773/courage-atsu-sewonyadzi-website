# Brand Guidelines — Courage Atsu Sewonyadzi

This document defines the personal brand identity for **Courage Atsu
Sewonyadzi** — *Author | Keynote Speaker | Adult Social Care Strategist |
Entrepreneur* — and how it should be applied across the website, email
communications and any future collateral. Treat it as the reference for
any future design or copy decision, not just a record of what was built.

## 1. Brand purpose

To be the clear, credible voice at the intersection of adult social care
leadership and entrepreneurial strategy — helping organisations and
leaders build systems, teams and enterprises that hold up under real
pressure, not just look good on paper.

## 2. Audience

- Senior leaders and boards in adult social care and adjacent health/care
  organisations.
- Conference and event organisers booking keynote or workshop speakers on
  leadership, care quality and organisational resilience.
- Readers of the books: practitioners and leaders looking for practical,
  evidence-grounded guidance rather than motivational platitudes.
- Entrepreneurs and investors interested in cross-border, care-adjacent
  ventures.

## 3. Positioning statement

> Author | Keynote Speaker | Adult Social Care Strategist | Entrepreneur

Use this exact phrase (or the tagline below) wherever a short descriptor
is needed — book covers, speaker introductions, email signatures, social
bios. Don't paraphrase it into something softer or more generic.

**Tagline**: "Strategic leadership for adult social care and beyond."

## 4. Brand personality

The brand should read as:

- **Authoritative** — speaks with the confidence of direct experience, not
  borrowed enthusiasm.
- **Of integrity** — plain, honest, doesn't oversell.
- **Wise** — draws on lived, frontline experience in adult social care, not
  just theory.
- **Calmly confident** — no exclamation marks, no hustle-culture energy.
- **Strategically minded** — frames problems in terms of systems and
  structure, not just inspiration.
- **Modern** — current in tone and design, not dated or corporate-generic.
- **Rooted, internationally relevant** — African heritage is part of the
  story, presented as a strength and a source of perspective, never as a
  decorative motif layered on top.
- **Trustworthy and practical** — every claim should be something an
  audience can actually act on.

## 5. Tone of voice

- Write in complete, confident sentences. Avoid rhetorical questions,
  hype, and stacked exclamation points.
- Prefer concrete nouns over abstract ones: "stronger care systems" beats
  "amazing transformation."
- It's fine to be warm, but warmth comes from clarity and respect for the
  reader's time, not from enthusiasm.
- Never invent specifics (numbers, client names, awards, dates). Where a
  fact isn't confirmed yet, the copy says so plainly (see the codebase
  convention: `[Placeholder — ...]` or "Content pending final approval").

## 6. Messaging principles

**Do:**
- Lead with the positioning statement or a specific outcome.
- Speak to adult social care as a genuine area of strategic expertise, not
  a footnote to generic "leadership speaking."
- Let African heritage and international experience come through as
  lived context (in the biography, in examples), not as a visual trope.

**Avoid:**
- Generic motivational-speaker language ("unleash your potential," "take
  it to the next level," "crush your goals").
- Clichéd imagery: microphone icons, open-book icons, graduation caps,
  crowns, globes, generic outline-map-of-Africa graphics. None of these
  appear anywhere in the logo system or site — if a future asset is
  tempted to use one, don't.
- Overclaiming: no invented testimonials, audience figures, or awards.

## 7. Visual direction

- **Colour**: deep navy (`--primary`) as the dominant, authoritative base;
  muted gold (`--accent`/`--gold`) as the single accent used sparingly for
  emphasis (eyebrows, key numbers, active states) — not decoration; deep
  burgundy (`--burgundy`, now the documented **secondary accent**) for a
  second, more occasional accent (e.g. distinguishing a secondary CTA or
  category tag from the primary gold one). Gold should never dominate a
  layout — if more than the accent/eyebrow/one-CTA is gold, pull it back.
- **Typography**: Fraunces (serif, distinctive, used for all headings) +
  Inter (clean, highly legible, used for body/UI). This pairing already
  reads as executive and timeless rather than trendy — a distinctive
  display face paired with a workhorse sans avoids both "generic corporate"
  and "flashy startup." See `src/app/globals.css` for the token
  definitions (`font-heading` / `font-sans`).
- **Imagery**: no stock-photo aesthetic. Where a real photograph isn't
  available yet, the site shows a clearly-labelled placeholder
  (`ImagePlaceholder`/`CmsImage`) rather than a fake stand-in.
- **Overall feel**: restrained, editorial, confident white space — closer
  to a serious publishing house or an executive advisory firm than a
  "personal brand" template.

## 8. Logo system

All marks are original, hand-authored SVG (typographic + simple geometric
shapes) — no stock icons, no third-party graphics, no image-generation
tooling. Files live in `public/brand/`:

| File | Use |
|---|---|
| `logo-primary.svg` | Stacked wordmark + positioning line — title pages, print, large formats. |
| `logo-horizontal.svg` | Single-line wordmark — the default header/nav logo. |
| `monogram.svg` | "CAS" mark inside a thin frame with an ascending accent bar — compact spaces (mobile header, favicon-adjacent contexts, email signature). |
| `icon.svg` | Simplified monogram tuned for very small sizes. |
| `logo-white.svg` / `logo-black.svg` | Single-colour horizontal logo for dark/light backgrounds. |
| `favicon.svg` | Browser tab icon. |
| `og-default.png` / `apple-touch-icon.png` | Raster exports generated from the SVGs via `scripts/generate-brand-assets.mjs` — regenerate this whenever the source SVGs change. |

### Usage rules

- **Clear space**: keep at least the height of the "C" in the monogram as
  padding on all sides of any mark.
- **Minimum size**: don't render the horizontal logo below ~120px wide, or
  the monogram/icon below ~24px — legibility degrades below that.
- **Colour**: use the full-colour mark on neutral backgrounds; use
  `logo-white.svg` on dark/navy backgrounds and `logo-black.svg` where a
  single dark mark is needed on a light but non-neutral background (e.g.
  printed on gold). Never recolour the mark to something outside these
  approved variants.
- **Don't**: stretch or skew the mark, add drop shadows or outlines,
  place it on a busy photographic background without a solid or blurred
  panel behind it, or recreate it by hand in a different typeface.
- **Favicon/monogram vs. full wordmark**: use the full wordmark
  (`logo-horizontal.svg`) wherever there's room (site header, letterhead);
  drop to the monogram only when space is genuinely constrained (mobile
  chrome, social avatars, favicon). Don't use the monogram just for
  visual variety.

## 9. Typography tokens

Defined in `src/app/globals.css` / used via Tailwind:

- `font-heading` (Fraunces) — display headings, page titles, section
  headings, pull quotes.
- `font-sans` (Inter, the default body font) — body copy, navigation,
  buttons, captions, forms, editorial article text (`.prose-content`).

No new fonts were introduced. `headingFont`/`bodyFont` exist as CMS fields
(`/admin/settings`) for record-keeping and future flexibility, but the
live site uses the fixed Fraunces/Inter pairing described above — see the
implementation note in `PRODUCTION_CHECKLIST.md`.

## 10. What still needs your input

This document, the logo system, and all new copy are a *starting point*.
Before launch:
- Confirm or correct the tagline, mission and vision statements — they're
  marked as drafts pending your review.
- Supply real biography content (long bio, professional journey,
  achievements) to replace the bracketed placeholders in
  `/admin/settings`.
- Confirm real contact details (phone, location, email addresses) and
  social handles — the current values are structured placeholders on the
  `courageatsusewonyadzi.com` domain, not verified accounts.
- Review the logo concepts and colour choices and request changes if the
  direction doesn't match your intent — these were designed without a
  live visual review cycle.
