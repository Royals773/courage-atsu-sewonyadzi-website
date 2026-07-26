import "server-only";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { logger } from "@/lib/logger";

export interface SpeakingTopicFaq {
  id: string;
  question: string;
  answer: string;
}

export interface SpeakingTopicSummary {
  id: string;
  slug: string;
  title: string;
  summary: string;
  audience: string | null;
  duration: string | null;
  deliveryFormat: string[];
  isFeatured: boolean;
}

export interface SpeakingTopicDetail extends SpeakingTopicSummary {
  learningObjectives: string[];
  faqs: SpeakingTopicFaq[];
}

function mapSummary(row: {
  id: string;
  slug: string;
  title: string;
  summary: string;
  audience: string | null;
  duration: string | null;
  delivery_format: string[];
  is_featured: boolean;
}): SpeakingTopicSummary {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    audience: row.audience,
    duration: row.duration,
    deliveryFormat: row.delivery_format,
    isFeatured: row.is_featured,
  };
}

export async function getPublishedSpeakingTopics(): Promise<SpeakingTopicSummary[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("speaking_topics")
      .select("id, slug, title, summary, audience, duration, delivery_format, is_featured")
      .eq("is_published", true)
      .order("position", { ascending: true });

    if (error) throw error;
    return (data ?? []).map(mapSummary);
  } catch (error) {
    logger.error("getPublishedSpeakingTopics failed", { error });
    return [];
  }
}

export async function getFeaturedSpeakingTopics(): Promise<SpeakingTopicSummary[]> {
  const topics = await getPublishedSpeakingTopics();
  return topics.filter((t) => t.isFeatured);
}

export async function getSpeakingTopicBySlug(slug: string): Promise<SpeakingTopicDetail | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("speaking_topics")
      .select(
        "id, slug, title, summary, audience, duration, delivery_format, is_featured, learning_objectives, speaking_topic_faqs(id, question, answer, position)"
      )
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    const faqs = (data.speaking_topic_faqs ?? [])
      .sort((a, b) => a.position - b.position)
      .map((f) => ({ id: f.id, question: f.question, answer: f.answer }));

    return {
      ...mapSummary(data),
      learningObjectives: data.learning_objectives,
      faqs,
    };
  } catch (error) {
    logger.error("getSpeakingTopicBySlug failed", { error });
    return null;
  }
}
