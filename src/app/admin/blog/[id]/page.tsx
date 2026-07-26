import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { requireAdmin } from "@/lib/admin/auth";
import { getAdminPostById, getBlogCategories, getBlogTags } from "@/lib/admin/blog/queries";
import { deletePostAction, uploadPostFeaturedImageAction } from "@/lib/admin/blog/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PostForm } from "@/components/admin/blog/post-form";
import { FeaturedImageUpload } from "@/components/admin/blog/featured-image-upload";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const metadata: Metadata = { title: "Edit Post" };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin("editor");
  const { id } = await params;
  const [post, categories, tags] = await Promise.all([
    getAdminPostById(id),
    getBlogCategories(),
    getBlogTags(),
  ]);

  if (!post) notFound();

  return (
    <>
      <AdminPageHeader
        title={post.title}
        description={`/insights/${post.slug}`}
        action={
          <div className="flex gap-2">
            {post.status === "published" ? (
              <Button variant="outline" size="sm" render={<Link href={`/insights/${post.slug}`} target="_blank" />}>
                View live
              </Button>
            ) : null}
            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="outline" size="sm" />}>Delete</AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                  <AlertDialogDescription>This can&apos;t be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <form action={deletePostAction.bind(null, post.id)}>
                    <AlertDialogAction type="submit">Delete</AlertDialogAction>
                  </form>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        }
      />

      <FeaturedImageUpload
        postId={post.id}
        currentPath={post.featured_image_path}
        action={uploadPostFeaturedImageAction}
      />

      <Separator className="my-6" />

      <PostForm post={post} categories={categories} tags={tags} />
    </>
  );
}
