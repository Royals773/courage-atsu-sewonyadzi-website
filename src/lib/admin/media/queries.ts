import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

export async function getMediaFolders() {
  const admin = createAdminClient();
  const { data } = await admin.from("media_folders").select("*").order("name");
  return data ?? [];
}

export async function getMediaItems(folderId: string | null) {
  const admin = createAdminClient();
  let query = admin.from("media_items").select("*").order("created_at", { ascending: false });
  query = folderId ? query.eq("folder_id", folderId) : query.is("folder_id", null);
  const { data, error } = await query;
  if (error) {
    logger.error("getMediaItems failed", { error });
    return [];
  }
  return data;
}
