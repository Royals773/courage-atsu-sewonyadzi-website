import "server-only";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { siteConfig } from "@/lib/content/site-config";
import { getMediaSignedUrl } from "@/lib/media/signed-url";
import { logger } from "@/lib/logger";

export interface PublicBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  readingTimeMinutes: number;
  featuredImagePath: string | null;
  featuredImageUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
}

const POST_SELECT = "*, blog_categories(name)";

function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

async function mapPost(row: {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  published_at: string | null;
  featured_image_path: string | null;
  seo_title: string | null;
  seo_description: string | null;
  blog_categories: { name: string } | null;
}): Promise<PublicBlogPost> {
  const featuredImageUrl = row.featured_image_path
    ? await getMediaSignedUrl(row.featured_image_path)
    : null;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    content: row.content,
    category: row.blog_categories?.name ?? "Uncategorised",
    author: siteConfig.displayName,
    publishedAt: row.published_at ?? "",
    readingTimeMinutes: estimateReadingTime(row.content),
    featuredImagePath: row.featured_image_path,
    featuredImageUrl,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
  };
}

export async function getPublishedPosts(): Promise<PublicBlogPost[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select(POST_SELECT)
      .eq("status", "published")
      .is("deleted_at", null)
      .order("published_at", { ascending: false });

    if (error) throw error;
    return Promise.all((data ?? []).map(mapPost));
  } catch (error) {
    logger.error("getPublishedPosts failed", { error });
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<PublicBlogPost | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select(POST_SELECT)
      .eq("slug", slug)
      .eq("status", "published")
      .is("deleted_at", null)
      .maybeSingle();

    if (error) throw error;
    return data ? mapPost(data) : null;
  } catch (error) {
    logger.error("getPostBySlug failed", { error });
    return null;
  }
}

/**
 * Book categories and blog categories are separate taxonomies that happen
 * to overlap in meaning — this maps the near-synonyms so "related articles"
 * on a book page can be a genuine content match, not a fabricated one.
 */
const BOOK_TO_BLOG_CATEGORY_SYNONYMS: Record<string, string[]> = {
  "care-quality": ["adult-social-care"],
  "personal-development": ["personal-growth"],
  "africa-investment": ["africa", "investment"],
};

function slugifyCategoryName(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, "-");
}

/** Blog posts sharing a category (or known near-synonym) with the given book categories. */
export async function getRelatedArticlesForBook(
  bookCategories: string[],
  limit = 3
): Promise<PublicBlogPost[]> {
  if (bookCategories.length === 0) return [];

  const wantedSlugs = new Set<string>();
  for (const category of bookCategories) {
    wantedSlugs.add(category);
    for (const synonym of BOOK_TO_BLOG_CATEGORY_SYNONYMS[category] ?? []) {
      wantedSlugs.add(synonym);
    }
  }

  const posts = await getPublishedPosts();
  return posts
    .filter((post) => wantedSlugs.has(slugifyCategoryName(post.category)))
    .slice(0, limit);
}
