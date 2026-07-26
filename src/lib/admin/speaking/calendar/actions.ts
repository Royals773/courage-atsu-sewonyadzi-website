"use server";

import { revalidatePath } from "next/cache";

import { requireAdminAction } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SpeakingCalendarStatus } from "@/lib/supabase/database.types";

/**
 * Blocks, reserves or confirms a date. The unique constraint on
 * entry_date is the final backstop against double-booking, but we check
 * first so the admin gets a clear message instead of a raw DB error.
 */
export async function setCalendarEntryAction(
  date: string,
  status: SpeakingCalendarStatus,
  note: string
): Promise<void> {
  await requireAdminAction("administrator");
  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("speaking_calendar_entries")
    .select("id")
    .eq("entry_date", date)
    .maybeSingle();

  const { error } = existing
    ? await admin
        .from("speaking_calendar_entries")
        .update({ status, note: note || null })
        .eq("id", existing.id)
    : await admin.from("speaking_calendar_entries").insert({ entry_date: date, status, note: note || null });

  if (error) {
    if (error.code === "23505") {
      throw new Error("That date is already taken — someone else just booked it.");
    }
    throw new Error(error.message);
  }
  revalidatePath("/admin/speaking/calendar");
}

export async function clearCalendarEntryAction(date: string): Promise<void> {
  await requireAdminAction("administrator");
  const admin = createAdminClient();
  const { error } = await admin.from("speaking_calendar_entries").delete().eq("entry_date", date);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/speaking/calendar");
}
