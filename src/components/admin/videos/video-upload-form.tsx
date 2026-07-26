"use client";

import { useRef, useTransition } from "react";
import { toast } from "sonner";
import { Upload } from "lucide-react";

import { uploadVideoFileAction } from "@/lib/admin/videos/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export function VideoUploadForm() {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleUpload(formData: FormData) {
    startTransition(async () => {
      try {
        await uploadVideoFileAction(formData);
        toast.success("Video uploaded");
        formRef.current?.reset();
      } catch (error) {
        toast.error("Upload failed", {
          description: error instanceof Error ? error.message : "Please try again.",
        });
      }
    });
  }

  return (
    <Card>
      <CardContent>
        <h2 className="font-heading text-lg font-semibold">Upload a video file</h2>
        <form ref={formRef} action={handleUpload} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="upload-title">Title</Label>
            <Input id="upload-title" name="title" required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="upload-category">Category</Label>
            <Input id="upload-category" name="category" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="upload-file">Video file</Label>
            <input id="upload-file" type="file" name="file" accept="video/*" required className="mt-1.5 block text-sm" />
          </div>
          <div>
            <Label htmlFor="upload-thumbnail">Thumbnail (optional)</Label>
            <input id="upload-thumbnail" type="file" name="thumbnail" accept="image/*" className="mt-1.5 block text-sm" />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={isPending}>
              <Upload className="size-4" aria-hidden="true" />
              Upload video
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
