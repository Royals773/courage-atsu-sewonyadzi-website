import type { Metadata } from "next";

import { requireAdmin } from "@/lib/admin/auth";
import { getBlogCategories, getBlogTags } from "@/lib/admin/blog/queries";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PostForm } from "@/components/admin/blog/post-form";

export const metadata: Metadata = { title: "New Post" };

export default async function NewPostPage() {
  await requireAdmin("editor");
  const [categories, tags] = await Promise.all([getBlogCategories(), getBlogTags()]);

  return (
    <>
      <AdminPageHeader title="New post" />
      <PostForm categories={categories} tags={tags} />
    </>
  );
}
