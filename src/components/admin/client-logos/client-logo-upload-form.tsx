"use client";

import { useRef, useTransition } from "react";
import { toast } from "sonner";
import { Upload } from "lucide-react";

import { uploadClientLogoAction } from "@/lib/admin/client-logos/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export function ClientLogoUploadForm() {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleUpload(formData: FormData) {
    startTransition(async () => {
      try {
        await uploadClientLogoAction(formData);
        toast.success("Client logo added");
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
        <h2 className="font-heading text-lg font-semibold">Add a client/organisation logo</h2>
        <form ref={formRef} action={handleUpload} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="logo-name">Organisation name</Label>
            <Input id="logo-name" name="name" required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="logo-website">Website URL (optional)</Label>
            <Input id="logo-website" name="website_url" type="url" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="logo-file">Logo image</Label>
            <input id="logo-file" type="file" name="file" accept="image/*" required className="mt-1.5 block text-sm" />
          </div>
          <div>
            <Label htmlFor="logo-position">Position (lower shows first)</Label>
            <Input id="logo-position" name="position" type="number" defaultValue={0} className="mt-1.5" />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={isPending}>
              <Upload className="size-4" aria-hidden="true" />
              Upload logo
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
