import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

export async function getAdminVideos() {
  const admin = createAdminClient();
  const { data, error } = await admin.from("videos").select("*").order("position");
  if (error || !data) {
    logger.error("getAdminVideos failed", { error });
    return [];
  }
  return data;
}
