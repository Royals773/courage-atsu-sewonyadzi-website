"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { upsertVideoAction } from "@/lib/admin/videos/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VideoDialogProps {
  trigger: React.ReactNode;
  video?: {
    id: string;
    title: string;
    description: string | null;
    platform: string;
    video_url: string | null;
    category: string | null;
    is_featured: boolean;
    is_published: boolean;
    position: number;
  };
}

export function VideoDialog({ trigger, video }: VideoDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await upsertVideoAction(formData);
        toast.success(video ? "Video updated" : "Video added");
        setOpen(false);
      } catch (error) {
        toast.error("Couldn't save video", {
          description: error instanceof Error ? error.message : "Please try again.",
        });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{video ? "Edit video" : "Add YouTube/Vimeo video"}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          {video ? <input type="hidden" name="id" value={video.id} /> : null}

          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={video?.title} required className="mt-1.5" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="platform">Platform</Label>
              <Select name="platform" defaultValue={video?.platform ?? "youtube"}>
                <SelectTrigger id="platform" className="mt-1.5 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="vimeo">Vimeo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input id="category" name="category" defaultValue={video?.category ?? ""} className="mt-1.5" />
            </div>
          </div>

          <div>
            <Label htmlFor="video_url">Video URL</Label>
            <Input id="video_url" name="video_url" defaultValue={video?.video_url ?? ""} required className="mt-1.5" />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={video?.description ?? ""} rows={3} className="mt-1.5" />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox name="is_published" defaultChecked={video?.is_published ?? true} />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox name="is_featured" defaultChecked={video?.is_featured} />
              Featured
            </label>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
