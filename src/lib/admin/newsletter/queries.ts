import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

export async function getNewsletterSubscribers() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("newsletter_subscribers")
    .select("*")
    .order("subscribed_at", { ascending: false });

  if (error || !data) {
    logger.error("getNewsletterSubscribers failed", { error });
    return [];
  }
  return data;
}
