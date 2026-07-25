# Author / Speaker Platform

A personal-brand platform for an author, speaker and consultant: book sales,
speaking bookings, an email audience, thought-leadership content, and a
future home for online courses.

Built with Next.js (App Router), TypeScript, Tailwind CSS v4, shadcn/ui,
Supabase, Stripe, Resend, React Hook Form and Zod.

## Project status

This is **Phase 1: Foundation** — the design system, navigation/footer, a
fully built homepage, and responsive shells for every page in the sitemap,
all running on typed placeholder content (`src/lib/content/`). There is no
live backend yet: no database tables, no payments, no working form
submissions. Anything that needs a backend not yet built is visually
present but intentionally inert (a disabled button with a short note on
which phase enables it) rather than faked.

See the phase roadmap below for what's next.

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

No environment variables are required to run Phase 1 — the site renders
entirely from local placeholder content. `.env.local` only matters starting
Phase 2 (Supabase, Stripe) and Phase 3 (Resend).

## Project structure

```
src/
  app/                  Routes (App Router). One folder per page in the sitemap.
  components/
    ui/                 shadcn/ui primitives (generated — prefer `npx shadcn add` over hand-editing)
    layout/             Header, footer, mobile nav
    home/                Homepage section components
    shared/              Reusable pieces (book card, image placeholder, page header, section heading)
  lib/
    content/             Typed placeholder content + types mirroring the future Supabase schema
    supabase/             Browser + server Supabase client helpers
    utils.ts              shadcn `cn()` helper
```

### Content model

`src/lib/content/types.ts` defines the shape of every content type (books,
speaking topics, testimonials, blog posts, courses, FAQs, media items). The
sibling files (`books.ts`, `testimonials.ts`, etc.) export static arrays
matching those types. When Supabase tables are introduced in later phases,
the plan is to replace these static arrays with Supabase queries that
return the same shapes — components should not need to change.

All placeholder content (bios, stats, testimonials, media appearances) is
clearly marked as fictional/placeholder in code comments and, where
user-facing, in on-page copy. Replace with real content before launch.

## Brand configuration

Brand name, tagline, short bio, domain, contact emails, social links, nav
items and credibility stats live in one file:
`src/lib/content/site-config.ts`. Update that file with real details when
they're available — nothing else needs to change.

## Design system

- Colours are CSS variables in `src/app/globals.css` (Tailwind v4 `@theme`
  syntax) — deep navy/charcoal, warm white, muted gold accent, burgundy
  secondary accent. Both light and dark variants are defined.
- Fonts: Fraunces (headings, `font-heading`) and Inter (body, `font-sans`),
  loaded via `next/font/google` — self-hosted, no runtime requests to Google.
- `ImagePlaceholder` (`src/components/shared/image-placeholder.tsx`) stands
  in for all photography until real images are supplied.

## Phase roadmap

1. **Foundation** (this phase) — architecture, design system, nav/footer,
   homepage, page shells.
2. **Books and payments** — catalogue, book detail pages, basket, Stripe
   checkout, orders, webhooks, secure digital downloads.
3. **Speaking and lead generation** — working speaking enquiry form,
   newsletter, course-interest capture, contact form — all backed by
   Supabase and sending email via Resend.
4. **Admin dashboard** — role-based admin area for books, orders, speaking
   enquiries, subscribers, and content.
5. **Courses foundation** — courses-coming-soon page (already built),
   course-interest tracking, and the data model for the future learning
   platform.
6. **Testing and deployment** — cross-device testing, accessibility and
   performance checks, Vercel deployment.

## Environment variables

See `.env.example`. Required starting Phase 2/3:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `ADMIN_EMAIL`, `FROM_EMAIL`

Never commit `.env.local` or any file with real credentials.

## Scripts

```bash
npm run dev      # start the dev server
npm run build    # production build (also type-checks)
npm run lint     # ESLint
```
