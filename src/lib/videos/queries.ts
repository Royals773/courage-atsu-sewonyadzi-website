import "server-only";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { getMediaSignedUrl } from "@/lib/media/signed-url";
import type { VideoPlatform } from "@/lib/supabase/database.types";
import { logger } from "@/lib/logger";

export interface PublicVideo {
  id: string;
  title: string;
  description: string | null;
  platform: VideoPlatform;
  videoUrl: string | null;
  playbackUrl: string | null;
  thumbnailUrl: string | null;
  category: string | null;
  isFeatured: boolean;
}

export async function getPublishedVideos(): Promise<PublicVideo[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .eq("is_published", true)
      .order("position", { ascending: true });

    if (error) throw error;

    return await Promise.all(
      (data ?? []).map(async (row) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        platform: row.platform,
        videoUrl: row.video_url,
        playbackUrl: row.storage_path ? await getMediaSignedUrl(row.storage_path) : row.video_url,
        thumbnailUrl: row.thumbnail_storage_path
          ? await getMediaSignedUrl(row.thumbnail_storage_path)
          : null,
        category: row.category,
        isFeatured: row.is_featured,
      }))
    );
  } catch (error) {
    logger.error("getPublishedVideos failed", { error });
    return [];
  }
}
