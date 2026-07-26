import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

export async function getAdminClientLogos() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("client_logos")
    .select("*")
    .order("position");
  if (error || !data) {
    logger.error("getAdminClientLogos failed", { error });
    return [];
  }
  return data;
}
