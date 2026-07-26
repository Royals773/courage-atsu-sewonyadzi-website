"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminAction } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { BlogPostStatus } from "@/lib/supabase/database.types";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function syncTags(postId: string, tagNames: string[]) {
  const admin = createAdminClient();
  const tagIds: string[] = [];

  for (const rawName of tagNames) {
    const name = rawName.trim();
    if (!name) continue;
    const slug = slugify(name);

    const { data: existing } = await admin.from("blog_tags").select("id").eq("slug", slug).maybeSingle();
    if (existing) {
      tagIds.push(existing.id);
    } else {
      const { data: created } = await admin
        .from("blog_tags")
        .insert({ slug, name })
        .select("id")
        .single();
      if (created) tagIds.push(created.id);
    }
  }

  await admin.from("blog_post_tags").delete().eq("post_id", postId);
  if (tagIds.length > 0) {
    await admin.from("blog_post_tags").insert(tagIds.map((tagId) => ({ post_id: postId, tag_id: tagId })));
  }
}

function parsePostForm(formData: FormData, authorId: string) {
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const status = (formData.get("status")?.toString() as BlogPostStatus) ?? "draft";
  const scheduledAt = formData.get("scheduled_at")?.toString() || null;

  return {
    slug: slugify(slugInput || title),
    title,
    excerpt: formData.get("excerpt")?.toString().trim() || null,
    content: formData.get("content")?.toString() ?? "",
    category_id: formData.get("category_id")?.toString() || null,
    author_id: authorId,
    seo_title: formData.get("seo_title")?.toString().trim() || null,
    seo_description: formData.get("seo_description")?.toString().trim() || null,
    status,
    scheduled_at: status === "scheduled" ? scheduledAt : null,
    published_at: status === "published" ? new Date().toISOString() : null,
  };
}

export async function createPostAction(formData: FormData): Promise<void> {
  const session = await requireAdminAction("editor");
  const values = parsePostForm(formData, session.userId);
  const tagNames = String(formData.get("tags") ?? "").split(",");

  const admin = createAdminClient();
  const { data, error } = await admin.from("blog_posts").insert(values).select("id").single();
  if (error || !data) throw new Error(error?.message ?? "Could not create post.");

  await syncTags(data.id, tagNames);
  revalidatePath("/admin/blog");
  redirect(`/admin/blog/${data.id}`);
}

export async function updatePostAction(postId: string, formData: FormData): Promise<void> {
  const session = await requireAdminAction("editor");
  const values = parsePostForm(formData, session.userId);
  const tagNames = String(formData.get("tags") ?? "").split(",");

  const admin = createAdminClient();

  // Preserve the original published_at once a post has ever been published.
  if (values.status === "published") {
    const { data: existing } = await admin
      .from("blog_posts")
      .select("published_at")
      .eq("id", postId)
      .maybeSingle();
    if (existing?.published_at) values.published_at = existing.published_at;
  }

  const { error } = await admin.from("blog_posts").update(values).eq("id", postId);
  if (error) throw new Error(error.message);

  await syncTags(postId, tagNames);
  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${postId}`);
  revalidatePath(`/insights/${values.slug}`);
  revalidatePath("/insights");
}

export async function deletePostAction(postId: string): Promise<void> {
  await requireAdminAction("editor");
  const admin = createAdminClient();
  await admin
    .from("blog_posts")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", postId);
  revalidatePath("/admin/blog");
  revalidatePath("/insights");
}

export async function uploadPostFeaturedImageAction(
  postId: string,
  formData: FormData
): Promise<void> {
  await requireAdminAction("editor");
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) throw new Error("Choose an image to upload.");

  const admin = createAdminClient();
  const path = `blog/${postId}-${Date.now()}-${file.name}`;
  const { error: uploadError } = await admin.storage.from("media").upload(path, file, {
    contentType: file.type,
  });
  if (uploadError) throw new Error(uploadError.message);

  const { error } = await admin
    .from("blog_posts")
    .update({ featured_image_path: path })
    .eq("id", postId);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/blog/${postId}`);
  revalidatePath("/insights");
}

export async function createBlogCategoryAction(formData: FormData): Promise<void> {
  await requireAdminAction("editor");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Category name is required.");

  const admin = createAdminClient();
  const { error } = await admin.from("blog_categories").insert({ name, slug: slugify(name) });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/blog");
}
