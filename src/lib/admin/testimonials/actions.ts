"use server";

import { revalidatePath } from "next/cache";

import { requireAdminAction } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { TestimonialCategory } from "@/lib/supabase/database.types";

function parseForm(formData: FormData) {
  return {
    quote: String(formData.get("quote") ?? "").trim(),
    author_name: String(formData.get("author_name") ?? "").trim(),
    author_role: formData.get("author_role")?.toString().trim() || null,
    organisation: formData.get("organisation")?.toString().trim() || null,
    category: formData.get("category")?.toString() as TestimonialCategory,
    is_approved: formData.get("is_approved") === "on",
    is_featured: formData.get("is_featured") === "on",
  };
}

export async function upsertTestimonialAction(formData: FormData): Promise<void> {
  await requireAdminAction("editor");
  const id = formData.get("id")?.toString();
  const values = parseForm(formData);
  const admin = createAdminClient();

  const { error } = id
    ? await admin.from("testimonials").update(values).eq("id", id)
    : await admin.from("testimonials").insert(values);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
  revalidatePath("/");
}

export async function deleteTestimonialAction(id: string): Promise<void> {
  await requireAdminAction("editor");
  const admin = createAdminClient();
  const { error } = await admin.from("testimonials").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
}
