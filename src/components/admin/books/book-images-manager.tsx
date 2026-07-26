"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import {
  addBookGalleryImageAction,
  deleteBookImageAction,
  uploadBookCoverAction,
} from "@/lib/admin/books/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";

interface BookImage {
  id: string;
  storage_path: string;
  alt_text: string | null;
  is_cover: boolean;
}

function UploadForm({
  action,
  label,
}: {
  action: (formData: FormData) => Promise<void>;
  label: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await action(formData);
        toast.success("Image uploaded");
      } catch (error) {
        toast.error("Upload failed", {
          description: error instanceof Error ? error.message : "Please try again.",
        });
      }
    });
  }

  return (
    <form action={handleSubmit} className="flex flex-wrap items-end gap-2">
      <div>
        <label className="text-xs text-muted-foreground">Alt text</label>
        <input
          name="alt_text"
          className="mt-1 block h-8 rounded-md border border-input bg-transparent px-2 text-sm"
        />
      </div>
      <input type="file" name="file" accept="image/*" required className="text-xs" />
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? "Uploading…" : label}
      </Button>
    </form>
  );
}

export function BookImagesManager({ bookId, images }: { bookId: string; images: BookImage[] }) {
  const [isPending, startTransition] = useTransition();
  const cover = images.find((img) => img.is_cover);
  const gallery = images.filter((img) => !img.is_cover);

  function handleDelete(imageId: string) {
    startTransition(async () => {
      try {
        await deleteBookImageAction(imageId, bookId);
      } catch (error) {
        toast.error("Couldn't remove image", {
          description: error instanceof Error ? error.message : "Please try again.",
        });
      }
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-lg font-semibold">Cover image</h2>
        <div className="mt-3 flex items-start gap-4">
          {cover ? (
            <ImagePlaceholder label={cover.alt_text ?? "Cover"} aspect="portrait" className="w-32" />
          ) : (
            <p className="text-sm text-muted-foreground">No cover uploaded yet.</p>
          )}
          <UploadForm action={uploadBookCoverAction.bind(null, bookId)} label="Upload cover" />
        </div>
      </div>

      <div>
        <h2 className="font-heading text-lg font-semibold">Gallery images</h2>
        <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {gallery.map((img) => (
            <Card key={img.id}>
              <CardContent className="p-2">
                <ImagePlaceholder label={img.alt_text ?? "Gallery image"} aspect="square" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-1 w-full"
                  disabled={isPending}
                  onClick={() => handleDelete(img.id)}
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                  Remove
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-3">
          <UploadForm action={addBookGalleryImageAction.bind(null, bookId)} label="Add image" />
        </div>
      </div>
    </div>
  );
}
