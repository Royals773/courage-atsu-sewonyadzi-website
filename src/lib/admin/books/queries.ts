import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

export interface AdminBookListItem {
  id: string;
  slug: string;
  title: string;
  status: string;
  featured: boolean;
  formatCount: number;
  lowestPrice: number | null;
}

export async function getAdminBooks(): Promise<AdminBookListItem[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("books")
    .select("id, slug, title, status, featured, book_formats(price_amount)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error || !data) {
    logger.error("getAdminBooks failed", { error });
    return [];
  }

  return data.map((book) => {
    const prices = book.book_formats.map((f) => f.price_amount);
    return {
      id: book.id,
      slug: book.slug,
      title: book.title,
      status: book.status,
      featured: book.featured,
      formatCount: book.book_formats.length,
      lowestPrice: prices.length > 0 ? Math.min(...prices) / 100 : null,
    };
  });
}

export async function getAdminBookCategories() {
  const admin = createAdminClient();
  const { data, error } = await admin.from("book_categories").select("*").order("name");
  if (error || !data) return [];
  return data;
}

export async function getAdminBookById(id: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("books")
    .select(
      `*, book_formats(*, inventory(*)), book_images(*), book_category_books(category_id)`
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}
