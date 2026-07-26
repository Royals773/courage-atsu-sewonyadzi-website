# Production Checklist

Everything needed to take this app from local development to a live
Vercel deployment. Items marked **(manual)** require a human with access
to the relevant dashboard (Supabase / Stripe / Resend / Vercel) — they
can't be scripted from this repo.

## 1. Supabase

- [ ] **(manual)** Create a Supabase project (or use an existing one).
- [ ] **(manual)** Create the Storage buckets referenced in code — these
      are **not** created by the SQL migrations:
      - `media` (logo, author photo, blog featured images — public-ish,
        served via signed URLs)
      - `book-images` (book covers/gallery)
      - `book-files` (private — full digital downloads)
      - `book-samples` (private — sample chapters)
- [ ] Run `supabase link --project-ref <ref>` locally, then
      `npm run deploy-migrations` to push `supabase/migrations/*.sql`.
      Migrations must run in filename order (they already are — timestamped).
- [ ] **(manual)** Do *not* run `supabase/seed.sql` against production — it's
      local/dev-only sample data.
- [ ] Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
      `SUPABASE_SERVICE_ROLE_KEY` in Vercel project env vars.
- [ ] **(manual)** Create the first admin user: sign up normally, then in
      the `admin_roles` table (or via SQL) grant that user a role — see
      `supabase/migrations/20260727000001_admin_roles.sql`.

## 2. Stripe

- [ ] **(manual)** Switch to live mode keys once ready (test mode keys for
      staging).
- [ ] Set `STRIPE_SECRET_KEY` in Vercel env vars.
- [ ] **(manual)** Register a webhook endpoint in the Stripe dashboard
      pointing at `https://<your-domain>/api/webhooks/stripe`, subscribed
      to at least `checkout.session.completed`.
- [ ] Copy the webhook's signing secret into `STRIPE_WEBHOOK_SECRET`.
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is currently unused (hosted
      Checkout, not Elements) — safe to leave unset.

## 3. Resend

- [ ] **(manual)** Verify your sending domain in Resend (SPF/DKIM records).
- [ ] Set `RESEND_API_KEY`, `FROM_EMAIL` (must be on the verified domain),
      and `ADMIN_EMAIL` (where speaking-enquiry/newsletter notifications go).

## 4. Vercel

- [ ] Set `NEXT_PUBLIC_SITE_URL` to the real production URL (used in
      metadata, sitemap, canonical/OG tags, and Stripe redirect URLs).
- [ ] Run `npm run check-env` locally against a `.env.production`-style file
      before deploying, to confirm nothing required is missing.
- [ ] Confirm `vercel.json` framework detection and build command are as
      expected (already committed).
- [ ] `@vercel/analytics` and `@vercel/speed-insights` are wired into the
      root layout — Analytics/Speed Insights will populate automatically
      once deployed to Vercel, no extra config needed.

## 5. Manual QA (do this once real keys are in place)

- [ ] Full checkout: add a book to basket, apply a discount code (if any
      exist), complete Stripe Checkout with a test card, confirm the
      order appears in `/account/orders` and `/admin/orders`, and that a
      confirmation email arrives.
- [ ] Digital download: buy a digital format, confirm the download link in
      the confirmation email works via `/api/downloads/[token]`.
- [ ] Speaking enquiry form: submit it, confirm it appears in
      `/admin/speaking/enquiries` and that the `ADMIN_EMAIL` notification
      arrives.
- [ ] Newsletter signup (homepage + footer forms): confirm the subscriber
      appears in `/admin/newsletter`.
- [ ] Sign up / sign in / sign out as a regular (non-admin) account.
- [ ] Sign in as an admin and spot-check each `/admin/*` section loads and
      saves correctly, especially `/admin/settings` (logo/author-photo
      upload, about/credibility content).
- [ ] Trigger a 404 (`/this-page-does-not-exist`) and confirm the branded
      not-found page renders.

## 6. Known follow-ups (not blocking, worth doing post-launch)

- The Content-Security-Policy in `next.config.ts` is a pragmatic baseline
  (`'unsafe-inline'`/`'unsafe-eval'` in `script-src`) rather than a strict
  nonce-based policy, to avoid breaking Next's hydration scripts without
  careful testing. Consider hardening once the site is stable.
- `validateDiscountCodeAction` and the public speaking-enquiry/newsletter
  server actions have no rate limiting — consider adding it (e.g. Vercel
  Firewall rules, or an Upstash-backed limiter) if abuse becomes a problem.
- Legal pages (`src/lib/content/legal.ts`) are explicitly placeholder text
  ("This page is a structural placeholder...") — have them reviewed by a
  qualified professional before relying on them.
- About-page and credibility-stat content is seeded with clearly-marked
  placeholder copy (`[Placeholder ...]`, `[X]+`) — replace it with real
  content via `/admin/settings` before launch.

## 7. Final gate

- [ ] `npm run predeploy` (typecheck + lint + build) passes with zero
      warnings/errors.
