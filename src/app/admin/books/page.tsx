import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { requireAdmin } from "@/lib/admin/auth";
import { getAdminBooks } from "@/lib/admin/books/queries";
import { formatPrice } from "@/lib/format";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = { title: "Books" };

export default async function AdminBooksPage() {
  await requireAdmin("administrator");
  const books = await getAdminBooks();

  return (
    <>
      <AdminPageHeader
        title="Books"
        description="Manage the book catalogue."
        action={
          <Button render={<Link href="/admin/books/new" />}>
            <Plus className="size-4" aria-hidden="true" />
            Add Book
          </Button>
        }
      />

      {books.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No books yet. Add your first book to get started.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Formats</TableHead>
              <TableHead>From</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.id}>
                <TableCell className="font-medium">{book.title}</TableCell>
                <TableCell>
                  <Badge variant={book.status === "published" ? "default" : "secondary"}>
                    {book.status}
                  </Badge>
                </TableCell>
                <TableCell>{book.featured ? "Yes" : "—"}</TableCell>
                <TableCell>{book.formatCount}</TableCell>
                <TableCell>{book.lowestPrice !== null ? formatPrice(book.lowestPrice) : "—"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" render={<Link href={`/admin/books/${book.id}`} />}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
