"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Upload } from "lucide-react";

import { uploadEventPresentationAction } from "@/lib/admin/speaking/events/actions";
import { Button } from "@/components/ui/button";

export function EventPresentationUpload({
  eventId,
  currentPath,
}: {
  eventId: string;
  currentPath: string | null;
}) {
  const [isPending, startTransition] = useTransition();

  function handleUpload(formData: FormData) {
    startTransition(async () => {
      try {
        await uploadEventPresentationAction(eventId, formData);
        toast.success("Presentation uploaded");
      } catch (error) {
        toast.error("Upload failed", {
          description: error instanceof Error ? error.message : "Please try again.",
        });
      }
    });
  }

  return (
    <div>
      <h2 className="font-heading text-lg font-semibold">Presentation file</h2>
      {currentPath ? (
        <p className="mt-1 text-sm text-muted-foreground">A file is currently attached.</p>
      ) : (
        <p className="mt-1 text-sm text-muted-foreground">No file uploaded yet.</p>
      )}
      <form action={handleUpload} className="mt-3 flex flex-wrap items-center gap-2">
        <input type="file" name="file" required className="text-xs" />
        <Button type="submit" size="sm" disabled={isPending}>
          <Upload className="size-3.5" aria-hidden="true" />
          Upload
        </Button>
      </form>
    </div>
  );
}
