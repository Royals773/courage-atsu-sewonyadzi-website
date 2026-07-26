import "server-only";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { PressItemType } from "@/lib/supabase/database.types";
import { logger } from "@/lib/logger";

export interface PressItem {
  id: string;
  title: string;
  type: PressItemType;
  publicationName: string | null;
  url: string | null;
  description: string | null;
  publishedDate: string | null;
  isFeatured: boolean;
}

export async function getPublishedPressItems(): Promise<PressItem[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("press_items")
      .select("*")
      .eq("is_published", true)
      .order("published_date", { ascending: false });

    if (error) throw error;
    return (data ?? []).map((row) => ({
      id: row.id,
      title: row.title,
      type: row.type,
      publicationName: row.publication_name,
      url: row.url,
      description: row.description,
      publishedDate: row.published_date,
      isFeatured: row.is_featured,
    }));
  } catch (error) {
    logger.error("getPublishedPressItems failed", { error });
    return [];
  }
}
