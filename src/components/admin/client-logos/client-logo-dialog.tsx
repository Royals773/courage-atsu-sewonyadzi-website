"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { updateClientLogoAction } from "@/lib/admin/client-logos/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ClientLogoDialogProps {
  trigger: React.ReactNode;
  logo: {
    id: string;
    name: string;
    website_url: string | null;
    is_published: boolean;
    position: number;
  };
}

export function ClientLogoDialog({ trigger, logo }: ClientLogoDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await updateClientLogoAction(formData);
        toast.success("Client logo updated");
        setOpen(false);
      } catch (error) {
        toast.error("Couldn't save client logo", {
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
          <DialogTitle>Edit client logo</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <input type="hidden" name="id" value={logo.id} />

          <div>
            <Label htmlFor="edit-logo-name">Organisation name</Label>
            <Input id="edit-logo-name" name="name" defaultValue={logo.name} required className="mt-1.5" />
          </div>

          <div>
            <Label htmlFor="edit-logo-website">Website URL</Label>
            <Input
              id="edit-logo-website"
              name="website_url"
              type="url"
              defaultValue={logo.website_url ?? ""}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="edit-logo-position">Position</Label>
            <Input
              id="edit-logo-position"
              name="position"
              type="number"
              defaultValue={logo.position}
              className="mt-1.5"
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <Checkbox name="is_published" defaultChecked={logo.is_published} />
            Published
          </label>

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
