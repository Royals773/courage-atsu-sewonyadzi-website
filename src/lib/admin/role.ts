import type { AdminRole } from "@/lib/supabase/database.types";

/**
 * Pure, client-safe role helpers — kept separate from auth.ts (which is
 * "server-only" and does real data access) so components like the admin
 * sidebar can import `hasRole`/`AdminSession` without pulling
 * server-only code into the client bundle.
 */
export interface AdminSession {
  userId: string;
  email: string;
  role: AdminRole;
}

const ROLE_RANK: Record<AdminRole, number> = {
  editor: 0,
  administrator: 1,
  super_admin: 2,
};

export function hasRole(session: AdminSession | null, minRole: AdminRole): boolean {
  if (!session) return false;
  return ROLE_RANK[session.role] >= ROLE_RANK[minRole];
}
