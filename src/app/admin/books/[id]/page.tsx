import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Trash2 } from "lucide-react";

import { requireAdmin } from "@/lib/admin/auth";
import { getAdminBookById, getAdminBookCategories } from "@/lib/admin/books/queries";
import { deleteBookAction } from "@/lib/admin/books/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { BookCoreForm } from "@/components/admin/books/book-core-form";
import { BookFormatsManager } from "@/components/admin/books/book-formats-manager";
import { BookImagesManager } from "@/components/admin/books/book-images-manager";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
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

export const metadata: Metadata = { title: "Edit Book" };

export default async function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin("administrator");
  const { id } = await params;
  const [book, categories] = await Promise.all([getAdminBookById(id), getAdminBookCategories()]);

  if (!book) notFound();

  return (
    <>
      <AdminPageHeader
        title={book.title}
        description={`/books/${book.slug}`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" render={<Link href={`/books/${book.slug}`} target="_blank" />}>
              View live
            </Button>
            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="outline" size="sm" />}>
                <Trash2 className="size-4" aria-hidden="true" />
                Delete
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this book?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This archives and hides the book from the storefront. It is not permanently
                    erased (existing orders still reference it).
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <form action={deleteBookAction.bind(null, book.id)}>
                    <AlertDialogAction type="submit">Delete</AlertDialogAction>
                  </form>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        }
      />

      <BookCoreForm book={book} categories={categories} />

      <Separator className="my-8" />
      <BookFormatsManager bookId={book.id} formats={book.book_formats} />

      <Separator className="my-8" />
      <BookImagesManager bookId={book.id} images={book.book_images} />
    </>
  );
}
