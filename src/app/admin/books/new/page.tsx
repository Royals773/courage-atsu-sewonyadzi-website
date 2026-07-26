import type { Metadata } from "next";

import { requireAdmin } from "@/lib/admin/auth";
import { getAdminBookCategories } from "@/lib/admin/books/queries";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { BookCoreForm } from "@/components/admin/books/book-core-form";

export const metadata: Metadata = { title: "Add Book" };

export default async function NewBookPage() {
  await requireAdmin("administrator");
  const categories = await getAdminBookCategories();

  return (
    <>
      <AdminPageHeader title="Add a book" description="You can add formats and images after creating it." />
      <BookCoreForm categories={categories} />
    </>
  );
}
