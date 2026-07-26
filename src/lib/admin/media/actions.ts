"use server";

import { revalidatePath } from "next/cache";

import { requireAdminAction } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { MediaFileType } from "@/lib/supabase/database.types";

function detectFileType(mimeType: string): MediaFileType {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType === "application/epub+zip") return "epub";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  return "other";
}

export async function uploadMediaItemAction(formData: FormData): Promise<void> {
  const session = await requireAdminAction("editor");
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) throw new Error("Choose a file to upload.");

  const folderId = formData.get("folder_id")?.toString() || null;
  const admin = createAdminClient();
  const path = `${folderId ?? "root"}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await admin.storage.from("media").upload(path, file, {
    contentType: file.type,
  });
  if (uploadError) throw new Error(uploadError.message);

  const { error } = await admin.from("media_items").insert({
    folder_id: folderId,
    file_name: file.name,
    storage_path: path,
    mime_type: file.type,
    file_type: detectFileType(file.type),
    size_bytes: file.size,
    alt_text: formData.get("alt_text")?.toString() || null,
    kit_category: formData.get("kit_category")?.toString() || null,
    uploaded_by: session.userId,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/media");
}

/** Tags (or untags, when kitCategory is null) an existing item for the media kit page. */
export async function setMediaKitCategoryAction(
  itemId: string,
  kitCategory: string | null
): Promise<void> {
  await requireAdminAction("editor");
  const admin = createAdminClient();
  const { error } = await admin
    .from("media_items")
    .update({ kit_category: kitCategory })
    .eq("id", itemId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/media");
  revalidatePath("/media-kit");
}

export async function deleteMediaItemAction(itemId: string): Promise<void> {
  await requireAdminAction("editor");
  const admin = createAdminClient();
  const { data: item } = await admin
    .from("media_items")
    .select("storage_path")
    .eq("id", itemId)
    .maybeSingle();
  await admin.from("media_items").delete().eq("id", itemId);
  if (item) await admin.storage.from("media").remove([item.storage_path]);
  revalidatePath("/admin/media");
}

export async function createMediaFolderAction(formData: FormData): Promise<void> {
  await requireAdminAction("editor");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Folder name is required.");

  const admin = createAdminClient();
  const { error } = await admin.from("media_folders").insert({ name });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/media");
}

export async function deleteMediaFolderAction(folderId: string): Promise<void> {
  await requireAdminAction("editor");
  const admin = createAdminClient();
  const { error } = await admin.from("media_folders").delete().eq("id", folderId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/media");
}
