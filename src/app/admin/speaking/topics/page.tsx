import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { requireAdmin } from "@/lib/admin/auth";
import { getAdminSpeakingTopics } from "@/lib/admin/speaking/topics/queries";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const metadata: Metadata = { title: "Speaking Topics" };

export default async function AdminSpeakingTopicsPage() {
  await requireAdmin("editor");
  const topics = await getAdminSpeakingTopics();

  return (
    <>
      <AdminPageHeader
        title="Speaking Topics"
        description="Manage the topics offered for keynotes, workshops and training."
        action={
          <Button render={<Link href="/admin/speaking/topics/new" />}>
            <Plus className="size-4" aria-hidden="true" />
            Add Topic
          </Button>
        }
      />

      {topics.length === 0 ? (
        <p className="text-sm text-muted-foreground">No topics yet. Add your first one to get started.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topics.map((topic) => (
              <TableRow key={topic.id}>
                <TableCell className="font-medium">{topic.title}</TableCell>
                <TableCell>{topic.duration ?? "—"}</TableCell>
                <TableCell>{topic.is_featured ? "Yes" : "—"}</TableCell>
                <TableCell>
                  <Badge variant={topic.is_published ? "default" : "secondary"}>
                    {topic.is_published ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" render={<Link href={`/admin/speaking/topics/${topic.id}`} />}>
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
