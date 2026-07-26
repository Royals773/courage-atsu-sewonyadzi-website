import "server-only";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { TestimonialCategory } from "@/lib/supabase/database.types";
import { logger } from "@/lib/logger";

export interface PublicTestimonial {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string | null;
  organisation: string | null;
  category: TestimonialCategory;
  isFeatured: boolean;
}

export async function getApprovedTestimonials(): Promise<PublicTestimonial[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_approved", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []).map((row) => ({
      id: row.id,
      quote: row.quote,
      authorName: row.author_name,
      authorRole: row.author_role,
      organisation: row.organisation,
      category: row.category,
      isFeatured: row.is_featured,
    }));
  } catch (error) {
    logger.error("getApprovedTestimonials failed", { error });
    return [];
  }
}
