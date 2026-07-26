"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminAction } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type {
  BookFormatType,
  BookStatus,
  StockStatus,
} from "@/lib/supabase/database.types";

function linesToArray(value: FormDataEntryValue | null): string[] {
  return (value?.toString() ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface BookFormValues {
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  author_note: string | null;
  publication_date: string | null;
  featured: boolean;
  is_new: boolean;
  has_sample_chapter: boolean;
  status: BookStatus;
  popularity_score: number;
  key_lessons: string[];
  who_its_for: string[];
  table_of_contents: { title: string }[];
}

function parseBookForm(formData: FormData): BookFormValues {
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();

  return {
    slug: slugify(slugInput || title),
    title,
    subtitle: (formData.get("subtitle")?.toString().trim() || null) ?? null,
    description: (formData.get("description")?.toString().trim() || null) ?? null,
    author_note: (formData.get("author_note")?.toString().trim() || null) ?? null,
    publication_date: (formData.get("publication_date")?.toString() || null) ?? null,
    featured: formData.get("featured") === "on",
    is_new: formData.get("is_new") === "on",
    has_sample_chapter: formData.get("has_sample_chapter") === "on",
    status: (formData.get("status")?.toString() as BookStatus) ?? "draft",
    popularity_score: Number(formData.get("popularity_score") ?? 0) || 0,
    key_lessons: linesToArray(formData.get("key_lessons")),
    who_its_for: linesToArray(formData.get("who_its_for")),
    table_of_contents: linesToArray(formData.get("table_of_contents")).map((line) => ({
      title: line,
    })),
  };
}

async function syncBookCategories(bookId: string, categoryIds: string[]) {
  const admin = createAdminClient();
  await admin.from("book_category_books").delete().eq("book_id", bookId);
  if (categoryIds.length > 0) {
    await admin
      .from("book_category_books")
      .insert(categoryIds.map((categoryId) => ({ book_id: bookId, category_id: categoryId })));
  }
}

export async function createBookAction(formData: FormData): Promise<void> {
  await requireAdminAction("administrator");
  const values = parseBookForm(formData);
  const categoryIds = formData.getAll("category_ids").map(String);

  const admin = createAdminClient();
  const { data, error } = await admin.from("books").insert(values).select("id").single();

  if (error || !data) {
    throw new Error(error?.message ?? "Could not create book.");
  }

  await syncBookCategories(data.id, categoryIds);
  revalidatePath("/admin/books");
  redirect(`/admin/books/${data.id}`);
}

export async function updateBookAction(bookId: string, formData: FormData): Promise<void> {
  await requireAdminAction("administrator");
  const values = parseBookForm(formData);
  const categoryIds = formData.getAll("category_ids").map(String);

  const admin = createAdminClient();
  const { error } = await admin.from("books").update(values).eq("id", bookId);
  if (error) throw new Error(error.message);

  await syncBookCategories(bookId, categoryIds);
  revalidatePath("/admin/books");
  revalidatePath(`/admin/books/${bookId}`);
  revalidatePath(`/books/${values.slug}`);
}

export async function deleteBookAction(bookId: string): Promise<void> {
  await requireAdminAction("administrator");
  const admin = createAdminClient();
  const { error } = await admin
    .from("books")
    .update({ deleted_at: new Date().toISOString(), status: "archived" })
    .eq("id", bookId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/books");
}

export async function toggleBookFeaturedAction(bookId: string, featured: boolean): Promise<void> {
  await requireAdminAction("administrator");
  const admin = createAdminClient();
  await admin.from("books").update({ featured }).eq("id", bookId);
  revalidatePath("/admin/books");
}

export async function toggleBookStatusAction(bookId: string, status: BookStatus): Promise<void> {
  await requireAdminAction("administrator");
  const admin = createAdminClient();
  await admin.from("books").update({ status }).eq("id", bookId);
  revalidatePath("/admin/books");
}

// Formats & inventory -----------------------------------------------------------

export async function upsertBookFormatAction(formData: FormData): Promise<void> {
  await requireAdminAction("administrator");
  const admin = createAdminClient();

  const id = formData.get("id")?.toString() || null;
  const bookId = String(formData.get("book_id"));
  const priceAmount = Math.round(Number(formData.get("price") ?? 0) * 100);
  const isDigital = formData.get("is_digital") === "on";

  const formatValues = {
    book_id: bookId,
    format_type: formData.get("format_type")?.toString() as BookFormatType,
    label: String(formData.get("label") ?? "").trim(),
    price_amount: priceAmount,
    is_digital: isDigital,
    sku: formData.get("sku")?.toString().trim() || null,
    is_active: formData.get("is_active") === "on",
  };

  let formatId = id;
  if (id) {
    const { error } = await admin.from("book_formats").update(formatValues).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await admin
      .from("book_formats")
      .insert(formatValues)
      .select("id")
      .single();
    if (error || !data) throw new Error(error?.message ?? "Could not create format.");
    formatId = data.id;
  }

  const stockStatus = formData.get("stock_status")?.toString() as StockStatus;
  const quantityRaw = formData.get("quantity_on_hand")?.toString();
  const tracksStock = formData.get("tracks_stock") === "on";

  const inventoryValues = {
    book_format_id: formatId!,
    tracks_stock: tracksStock,
    quantity_on_hand: tracksStock && quantityRaw ? Number(quantityRaw) : null,
    stock_status: stockStatus,
  };

  const { data: existingInventory } = await admin
    .from("inventory")
    .select("id")
    .eq("book_format_id", formatId!)
    .maybeSingle();

  if (existingInventory) {
    await admin.from("inventory").update(inventoryValues).eq("id", existingInventory.id);
  } else {
    await admin.from("inventory").insert(inventoryValues);
  }

  revalidatePath(`/admin/books/${bookId}`);
}

export async function deleteBookFormatAction(formatId: string, bookId: string): Promise<void> {
  await requireAdminAction("administrator");
  const admin = createAdminClient();
  await admin.from("book_formats").delete().eq("id", formatId);
  revalidatePath(`/admin/books/${bookId}`);
}

// Images and files ----------------------------------------------------------------

export async function uploadBookCoverAction(bookId: string, formData: FormData): Promise<void> {
  await requireAdminAction("administrator");
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) throw new Error("Choose an image to upload.");

  const admin = createAdminClient();
  const path = `covers/${bookId}-${Date.now()}-${file.name}`;
  const { error: uploadError } = await admin.storage.from("book-images").upload(path, file, {
    contentType: file.type,
  });
  if (uploadError) throw new Error(uploadError.message);

  await admin.from("book_images").update({ is_cover: false }).eq("book_id", bookId).eq("is_cover", true);
  const { error } = await admin.from("book_images").insert({
    book_id: bookId,
    storage_path: path,
    alt_text: formData.get("alt_text")?.toString() || null,
    is_cover: true,
    position: 0,
  });
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/books/${bookId}`);
}

export async function addBookGalleryImageAction(bookId: string, formData: FormData): Promise<void> {
  await requireAdminAction("administrator");
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) throw new Error("Choose an image to upload.");

  const admin = createAdminClient();
  const path = `gallery/${bookId}-${Date.now()}-${file.name}`;
  const { error: uploadError } = await admin.storage.from("book-images").upload(path, file, {
    contentType: file.type,
  });
  if (uploadError) throw new Error(uploadError.message);

  const { error } = await admin.from("book_images").insert({
    book_id: bookId,
    storage_path: path,
    alt_text: formData.get("alt_text")?.toString() || null,
    is_cover: false,
    position: 1,
  });
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/books/${bookId}`);
}

export async function deleteBookImageAction(imageId: string, bookId: string): Promise<void> {
  await requireAdminAction("administrator");
  const admin = createAdminClient();
  const { data: image } = await admin
    .from("book_images")
    .select("storage_path")
    .eq("id", imageId)
    .maybeSingle();
  await admin.from("book_images").delete().eq("id", imageId);
  if (image) {
    await admin.storage.from("book-images").remove([image.storage_path]);
  }
  revalidatePath(`/admin/books/${bookId}`);
}

export async function uploadDigitalFileAction(
  formatId: string,
  bookId: string,
  formData: FormData
): Promise<void> {
  await requireAdminAction("administrator");
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) throw new Error("Choose a file to upload.");

  const admin = createAdminClient();
  const path = `ebooks/${formatId}-${Date.now()}-${file.name}`;
  const { error: uploadError } = await admin.storage.from("book-files").upload(path, file, {
    contentType: file.type,
  });
  if (uploadError) throw new Error(uploadError.message);

  const { error } = await admin
    .from("book_formats")
    .update({ digital_file_storage_path: path })
    .eq("id", formatId);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/books/${bookId}`);
}
