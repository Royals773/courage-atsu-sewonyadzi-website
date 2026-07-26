import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

export interface AdminUserRow {
  userId: string;
  email: string;
  role: string;
}

export async function getAdminUsers(): Promise<AdminUserRow[]> {
  const admin = createAdminClient();
  const { data: roles, error } = await admin.from("user_roles").select("user_id, role");
  if (error || !roles) {
    logger.error("getAdminUsers failed", { error });
    return [];
  }

  const rows: AdminUserRow[] = [];
  for (const row of roles) {
    const { data } = await admin.auth.admin.getUserById(row.user_id);
    rows.push({ userId: row.user_id, email: data.user?.email ?? "—", role: row.role });
  }
  return rows;
}
