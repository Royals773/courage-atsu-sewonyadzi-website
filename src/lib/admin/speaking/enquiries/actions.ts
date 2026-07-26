"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminAction } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SpeakingEnquiryStatus } from "@/lib/supabase/database.types";

export async function updateEnquiryStatusAction(
  id: string,
  status: SpeakingEnquiryStatus
): Promise<void> {
  await requireAdminAction("editor");
  const admin = createAdminClient();
  const { error } = await admin.from("speaking_enquiries").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/speaking/enquiries");
  revalidatePath(`/admin/speaking/enquiries/${id}`);
  revalidatePath("/admin");
}

export async function updateEnquiryAdminNotesAction(id: string, adminNotes: string): Promise<void> {
  await requireAdminAction("editor");
  const admin = createAdminClient();
  const { error } = await admin
    .from("speaking_enquiries")
    .update({ admin_notes: adminNotes })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/speaking/enquiries/${id}`);
}

/**
 * Bridges the booking pipeline to Event Management: creates a
 * speaking_events row pre-filled from the enquiry, links it back via
 * enquiry_id, and marks the enquiry confirmed — the admin then finishes
 * the event record (fee, venue, presentation file) on the events page.
 */
export async function convertEnquiryToEventAction(id: string): Promise<void> {
  await requireAdminAction("administrator");
  const admin = createAdminClient();

  const { data: enquiry, error: fetchError } = await admin
    .from("speaking_enquiries")
    .select("*")
    .eq("id", id)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  const { data: event, error: insertError } = await admin
    .from("speaking_events")
    .insert({
      enquiry_id: id,
      topic_id: enquiry.preferred_topic_id,
      client: enquiry.organisation,
      venue: enquiry.venue,
      event_date: enquiry.event_date ?? new Date().toISOString().slice(0, 10),
      notes: enquiry.notes,
    })
    .select("id")
    .single();
  if (insertError) throw new Error(insertError.message);

  const { error: statusError } = await admin
    .from("speaking_enquiries")
    .update({ status: "confirmed" })
    .eq("id", id);
  if (statusError) throw new Error(statusError.message);

  revalidatePath("/admin/speaking/enquiries");
  revalidatePath("/admin/speaking/events");
  revalidatePath("/admin");
  redirect(`/admin/speaking/events/${event.id}`);
}
