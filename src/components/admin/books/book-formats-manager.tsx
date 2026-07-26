"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Upload } from "lucide-react";

import { deleteBookFormatAction, uploadDigitalFileAction } from "@/lib/admin/books/actions";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BookFormatDialog } from "@/components/admin/books/book-format-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface BookFormat {
  id: string;
  format_type: string;
  label: string;
  price_amount: number;
  sku: string | null;
  is_digital: boolean;
  is_active: boolean;
  digital_file_storage_path: string | null;
  inventory: { tracks_stock: boolean; quantity_on_hand: number | null; stock_status: string } | null;
}

function DigitalFileUpload({ bookId, formatId }: { bookId: string; formatId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleUpload(formData: FormData) {
    startTransition(async () => {
      try {
        await uploadDigitalFileAction(formatId, bookId, formData);
        toast.success("File uploaded");
      } catch (error) {
        toast.error("Upload failed", {
          description: error instanceof Error ? error.message : "Please try again.",
        });
      }
    });
  }

  return (
    <form action={handleUpload} className="flex items-center gap-2">
      <input type="file" name="file" accept=".epub,.pdf" className="text-xs" required />
      <Button type="submit" size="icon-sm" variant="outline" disabled={isPending} aria-label="Upload file">
        <Upload className="size-3.5" aria-hidden="true" />
      </Button>
    </form>
  );
}

export function BookFormatsManager({ bookId, formats }: { bookId: string; formats: BookFormat[] }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(formatId: string) {
    startTransition(async () => {
      try {
        await deleteBookFormatAction(formatId, bookId);
        toast.success("Format removed");
      } catch (error) {
        toast.error("Couldn't remove format", {
          description: error instanceof Error ? error.message : "Please try again.",
        });
      }
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold">Formats &amp; inventory</h2>
        <BookFormatDialog
          bookId={bookId}
          trigger={
            <Button variant="outline" size="sm">
              <Plus className="size-4" aria-hidden="true" />
              Add format
            </Button>
          }
        />
      </div>

      {formats.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">No formats yet.</p>
      ) : (
        <Table className="mt-3">
          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Digital file</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formats.map((format) => (
              <TableRow key={format.id}>
                <TableCell>
                  <p className="font-medium">{format.label}</p>
                  <p className="text-xs text-muted-foreground">{format.format_type}</p>
                </TableCell>
                <TableCell>{formatPrice(format.price_amount / 100)}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {format.inventory?.stock_status.replace("_", " ") ?? "—"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format.is_digital ? (
                    format.digital_file_storage_path ? (
                      <span className="text-xs text-muted-foreground">Uploaded</span>
                    ) : (
                      <DigitalFileUpload bookId={bookId} formatId={format.id} />
                    )
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <BookFormatDialog
                      bookId={bookId}
                      format={format}
                      trigger={
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      }
                    />
                    <AlertDialog>
                      <AlertDialogTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Delete format" />}>
                        <Trash2 className="size-3.5" aria-hidden="true" />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove this format?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This can&apos;t be undone. Existing orders referencing it are unaffected.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction disabled={isPending} onClick={() => handleDelete(format.id)}>
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
