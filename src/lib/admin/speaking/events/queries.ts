import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

export async function getAdminSpeakingEvents() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("speaking_events")
    .select("*, speaking_topics(title)")
    .order("event_date", { ascending: false });
  if (error || !data) {
    logger.error("getAdminSpeakingEvents failed", { error });
    return [];
  }
  return data;
}

export async function getAdminSpeakingEventById(id: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("speaking_events")
    .select("*, speaking_topics(title)")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    logger.error("getAdminSpeakingEventById failed", { error });
    return null;
  }
  return data;
}
