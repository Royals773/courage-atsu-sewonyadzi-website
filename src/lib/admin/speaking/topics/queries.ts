import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

export async function getAdminSpeakingTopics() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("speaking_topics")
    .select("*")
    .order("position");
  if (error || !data) {
    logger.error("getAdminSpeakingTopics failed", { error });
    return [];
  }
  return data;
}

export async function getAdminSpeakingTopicById(id: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("speaking_topics")
    .select("*, speaking_topic_faqs(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    logger.error("getAdminSpeakingTopicById failed", { error });
    return null;
  }
  return data;
}
