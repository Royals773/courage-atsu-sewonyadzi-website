"use server";

import { revalidatePath } from "next/cache";

import { requireAdminAction } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";

const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/svg+xml"]);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

export async function uploadClientLogoAction(formData: FormData): Promise<void> {
  await requireAdminAction("editor");
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) throw new Error("Choose a logo image to upload.");
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Unsupported file type. Use PNG, JPEG, WebP or SVG.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("File is too large. Maximum size is 5MB.");
  }

  const admin = createAdminClient();
  const path = `client-logos/${Date.now()}-${file.name}`;
  const { error: uploadError } = await admin.storage.from("media").upload(path, file, {
    contentType: file.type,
  });
  if (uploadError) throw new Error(uploadError.message);

  const { error } = await admin.from("client_logos").insert({
    name: String(formData.get("name") ?? "").trim(),
    logo_path: path,
    website_url: formData.get("website_url")?.toString().trim() || null,
    position: Number(formData.get("position") ?? 0) || 0,
    is_published: true,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/client-logos");
  revalidatePath("/", "layout");
}

export async function updateClientLogoAction(formData: FormData): Promise<void> {
  await requireAdminAction("editor");
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing client logo id.");

  const admin = createAdminClient();
  const { error } = await admin
    .from("client_logos")
    .update({
      name: String(formData.get("name") ?? "").trim(),
      website_url: formData.get("website_url")?.toString().trim() || null,
      position: Number(formData.get("position") ?? 0) || 0,
      is_published: formData.get("is_published") === "on",
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/client-logos");
  revalidatePath("/", "layout");
}

export async function deleteClientLogoAction(id: string): Promise<void> {
  await requireAdminAction("editor");
  const admin = createAdminClient();
  const { data: logo } = await admin.from("client_logos").select("logo_path").eq("id", id).maybeSingle();
  const { error } = await admin.from("client_logos").delete().eq("id", id);
  if (error) throw new Error(error.message);
  if (logo?.logo_path) await admin.storage.from("media").remove([logo.logo_path]);

  revalidatePath("/admin/client-logos");
  revalidatePath("/", "layout");
}
