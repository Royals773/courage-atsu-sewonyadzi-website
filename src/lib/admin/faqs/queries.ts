import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

export async function getAdminFaqs() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("faq_items")
    .select("*")
    .order("category")
    .order("position");
  if (error || !data) {
    logger.error("getAdminFaqs failed", { error });
    return [];
  }
  return data;
}
