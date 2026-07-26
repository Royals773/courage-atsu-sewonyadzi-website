import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";
import { logger } from "@/lib/logger";

// Long-lived because these URLs back OpenGraph/Twitter image tags too —
// social platforms and crawlers may fetch them well after the page render
// that generated the tag. None of these buckets hold sensitive content
// (paid digital downloads use a separate token-gated route instead).
const DEFAULT_TTL_SECONDS = 60 * 60 * 24; // 24 hours

export async function getMediaSignedUrl(
  path: string,
  options?: { bucket?: string; ttlSeconds?: number }
): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const admin = createAdminClient();
    const { data, error } = await admin.storage
      .from(options?.bucket ?? "media")
      .createSignedUrl(path, options?.ttlSeconds ?? DEFAULT_TTL_SECONDS);
    if (error || !data) return null;
    return data.signedUrl;
  } catch (error) {
    logger.error("getMediaSignedUrl failed", { error });
    return null;
  }
}

/** Book cover/gallery images live in the "book-images" Storage bucket. */
export async function getBookImageSignedUrl(path: string): Promise<string | null> {
  return getMediaSignedUrl(path, { bucket: "book-images" });
}
