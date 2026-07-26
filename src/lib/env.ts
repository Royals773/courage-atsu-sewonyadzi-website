/**
 * Whether the public Supabase env vars are present. Storefront pages use
 * this to render a friendly "temporarily unavailable" state instead of
 * crashing when no Supabase project is connected yet. Also used by
 * src/proxy.ts (Edge runtime) — keep this dependency-free and side-effect
 * free at module scope so it stays safe to import there.
 */
export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/** Whether Stripe checkout + webhook verification can run. */
export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET);
}

/** Whether transactional email sending can run. */
export function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.FROM_EMAIL);
}

export type EnvGroup = "site" | "supabase" | "stripe" | "resend" | "notifications";

export interface EnvVarSpec {
  key: string;
  group: EnvGroup;
  /** Required for that group's features to work at all in production. */
  required: boolean;
  description: string;
}

/**
 * Canonical list of every environment variable this app reads, mirrored in
 * .env.example and README.md. Single source of truth for `scripts/check-env.mjs`
 * and for the production checklist — update all three together when adding
 * a new var.
 */
export const ENV_VAR_SPECS: EnvVarSpec[] = [
  {
    key: "NEXT_PUBLIC_SITE_URL",
    group: "site",
    required: true,
    description: "Canonical production URL, used for metadata, sitemap, canonical/OG tags, and Stripe redirect URLs.",
  },
  {
    key: "NEXT_PUBLIC_SUPABASE_URL",
    group: "supabase",
    required: true,
    description: "Supabase project URL. Without this the storefront runs in degraded read-only placeholder mode.",
  },
  {
    key: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    group: "supabase",
    required: true,
    description: "Supabase anon/public key, used by browser and server clients under RLS.",
  },
  {
    key: "SUPABASE_SERVICE_ROLE_KEY",
    group: "supabase",
    required: true,
    description: "Bypasses RLS. Server-only — required for guest baskets, orders, webhooks, and downloads. Never expose to the client.",
  },
  {
    key: "STRIPE_SECRET_KEY",
    group: "stripe",
    required: true,
    description: "Server-only Stripe API key, required to create checkout sessions and coupons.",
  },
  {
    key: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    group: "stripe",
    required: false,
    description: "Currently unused — checkout uses hosted Stripe Checkout redirect, not Stripe.js/Elements. Kept for a future embedded checkout.",
  },
  {
    key: "STRIPE_WEBHOOK_SECRET",
    group: "stripe",
    required: true,
    description: "Verifies the signature on incoming Stripe webhook events. Must match the endpoint's signing secret in the Stripe dashboard.",
  },
  {
    key: "RESEND_API_KEY",
    group: "resend",
    required: true,
    description: "Required to send order confirmation and speaking-enquiry notification emails.",
  },
  {
    key: "ADMIN_EMAIL",
    group: "notifications",
    required: true,
    description: "Internal address that receives speaking-enquiry and newsletter-signup notifications.",
  },
  {
    key: "FROM_EMAIL",
    group: "notifications",
    required: true,
    description: "Verified sender address for all outbound Resend email. Domain must be verified in Resend.",
  },
];
