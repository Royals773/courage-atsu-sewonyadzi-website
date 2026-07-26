"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ImageUploadForm({
  title,
  hasImage,
  emptyNote,
  action,
}: {
  title: string;
  hasImage: boolean;
  emptyNote: string;
  action: (formData: FormData) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await action(formData);
        toast.success(`${title} updated`);
      } catch (error) {
        toast.error(`Couldn't upload ${title.toLowerCase()}`, {
          description: error instanceof Error ? error.message : "Please try again.",
        });
      }
    });
  }

  return (
    <Card>
      <CardContent>
        <h2 className="font-heading text-lg font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {hasImage ? `A ${title.toLowerCase()} is currently set.` : emptyNote}
        </p>
        <form action={handleSubmit} className="mt-4 flex items-center gap-2">
          <input type="file" name="file" accept="image/*" required className="text-sm" />
          <Button type="submit" disabled={isPending}>
            {isPending ? "Uploading…" : `Upload ${title.toLowerCase()}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
