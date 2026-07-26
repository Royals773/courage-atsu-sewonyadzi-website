import "server-only";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { FaqCategory } from "@/lib/supabase/database.types";
import { logger } from "@/lib/logger";

export interface PublicFaq {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
}

export async function getFaqs(): Promise<PublicFaq[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("faq_items")
      .select("*")
      .order("category")
      .order("position");

    if (error) throw error;
    return (data ?? []).map((row) => ({
      id: row.id,
      question: row.question,
      answer: row.answer,
      category: row.category,
    }));
  } catch (error) {
    logger.error("getFaqs failed", { error });
    return [];
  }
}
