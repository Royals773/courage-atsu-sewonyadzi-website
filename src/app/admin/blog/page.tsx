import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { requireAdmin } from "@/lib/admin/auth";
import { getAdminPosts } from "@/lib/admin/blog/queries";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = { title: "Blog" };

export default async function AdminBlogPage() {
  await requireAdmin("editor");
  const posts = await getAdminPosts();

  return (
    <>
      <AdminPageHeader
        title="Blog"
        description="Manage articles and insights."
        action={
          <Button render={<Link href="/admin/blog/new" />}>
            <Plus className="size-4" aria-hidden="true" />
            New Post
          </Button>
        }
      />

      {posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No posts yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>{post.blog_categories?.name ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={post.status === "published" ? "default" : "secondary"}>
                    {post.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" render={<Link href={`/admin/blog/${post.id}`} />}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
