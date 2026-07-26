"use server";

import { revalidatePath } from "next/cache";

import { requireAdminAction } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PressItemType } from "@/lib/supabase/database.types";

function parseForm(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    type: formData.get("type")?.toString() as PressItemType,
    publication_name: formData.get("publication_name")?.toString().trim() || null,
    url: formData.get("url")?.toString().trim() || null,
    description: formData.get("description")?.toString().trim() || null,
    published_date: formData.get("published_date")?.toString() || null,
    is_featured: formData.get("is_featured") === "on",
    is_published: formData.get("is_published") === "on",
    position: Number(formData.get("position") ?? 0) || 0,
  };
}

export async function upsertPressItemAction(formData: FormData): Promise<void> {
  await requireAdminAction("editor");
  const id = formData.get("id")?.toString();
  const values = parseForm(formData);
  const admin = createAdminClient();

  const { error } = id
    ? await admin.from("press_items").update(values).eq("id", id)
    : await admin.from("press_items").insert(values);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/press");
  revalidatePath("/press");
}

export async function deletePressItemAction(id: string): Promise<void> {
  await requireAdminAction("editor");
  const admin = createAdminClient();
  const { error } = await admin.from("press_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/press");
  revalidatePath("/press");
}
