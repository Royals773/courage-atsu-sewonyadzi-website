import "server-only";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type {
  Book,
  BookCategory,
  BookFormat,
  BookFormatType,
  StockStatus,
  TableOfContentsEntry,
} from "@/lib/content/types";
import type { Database } from "@/lib/supabase/database.types";
import { getBookImageSignedUrl } from "@/lib/media/signed-url";
import { logger } from "@/lib/logger";

type DbBook = Database["public"]["Tables"]["books"]["Row"];
type DbBookFormat = Database["public"]["Tables"]["book_formats"]["Row"];
type DbBookImage = Database["public"]["Tables"]["book_images"]["Row"];
type DbInventory = Database["public"]["Tables"]["inventory"]["Row"];

interface DbBookRow extends DbBook {
  book_formats: (DbBookFormat & { inventory: DbInventory[] | DbInventory | null })[];
  book_images: DbBookImage[];
  book_category_books: { book_categories: { slug: string } | null }[];
}

function mapStockStatus(status: string | undefined): StockStatus {
  switch (status) {
    case "in_stock":
      return "in-stock";
    case "low_stock":
      return "low-stock";
    case "preorder":
      return "preorder";
    default:
      return "out-of-stock";
  }
}

function mapFormat(format: DbBookRow["book_formats"][number]): BookFormat {
  const inventory = Array.isArray(format.inventory) ? format.inventory[0] : format.inventory;
  return {
    id: format.id,
    type: format.format_type as BookFormatType,
    label: format.label,
    price: format.price_amount / 100,
    currency: format.currency as "GBP",
    isDigital: format.is_digital,
    stockStatus: mapStockStatus(inventory?.stock_status),
  };
}

async function mapBook(row: DbBookRow): Promise<Book> {
  const cover = row.book_images.find((img) => img.is_cover);
  const gallery = row.book_images
    .filter((img) => !img.is_cover)
    .sort((a, b) => a.position - b.position);

  const [coverImageUrl, galleryImageUrls] = await Promise.all([
    cover ? getBookImageSignedUrl(cover.storage_path) : Promise.resolve(null),
    Promise.all(gallery.map((img) => getBookImageSignedUrl(img.storage_path))),
  ]);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle ?? "",
    description: row.description ?? "",
    authorNote: row.author_note ?? "",
    coverImageLabel: cover?.alt_text ?? `Book cover placeholder — ${row.title}`,
    coverImageUrl,
    galleryImageLabels: gallery.map(
      (img, i) => img.alt_text ?? `Additional cover image ${i + 1} — ${row.title}`
    ),
    galleryImageUrls,
    categories: row.book_category_books
      .map((link) => link.book_categories?.slug)
      .filter((slug): slug is string => Boolean(slug)) as BookCategory[],
    formats: row.book_formats.filter((f) => f.is_active).map(mapFormat),
    publicationDate: row.publication_date ?? "",
    featured: row.featured,
    isNew: row.is_new,
    ratingPlaceholder: true,
    popularityScore: row.popularity_score,
    keyLessons: row.key_lessons,
    whoItsFor: row.who_its_for,
    tableOfContents: row.table_of_contents as unknown as TableOfContentsEntry[],
    hasSampleChapter: row.has_sample_chapter,
  };
}

const BOOK_SELECT = `
  *,
  book_formats(*, inventory(*)),
  book_images(*),
  book_category_books(book_categories(slug))
`;

/**
 * All of these return `[]` / `null` (never throw) when Supabase isn't
 * configured or a query fails, so storefront pages can render a clear
 * empty/error state instead of crashing. See src/components/shared/
 * backend-unavailable.tsx and the Step 3 report.
 */
export async function getPublishedBooks(): Promise<Book[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("books")
      .select(BOOK_SELECT)
      .eq("status", "published")
      .is("deleted_at", null)
      .order("publication_date", { ascending: false });

    if (error) throw error;
    return Promise.all(((data ?? []) as unknown as DbBookRow[]).map(mapBook));
  } catch (error) {
    logger.error("getPublishedBooks failed", { error });
    return [];
  }
}

export async function getFeaturedBooks(): Promise<Book[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("books")
      .select(BOOK_SELECT)
      .eq("status", "published")
      .eq("featured", true)
      .is("deleted_at", null)
      .order("publication_date", { ascending: false });

    if (error) throw error;
    return Promise.all(((data ?? []) as unknown as DbBookRow[]).map(mapBook));
  } catch (error) {
    logger.error("getFeaturedBooks failed", { error });
    return [];
  }
}

export async function getBookBySlug(slug: string): Promise<Book | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("books")
      .select(BOOK_SELECT)
      .eq("slug", slug)
      .eq("status", "published")
      .is("deleted_at", null)
      .maybeSingle();

    if (error) throw error;
    return data ? mapBook(data as unknown as DbBookRow) : null;
  } catch (error) {
    logger.error("getBookBySlug failed", { error });
    return null;
  }
}
