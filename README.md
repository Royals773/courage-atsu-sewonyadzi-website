# Author / Speaker Platform

A personal-brand platform for an author, speaker and consultant: book sales,
speaking bookings, an email audience, thought-leadership content, and a
future home for online courses.

Built with Next.js (App Router), TypeScript, Tailwind CSS v4, shadcn/ui,
Supabase, Stripe, Resend, React Hook Form and Zod.

## Project status

Foundation, bookstore, commerce (Stripe checkout, orders, digital
downloads), the CMS/admin dashboard, and the speaking platform are built
and backed by Supabase. Phase 6 (production readiness — SEO, accessibility,
error/loading states, monitoring, deployment scripts) is complete. The
Courses platform has not been started — `/courses` is an intentional
"coming soon" landing page.

Almost all page content (books, blog posts, speaking topics/events, press,
testimonials, FAQs, site settings, homepage/about copy, credibility stats)
is admin-editable via `/admin` and stored in Supabase. Site navigation
structure and legal policy pages remain static/code (see "Content model"
below for why).

Without Supabase/Stripe/Resend configured, the storefront still runs —
pages that need live data render a clear "not connected yet" state instead
of crashing (see `src/lib/env.ts` and `src/components/shared/backend-unavailable.tsx`).

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The site renders in
degraded/placeholder mode with no environment variables set — see
"Environment variables" below for what each one unlocks.

## Project structure

```
src/
  app/                  Routes (App Router). One folder per page in the sitemap, plus /admin, /api.
  components/
    ui/                 shadcn/ui primitives (generated — prefer `npx shadcn add` over hand-editing)
    layout/             Header, footer, mobile nav
    home/               Homepage section components
    admin/              Admin dashboard components
    shared/             Reusable pieces (book card, CmsImage, image placeholder, page header)
  lib/
    content/            Static content: site nav/domain, legal pages, courses (see below)
    settings/           Supabase-backed "site_settings" key/value store + admin actions
    books/, blog/, speaking/, testimonials/, faqs/, press/, videos/, media/, media-kit/, newsletter/, orders/, checkout/, discounts/
                        One query/action module per content domain, all Supabase-backed
    admin/              Admin-only queries/actions and auth (role-gated)
    supabase/           Browser, server and service-role Supabase client helpers
    stripe/             Stripe client
    email/              Resend client + transactional email templates
    env.ts              Env var validation/degradation helpers
    logger.ts           Structured logging (replaces ad hoc console.*)
    seo.ts              Shared metadata (canonical/OpenGraph) helper
```

### Content model

`src/lib/content/types.ts` defines shared TypeScript types. Most content
domains (books, blog, speaking, testimonials, FAQs, press, videos, media
kit, newsletter) are fully Supabase-backed with an admin-editable UI under
`/admin`.

Three things are deliberately **not** in Supabase:
- `src/lib/content/site-config.ts` — `mainNav` / `footerNav` (site
  navigation structure) and `siteUrl`/`domain`. Changing nav requires
  adding routes/code anyway, so it isn't CMS content.
- `src/lib/content/legal.ts` — legal policy pages (privacy, terms, cookies,
  etc.). Left static and clearly marked as placeholder text requiring
  legal review — these carry compliance risk if edited casually from an
  admin form.
- `src/lib/content/courses.ts` — the Courses platform hasn't been built
  yet; `/courses` is a "coming soon" page.

Everything else (brand name/bio/logo/author photo, homepage hero, about
page, credibility stats, contact/social links, SEO defaults) lives in the
`site_settings` table via `src/lib/settings/` and is editable at
`/admin/settings`.

## Design system

- Colours are CSS variables in `src/app/globals.css` (Tailwind v4 `@theme`
  syntax) — deep navy/charcoal, warm white, muted gold accent, burgundy
  secondary accent. Both light and dark variants are defined, both verified
  at WCAG AA contrast.
- Fonts: Fraunces (headings, `font-heading`) and Inter (body, `font-sans`),
  loaded via `next/font/google` — self-hosted, no runtime requests to Google.
- `CmsImage` (`src/components/shared/cms-image.tsx`) renders a real
  uploaded image when one exists, falling back to `ImagePlaceholder` when
  it doesn't.

## Environment variables

See `.env.example` for the full list with descriptions, or run
`npm run check-env` to verify what's set. Summary:

- `NEXT_PUBLIC_SITE_URL` — canonical production URL (metadata, sitemap, Stripe redirects).
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — required for the bookstore, auth, basket, orders and admin.
- `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (unused, reserved), `STRIPE_WEBHOOK_SECRET` — required for checkout and webhooks.
- `RESEND_API_KEY`, `ADMIN_EMAIL`, `FROM_EMAIL` — required to send order confirmation and speaking-enquiry emails.

Never commit `.env.local` or any file with real credentials.

Supabase Storage buckets referenced in code (`media`, `book-images`,
`book-files`, `book-samples`) must be created manually in the Supabase
dashboard — they are not created by the SQL migrations.

## Scripts

```bash
npm run dev              # start the dev server
npm run build            # production build (also type-checks)
npm run lint             # ESLint
npm run typecheck        # tsc --noEmit
npm run check-env        # verify required env vars are set (reads .env.local)
npm run deploy-migrations  # push supabase/migrations/*.sql to the linked project
npm run predeploy         # typecheck + lint + build, for a pre-deploy sanity check
```

See `PRODUCTION_CHECKLIST.md` for the full deployment runbook.
