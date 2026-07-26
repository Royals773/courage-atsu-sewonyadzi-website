"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminAction } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";

function linesToArray(value: FormDataEntryValue | null): string[] {
  return (value?.toString() ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function csvToArray(value: FormDataEntryValue | null): string[] {
  return (value?.toString() ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseTopicForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();

  return {
    slug: slugify(slugInput || title),
    title,
    summary: String(formData.get("summary") ?? "").trim(),
    learning_objectives: linesToArray(formData.get("learning_objectives")),
    audience: formData.get("audience")?.toString().trim() || null,
    duration: formData.get("duration")?.toString().trim() || null,
    delivery_format: csvToArray(formData.get("delivery_format")),
    is_featured: formData.get("is_featured") === "on",
    is_published: formData.get("is_published") === "on",
    position: Number(formData.get("position") ?? 0) || 0,
  };
}

export async function createSpeakingTopicAction(formData: FormData): Promise<void> {
  await requireAdminAction("editor");
  const values = parseTopicForm(formData);
  const admin = createAdminClient();

  const { data, error } = await admin.from("speaking_topics").insert(values).select("id").single();
  if (error) throw new Error(error.message);

  revalidatePath("/admin/speaking/topics");
  revalidatePath("/speaking");
  redirect(`/admin/speaking/topics/${data.id}`);
}

export async function updateSpeakingTopicAction(id: string, formData: FormData): Promise<void> {
  await requireAdminAction("editor");
  const values = parseTopicForm(formData);
  const admin = createAdminClient();

  const { error } = await admin.from("speaking_topics").update(values).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/speaking/topics");
  revalidatePath(`/admin/speaking/topics/${id}`);
  revalidatePath("/speaking");
  revalidatePath(`/speaking/topics/${values.slug}`);
}

export async function deleteSpeakingTopicAction(id: string): Promise<void> {
  await requireAdminAction("administrator");
  const admin = createAdminClient();
  const { error } = await admin.from("speaking_topics").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/speaking/topics");
  revalidatePath("/speaking");
}

export async function upsertSpeakingTopicFaqAction(
  topicId: string,
  formData: FormData
): Promise<void> {
  await requireAdminAction("editor");
  const id = formData.get("id")?.toString();
  const values = {
    topic_id: topicId,
    question: String(formData.get("question") ?? "").trim(),
    answer: String(formData.get("answer") ?? "").trim(),
    position: Number(formData.get("position") ?? 0) || 0,
  };
  const admin = createAdminClient();

  const { error } = id
    ? await admin.from("speaking_topic_faqs").update(values).eq("id", id)
    : await admin.from("speaking_topic_faqs").insert(values);

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/speaking/topics/${topicId}`);
}

export async function deleteSpeakingTopicFaqAction(topicId: string, id: string): Promise<void> {
  await requireAdminAction("editor");
  const admin = createAdminClient();
  const { error } = await admin.from("speaking_topic_faqs").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/speaking/topics/${topicId}`);
}
