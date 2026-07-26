"use server";

import { revalidatePath } from "next/cache";

import { requireAdminAction } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { VideoPlatform } from "@/lib/supabase/database.types";

function parseForm(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: formData.get("description")?.toString().trim() || null,
    platform: formData.get("platform")?.toString() as VideoPlatform,
    video_url: formData.get("video_url")?.toString().trim() || null,
    category: formData.get("category")?.toString().trim() || null,
    is_featured: formData.get("is_featured") === "on",
    is_published: formData.get("is_published") === "on",
    position: Number(formData.get("position") ?? 0) || 0,
  };
}

export async function upsertVideoAction(formData: FormData): Promise<void> {
  await requireAdminAction("editor");
  const id = formData.get("id")?.toString();
  const values = parseForm(formData);
  const admin = createAdminClient();

  const { error } = id
    ? await admin.from("videos").update(values).eq("id", id)
    : await admin.from("videos").insert(values);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/videos");
  revalidatePath("/videos");
}

export async function deleteVideoAction(id: string): Promise<void> {
  await requireAdminAction("editor");
  const admin = createAdminClient();
  const { data: video } = await admin.from("videos").select("storage_path, thumbnail_storage_path").eq("id", id).maybeSingle();
  const { error } = await admin.from("videos").delete().eq("id", id);
  if (error) throw new Error(error.message);
  const paths = [video?.storage_path, video?.thumbnail_storage_path].filter((p): p is string => Boolean(p));
  if (paths.length) await admin.storage.from("media").remove(paths);
  revalidatePath("/admin/videos");
  revalidatePath("/videos");
}

export async function uploadVideoFileAction(formData: FormData): Promise<{ id: string }> {
  await requireAdminAction("editor");
  const file = formData.get("file") as File | null;
  const thumbnail = formData.get("thumbnail") as File | null;
  if (!file || file.size === 0) throw new Error("Choose a video file to upload.");

  const admin = createAdminClient();
  const videoPath = `speaking/videos/${Date.now()}-${file.name}`;
  const { error: uploadError } = await admin.storage.from("media").upload(videoPath, file, {
    contentType: file.type,
  });
  if (uploadError) throw new Error(uploadError.message);

  let thumbnailPath: string | null = null;
  if (thumbnail && thumbnail.size > 0) {
    thumbnailPath = `speaking/videos/thumbnails/${Date.now()}-${thumbnail.name}`;
    const { error: thumbError } = await admin.storage.from("media").upload(thumbnailPath, thumbnail, {
      contentType: thumbnail.type,
    });
    if (thumbError) throw new Error(thumbError.message);
  }

  const { data, error } = await admin
    .from("videos")
    .insert({
      title: String(formData.get("title") ?? file.name).trim(),
      description: formData.get("description")?.toString().trim() || null,
      platform: "upload" as VideoPlatform,
      storage_path: videoPath,
      thumbnail_storage_path: thumbnailPath,
      category: formData.get("category")?.toString().trim() || null,
      is_published: true,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  revalidatePath("/admin/videos");
  revalidatePath("/videos");
  return { id: data.id };
}
