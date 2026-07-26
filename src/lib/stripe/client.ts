import "server-only";

import Stripe from "stripe";

/**
 * Instantiated lazily (not at module scope) so importing this file never
 * throws at build time — only when a route/action that actually needs
 * Stripe runs without STRIPE_SECRET_KEY configured.
 */
export function getStripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set.");
  }
  return new Stripe(key);
}
