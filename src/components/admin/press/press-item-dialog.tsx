"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { upsertPressItemAction } from "@/lib/admin/press/actions";
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

const TYPES = [
  { value: "interview", label: "Interview" },
  { value: "podcast", label: "Podcast" },
  { value: "publication", label: "Publication" },
  { value: "video", label: "Video" },
  { value: "press_release", label: "Press Release" },
];

interface PressItemDialogProps {
  trigger: React.ReactNode;
  item?: {
    id: string;
    title: string;
    type: string;
    publication_name: string | null;
    url: string | null;
    description: string | null;
    published_date: string | null;
    is_featured: boolean;
    is_published: boolean;
    position: number;
  };
}

export function PressItemDialog({ trigger, item }: PressItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await upsertPressItemAction(formData);
        toast.success(item ? "Press item updated" : "Press item added");
        setOpen(false);
      } catch (error) {
        toast.error("Couldn't save press item", {
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
          <DialogTitle>{item ? "Edit press item" : "Add press item"}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          {item ? <input type="hidden" name="id" value={item.id} /> : null}

          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={item?.title} required className="mt-1.5" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select name="type" defaultValue={item?.type ?? "interview"}>
                <SelectTrigger id="type" className="mt-1.5 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="publication_name">Publication</Label>
              <Input id="publication_name" name="publication_name" defaultValue={item?.publication_name ?? ""} className="mt-1.5" />
            </div>
          </div>

          <div>
            <Label htmlFor="url">URL</Label>
            <Input id="url" name="url" type="url" defaultValue={item?.url ?? ""} className="mt-1.5" />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={item?.description ?? ""} rows={3} className="mt-1.5" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="published_date">Published date</Label>
              <Input id="published_date" name="published_date" type="date" defaultValue={item?.published_date ?? ""} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="position">Position</Label>
              <Input id="position" name="position" type="number" defaultValue={item?.position ?? 0} className="mt-1.5" />
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox name="is_published" defaultChecked={item?.is_published ?? true} />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox name="is_featured" defaultChecked={item?.is_featured} />
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
