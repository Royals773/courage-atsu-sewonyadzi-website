import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

/** Returns every calendar entry within [start, end] (inclusive), both dates as YYYY-MM-DD. */
export async function getCalendarEntries(start: string, end: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("speaking_calendar_entries")
    .select("*, speaking_events(client, event_date)")
    .gte("entry_date", start)
    .lte("entry_date", end)
    .order("entry_date");
  if (error || !data) {
    logger.error("getCalendarEntries failed", { error });
    return [];
  }
  return data;
}
