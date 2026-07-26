import "server-only";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { logger } from "@/lib/logger";

export interface UpcomingEvent {
  id: string;
  eventDate: string;
  venue: string | null;
  topicTitle: string | null;
}

export async function getUpcomingPublicEvents(): Promise<UpcomingEvent[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from("speaking_events")
      .select("id, event_date, venue, speaking_topics(title)")
      .eq("is_public", true)
      .gte("event_date", today)
      .order("event_date", { ascending: true })
      .limit(6);

    if (error) throw error;
    return (data ?? []).map((row) => {
      const topic = Array.isArray(row.speaking_topics) ? row.speaking_topics[0] : row.speaking_topics;
      return {
        id: row.id,
        eventDate: row.event_date,
        venue: row.venue,
        topicTitle: topic?.title ?? null,
      };
    });
  } catch (error) {
    logger.error("getUpcomingPublicEvents failed", { error });
    return [];
  }
}
