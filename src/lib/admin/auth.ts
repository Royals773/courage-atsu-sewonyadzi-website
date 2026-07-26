import "server-only";

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";
import type { AdminRole } from "@/lib/supabase/database.types";
import { hasRole, type AdminSession } from "./role";
import { logger } from "@/lib/logger";

export type { AdminSession };
export { hasRole };

/**
 * Returns the caller's admin session, or null if they aren't signed in,
 * Supabase isn't configured, or they have no row in user_roles (i.e. an
 * ordinary customer). Never throws.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  if (!isSupabaseConfigured()) return null;

  const user = await getCurrentUser();
  if (!user) return null;

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error || !data) return null;
    return { userId: user.id, email: user.email ?? "", role: data.role };
  } catch (error) {
    logger.error("getAdminSession failed", { error });
    return null;
  }
}

/**
 * Page-level guard — call at the top of every admin page (the Next.js
 * "Data Access Layer" pattern: the proxy only optimistically refreshes the
 * session, the actual authorization check happens here, server-side, on
 * every request).
 */
export async function requireAdmin(minRole: AdminRole = "editor"): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/account/sign-in?next=/admin");
  if (!hasRole(session, minRole)) redirect("/admin?error=insufficient-permissions");
  return session;
}

/**
 * Server-action guard — throws instead of redirecting, so the calling
 * client component can show a clear error (toast) rather than navigating
 * away mid-action.
 */
export async function requireAdminAction(minRole: AdminRole = "editor"): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session || !hasRole(session, minRole)) {
    throw new Error("You don't have permission to do that.");
  }
  return session;
}
