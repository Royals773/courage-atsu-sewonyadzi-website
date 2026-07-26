import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

export async function getAdminPosts() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("blog_posts")
    .select("id, slug, title, status, published_at, scheduled_at, blog_categories(name)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error || !data) {
    logger.error("getAdminPosts failed", { error });
    return [];
  }
  return data;
}

export async function getBlogCategories() {
  const admin = createAdminClient();
  const { data } = await admin.from("blog_categories").select("*").order("name");
  return data ?? [];
}

export async function getBlogTags() {
  const admin = createAdminClient();
  const { data } = await admin.from("blog_tags").select("*").order("name");
  return data ?? [];
}

export async function getAdminPostById(id: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("blog_posts")
    .select("*, blog_post_tags(tag_id)")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}
