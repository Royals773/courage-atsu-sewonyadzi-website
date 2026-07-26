import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";

/**
 * Service-role Supabase client. Bypasses Row Level Security entirely —
 * never import this into anything that runs in the browser, and never
 * pass its results directly back to the client without checking the
 * caller actually owns the data.
 *
 * Used for: guest basket reads/writes (see the Step 1 RLS notes — guest
 * baskets are intentionally unreachable via anon-key RLS), order/payment
 * creation, the Stripe webhook handler, and secure digital downloads.
 *
 * Instantiated lazily (not at module scope) so importing this file never
 * throws at build time — only when a route/action that actually needs it
 * runs without the env var configured.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase is not configured: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for this operation."
    );
  }

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
