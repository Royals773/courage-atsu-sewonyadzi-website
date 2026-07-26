import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

export async function getAdminTestimonials() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) {
    logger.error("getAdminTestimonials failed", { error });
    return [];
  }
  return data;
}
