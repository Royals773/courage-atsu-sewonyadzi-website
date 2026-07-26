import "server-only";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { logger } from "@/lib/logger";

/**
 * Returns null (never throws) when Supabase isn't configured or the auth
 * check fails, so every page that renders the header — i.e. every page —
 * doesn't go down with the whole site when no Supabase project is
 * connected yet. See the Step 3 report.
 */
export async function getCurrentUser() {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    logger.error("getCurrentUser failed", { error });
    return null;
  }
}
