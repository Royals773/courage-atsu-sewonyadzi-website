"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { upsertBookFormatAction } from "@/lib/admin/books/actions";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FORMAT_TYPES = ["paperback", "hardcover", "ebook", "audiobook", "signed", "bundle"];
const STOCK_STATUSES = ["in_stock", "low_stock", "preorder", "out_of_stock"];

interface BookFormatDialogProps {
  bookId: string;
  trigger: React.ReactNode;
  format?: {
    id: string;
    format_type: string;
    label: string;
    price_amount: number;
    sku: string | null;
    is_digital: boolean;
    is_active: boolean;
    inventory: { tracks_stock: boolean; quantity_on_hand: number | null; stock_status: string } | null;
  };
}

export function BookFormatDialog({ bookId, trigger, format }: BookFormatDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await upsertBookFormatAction(formData);
        toast.success(format ? "Format updated" : "Format added");
        setOpen(false);
      } catch (error) {
        toast.error("Couldn't save format", {
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
          <DialogTitle>{format ? "Edit format" : "Add format"}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <input type="hidden" name="book_id" value={bookId} />
          {format ? <input type="hidden" name="id" value={format.id} /> : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="format_type">Type</Label>
              <Select name="format_type" defaultValue={format?.format_type ?? "paperback"}>
                <SelectTrigger id="format_type" className="mt-1.5 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FORMAT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="label">Label</Label>
              <Input id="label" name="label" defaultValue={format?.label} required className="mt-1.5" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="price">Price (£)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                defaultValue={format ? format.price_amount / 100 : ""}
                required
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" name="sku" defaultValue={format?.sku ?? ""} className="mt-1.5" />
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox name="is_digital" defaultChecked={format?.is_digital} />
              Digital
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox name="is_active" defaultChecked={format?.is_active ?? true} />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox name="tracks_stock" defaultChecked={format?.inventory?.tracks_stock ?? true} />
              Tracks stock
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="stock_status">Stock status</Label>
              <Select name="stock_status" defaultValue={format?.inventory?.stock_status ?? "in_stock"}>
                <SelectTrigger id="stock_status" className="mt-1.5 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STOCK_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quantity_on_hand">Quantity on hand</Label>
              <Input
                id="quantity_on_hand"
                name="quantity_on_hand"
                type="number"
                defaultValue={format?.inventory?.quantity_on_hand ?? ""}
                className="mt-1.5"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : "Save format"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
