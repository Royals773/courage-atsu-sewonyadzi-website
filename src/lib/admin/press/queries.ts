import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

export async function getAdminPressItems() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("press_items")
    .select("*")
    .order("position")
    .order("published_date", { ascending: false });
  if (error || !data) {
    logger.error("getAdminPressItems failed", { error });
    return [];
  }
  return data;
}
