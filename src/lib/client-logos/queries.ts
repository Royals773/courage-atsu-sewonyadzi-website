import "server-only";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { getMediaSignedUrl } from "@/lib/media/signed-url";
import { logger } from "@/lib/logger";

export interface ClientLogo {
  id: string;
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
}

export async function getPublishedClientLogos(): Promise<ClientLogo[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("client_logos")
      .select("*")
      .eq("is_published", true)
      .order("position", { ascending: true });

    if (error) throw error;

    return await Promise.all(
      (data ?? []).map(async (row) => ({
        id: row.id,
        name: row.name,
        logoUrl: await getMediaSignedUrl(row.logo_path),
        websiteUrl: row.website_url,
      }))
    );
  } catch (error) {
    logger.error("getPublishedClientLogos failed", { error });
    return [];
  }
}
