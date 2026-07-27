import type { Metadata } from "next";
import { Plus } from "lucide-react";

import { requireAdmin } from "@/lib/admin/auth";
import { getAdminVideos } from "@/lib/admin/videos/queries";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { VideoDialog } from "@/components/admin/videos/video-dialog";
import { VideoUploadForm } from "@/components/admin/videos/video-upload-form";
import { DeleteVideoButton } from "@/components/admin/videos/delete-video-button";

export const metadata: Metadata = { title: "Video Library" };

export default async function AdminVideosPage() {
  await requireAdmin("editor");
  const videos = await getAdminVideos();

  return (
    <>
      <AdminPageHeader
        title="Video Library"
        description="YouTube, Vimeo and uploaded video content."
        action={
          <VideoDialog
            trigger={
              <Button>
                <Plus className="size-4" aria-hidden="true" />
                Add YouTube/Vimeo Video
              </Button>
            }
          />
        }
      />

      <VideoUploadForm />

      {videos.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No videos yet.</p>
      ) : (
        <Table className="mt-6">
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.map((video) => (
              <TableRow key={video.id}>
                <TableCell className="font-medium">{video.title}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{video.platform}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={video.is_published ? "success" : "warning"}>
                    {video.is_published ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  {video.platform !== "upload" ? (
                    <VideoDialog video={video} trigger={<Button variant="outline" size="sm">Edit</Button>} />
                  ) : null}
                  <DeleteVideoButton id={video.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
