import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";
import { getMediaSignedUrl } from "@/lib/media/signed-url";
import { logger } from "@/lib/logger";

export interface MediaKitAsset {
  id: string;
  fileName: string;
  altText: string | null;
  kitCategory: string;
  url: string | null;
}

/**
 * Media kit assets are ordinary media_items curated with a `kit_category`
 * tag (see the Phase 5 migration) rather than a dedicated table — an admin
 * marks an existing photo/logo as "headshot", "logo", "event-photo" etc.
 * from the Media Library, and it appears here automatically.
 */
export async function getMediaKitAssets(): Promise<MediaKitAsset[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("media_items")
      .select("id, file_name, alt_text, kit_category, storage_path")
      .not("kit_category", "is", null)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return await Promise.all(
      (data ?? []).map(async (row) => ({
        id: row.id,
        fileName: row.file_name,
        altText: row.alt_text,
        kitCategory: row.kit_category as string,
        url: await getMediaSignedUrl(row.storage_path),
      }))
    );
  } catch (error) {
    logger.error("getMediaKitAssets failed", { error });
    return [];
  }
}
