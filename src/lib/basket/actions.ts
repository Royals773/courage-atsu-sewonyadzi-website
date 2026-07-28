"use server";

import crypto from "node:crypto";

import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/env";
import { getBasketToken, setBasketToken, clearBasketToken } from "./cookie";
import type { BasketLineItem, BasketSnapshot } from "./types";
import { logger } from "@/lib/logger";

const EMPTY_SNAPSHOT: BasketSnapshot = { items: [], subtotal: 0 };

async function getCurrentUserId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.id ?? null;
}

/** Finds the caller's active basket id without creating one. */
export async function findBasketId(): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const admin = createAdminClient();
    const userId = await getCurrentUserId();

    if (userId) {
      const { data } = await admin
        .from("baskets")
        .select("id")
        .eq("user_id", userId)
        .eq("status", "active")
        .maybeSingle();
      return data?.id ?? null;
    }

    const token = await getBasketToken();
    if (!token) return null;

    const { data } = await admin
      .from("baskets")
      .select("id")
      .eq("session_token", token)
      .eq("status", "active")
      .maybeSingle();
    return data?.id ?? null;
  } catch (error) {
    logger.error("findBasketId failed", { error });
    return null;
  }
}

/** Finds the caller's active basket, creating one (and a guest cookie, if needed) if missing. */
async function getOrCreateBasketId(): Promise<string> {
  const existing = await findBasketId();
  if (existing) return existing;

  const admin = createAdminClient();
  const userId = await getCurrentUserId();

  if (userId) {
    const { data, error } = await admin
      .from("baskets")
      .insert({ user_id: userId, status: "active" })
      .select("id")
      .single();
    if (error || !data) throw new Error("Could not create basket");
    return data.id;
  }

  const token = crypto.randomUUID();
  const { data, error } = await admin
    .from("baskets")
    .insert({ session_token: token, status: "active" })
    .select("id")
    .single();
  if (error || !data) throw new Error("Could not create basket");
  await setBasketToken(token);
  return data.id;
}

/**
 * Verifies the given basket_items row belongs to the caller's own basket.
 * The admin client bypasses RLS, so this check is what actually protects
 * against one guest/user mutating another basket's items.
 */
async function assertOwnsBasketItem(basketItemId: string): Promise<string> {
  const admin = createAdminClient();
  const { data: item } = await admin
    .from("basket_items")
    .select("basket_id")
    .eq("id", basketItemId)
    .maybeSingle();

  const ownedBasketId = await findBasketId();
  if (!item || !ownedBasketId || ownedBasketId !== item.basket_id) {
    throw new Error("You don't have permission to modify this basket item.");
  }
  return item.basket_id;
}

async function buildSnapshot(basketId: string | null): Promise<BasketSnapshot> {
  if (!basketId) return EMPTY_SNAPSHOT;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("basket_items")
    .select(
      `id, quantity, unit_price_amount,
       book_formats ( id, label, is_digital, currency,
         books ( id, slug, title, book_images ( alt_text, is_cover ) )
       )`
    )
    .eq("basket_id", basketId)
    .order("created_at", { ascending: true });

  if (error) {
    logger.error("buildSnapshot failed", { error });
    return EMPTY_SNAPSHOT;
  }

  type Row = {
    id: string;
    quantity: number;
    unit_price_amount: number;
    book_formats: {
      id: string;
      label: string;
      is_digital: boolean;
      currency: string;
      books: {
        id: string;
        slug: string;
        title: string;
        book_images: { alt_text: string | null; is_cover: boolean }[];
      } | null;
    } | null;
  };

  const items: BasketLineItem[] = ((data ?? []) as unknown as Row[])
    .filter((row) => row.book_formats?.books)
    .map((row) => {
      const format = row.book_formats!;
      const book = format.books!;
      const cover = book.book_images.find((img) => img.is_cover);
      return {
        id: row.id,
        bookId: book.id,
        bookSlug: book.slug,
        bookTitle: book.title,
        coverImageLabel: cover?.alt_text ?? `Book cover placeholder — ${book.title}`,
        formatId: format.id,
        formatLabel: format.label,
        isDigital: format.is_digital,
        unitPrice: row.unit_price_amount / 100,
        currency: format.currency,
        quantity: row.quantity,
      };
    });

  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  return { items, subtotal };
}

export async function getBasketSnapshot(): Promise<BasketSnapshot> {
  const basketId = await findBasketId();
  return buildSnapshot(basketId);
}

export async function addItemAction(
  bookFormatId: string,
  quantity: number = 1
): Promise<BasketSnapshot> {
  if (quantity < 1) throw new Error("Quantity must be at least 1");

  const admin = createAdminClient();
  const { data: format, error: formatError } = await admin
    .from("book_formats")
    .select("id, price_amount, is_active, inventory(stock_status)")
    .eq("id", bookFormatId)
    .maybeSingle();

  if (formatError || !format || !format.is_active) {
    throw new Error("This format is not currently available.");
  }

  const inventory = Array.isArray(format.inventory) ? format.inventory[0] : format.inventory;
  if (inventory?.stock_status === "out_of_stock") {
    throw new Error("This format is out of stock.");
  }

  const basketId = await getOrCreateBasketId();

  const { data: existing } = await admin
    .from("basket_items")
    .select("id, quantity")
    .eq("basket_id", basketId)
    .eq("book_format_id", bookFormatId)
    .maybeSingle();

  if (existing) {
    await admin
      .from("basket_items")
      .update({ quantity: existing.quantity + quantity })
      .eq("id", existing.id);
  } else {
    await admin.from("basket_items").insert({
      basket_id: basketId,
      book_format_id: bookFormatId,
      quantity,
      unit_price_amount: format.price_amount,
    });
  }

  return buildSnapshot(basketId);
}

export async function updateQuantityAction(
  basketItemId: string,
  quantity: number
): Promise<BasketSnapshot> {
  const basketId = await assertOwnsBasketItem(basketItemId);

  if (quantity <= 0) {
    await createAdminClient().from("basket_items").delete().eq("id", basketItemId);
  } else {
    await createAdminClient()
      .from("basket_items")
      .update({ quantity })
      .eq("id", basketItemId);
  }

  return buildSnapshot(basketId);
}

export async function removeItemAction(basketItemId: string): Promise<BasketSnapshot> {
  const basketId = await assertOwnsBasketItem(basketItemId);
  await createAdminClient().from("basket_items").delete().eq("id", basketItemId);
  return buildSnapshot(basketId);
}

/** Called after a successful sign-in/sign-up to fold any guest basket into the user's basket. */
export async function mergeGuestBasketIntoUser(userId: string): Promise<void> {
  const token = await getBasketToken();
  if (!token) return;

  const admin = createAdminClient();
  const { data: guestBasket } = await admin
    .from("baskets")
    .select("id")
    .eq("session_token", token)
    .eq("status", "active")
    .maybeSingle();

  if (guestBasket) {
    const { error } = await admin.rpc("merge_guest_basket", {
      p_guest_basket_id: guestBasket.id,
      p_user_id: userId,
    });
    if (error) logger.error("mergeGuestBasketIntoUser failed", { error });
  }

  await clearBasketToken();
}

/** Marks the caller's active basket as converted after a successful checkout. */
export async function markBasketConverted(): Promise<void> {
  const basketId = await findBasketId();
  if (!basketId) return;
  await createAdminClient()
    .from("baskets")
    .update({ status: "converted" })
    .eq("id", basketId);
  await clearBasketToken();
}
