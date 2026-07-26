"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";

export function FeaturedImageUpload({
  postId,
  currentPath,
  action,
}: {
  postId: string;
  currentPath: string | null;
  action: (postId: string, formData: FormData) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await action(postId, formData);
        toast.success("Featured image updated");
      } catch (error) {
        toast.error("Upload failed", {
          description: error instanceof Error ? error.message : "Please try again.",
        });
      }
    });
  }

  return (
    <div>
      <h2 className="font-heading text-lg font-semibold">Featured image</h2>
      <div className="mt-3 flex items-start gap-4">
        {currentPath ? (
          <ImagePlaceholder label="Featured image" aspect="landscape" className="w-48" />
        ) : (
          <p className="text-sm text-muted-foreground">No featured image yet.</p>
        )}
        <form action={handleSubmit} className="flex items-center gap-2">
          <input type="file" name="file" accept="image/*" required className="text-xs" />
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? "Uploading…" : "Upload"}
          </Button>
        </form>
      </div>
    </div>
  );
}
