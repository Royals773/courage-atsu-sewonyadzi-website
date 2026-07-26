"use server";

import { revalidatePath } from "next/cache";

import { requireAdminAction } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { FaqCategory } from "@/lib/supabase/database.types";

function parseForm(formData: FormData) {
  return {
    question: String(formData.get("question") ?? "").trim(),
    answer: String(formData.get("answer") ?? "").trim(),
    category: formData.get("category")?.toString() as FaqCategory,
    position: Number(formData.get("position") ?? 0) || 0,
  };
}

export async function upsertFaqAction(formData: FormData): Promise<void> {
  await requireAdminAction("editor");
  const id = formData.get("id")?.toString();
  const values = parseForm(formData);
  const admin = createAdminClient();

  const { error } = id
    ? await admin.from("faq_items").update(values).eq("id", id)
    : await admin.from("faq_items").insert(values);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/faqs");
  revalidatePath("/faq");
}

export async function deleteFaqAction(id: string): Promise<void> {
  await requireAdminAction("editor");
  const admin = createAdminClient();
  const { error } = await admin.from("faq_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/faqs");
  revalidatePath("/faq");
}
