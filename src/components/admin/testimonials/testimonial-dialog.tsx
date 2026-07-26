"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { upsertTestimonialAction } from "@/lib/admin/testimonials/actions";
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

const CATEGORIES = ["conferences", "leadership", "corporate", "training", "books"];

interface TestimonialDialogProps {
  trigger: React.ReactNode;
  testimonial?: {
    id: string;
    quote: string;
    author_name: string;
    author_role: string | null;
    organisation: string | null;
    category: string;
    is_approved: boolean;
    is_featured: boolean;
  };
}

export function TestimonialDialog({ trigger, testimonial }: TestimonialDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await upsertTestimonialAction(formData);
        toast.success(testimonial ? "Testimonial updated" : "Testimonial added");
        setOpen(false);
      } catch (error) {
        toast.error("Couldn't save testimonial", {
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
          <DialogTitle>{testimonial ? "Edit testimonial" : "Add testimonial"}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          {testimonial ? <input type="hidden" name="id" value={testimonial.id} /> : null}

          <div>
            <Label htmlFor="quote">Quote</Label>
            <Textarea id="quote" name="quote" defaultValue={testimonial?.quote} rows={3} required className="mt-1.5" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="author_name">Author name</Label>
              <Input id="author_name" name="author_name" defaultValue={testimonial?.author_name} required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="author_role">Author role</Label>
              <Input id="author_role" name="author_role" defaultValue={testimonial?.author_role ?? ""} className="mt-1.5" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="organisation">Organisation</Label>
              <Input id="organisation" name="organisation" defaultValue={testimonial?.organisation ?? ""} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select name="category" defaultValue={testimonial?.category ?? "conferences"}>
                <SelectTrigger id="category" className="mt-1.5 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.replace("-", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox name="is_approved" defaultChecked={testimonial?.is_approved} />
              Approved (visible publicly)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox name="is_featured" defaultChecked={testimonial?.is_featured} />
              Featured on homepage
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
