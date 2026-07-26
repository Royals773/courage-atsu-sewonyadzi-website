"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminAction } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";

function parseEventForm(formData: FormData) {
  const feeAmount = formData.get("fee_amount")?.toString().trim();
  const expensesAmount = formData.get("expenses_amount")?.toString().trim();

  return {
    client: String(formData.get("client") ?? "").trim(),
    venue: formData.get("venue")?.toString().trim() || null,
    event_date: String(formData.get("event_date") ?? ""),
    topic_id: formData.get("topic_id")?.toString() || null,
    fee_amount: feeAmount ? Math.round(Number(feeAmount) * 100) : null,
    expenses_amount: expensesAmount ? Math.round(Number(expensesAmount) * 100) : null,
    notes: formData.get("notes")?.toString().trim() || null,
    is_public: formData.get("is_public") === "on",
  };
}

export async function createSpeakingEventAction(formData: FormData): Promise<void> {
  await requireAdminAction("administrator");
  const values = parseEventForm(formData);
  const admin = createAdminClient();

  const { data, error } = await admin.from("speaking_events").insert(values).select("id").single();
  if (error) throw new Error(error.message);

  revalidatePath("/admin/speaking/events");
  redirect(`/admin/speaking/events/${data.id}`);
}

export async function updateSpeakingEventAction(id: string, formData: FormData): Promise<void> {
  await requireAdminAction("administrator");
  const values = parseEventForm(formData);
  const admin = createAdminClient();

  const { error } = await admin.from("speaking_events").update(values).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/speaking/events");
  revalidatePath(`/admin/speaking/events/${id}`);
  revalidatePath("/");
}

export async function deleteSpeakingEventAction(id: string): Promise<void> {
  await requireAdminAction("administrator");
  const admin = createAdminClient();
  const { error } = await admin.from("speaking_events").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/speaking/events");
}

export async function uploadEventPresentationAction(id: string, formData: FormData): Promise<void> {
  await requireAdminAction("administrator");
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) throw new Error("Choose a file to upload.");

  const admin = createAdminClient();
  const path = `speaking/presentations/${id}-${Date.now()}-${file.name}`;
  const { error: uploadError } = await admin.storage.from("media").upload(path, file, {
    contentType: file.type,
  });
  if (uploadError) throw new Error(uploadError.message);

  const { error } = await admin
    .from("speaking_events")
    .update({ presentation_storage_path: path })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/speaking/events/${id}`);
}
