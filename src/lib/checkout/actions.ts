"use server";

import { redirect } from "next/navigation";
import type Stripe from "stripe";

import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/session";
import { findBasketId } from "@/lib/basket/actions";
import { getStripeClient } from "@/lib/stripe/client";
import { validateDiscountCodeAction } from "@/lib/discounts/actions";
import { siteConfig } from "@/lib/content/site-config";

const ALLOWED_SHIPPING_COUNTRIES = [
  "GB",
  "IE",
  "US",
  "CA",
  "AU",
  "NG",
  "GH",
  "ZA",
] as const;

interface CheckoutBasketItem {
  book_format_id: string;
  quantity: number;
  unit_price_amount: number;
  book_formats: {
    label: string;
    is_digital: boolean;
    inventory: { stock_status: string } | { stock_status: string }[] | null;
    books: { title: string } | null;
  } | null;
}

export async function createCheckoutSessionAction(options?: {
  discountCode?: string;
}): Promise<never> {
  const basketId = await findBasketId();
  if (!basketId) {
    throw new Error("Your basket is empty.");
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("basket_items")
    .select(
      `book_format_id, quantity, unit_price_amount,
       book_formats ( label, is_digital, inventory ( stock_status ), books ( title ) )`
    )
    .eq("basket_id", basketId);

  if (error || !data || data.length === 0) {
    throw new Error("Your basket is empty.");
  }

  const items = data as unknown as CheckoutBasketItem[];

  const unavailable = items.find((item) => {
    const inventory = item.book_formats
      ? Array.isArray(item.book_formats.inventory)
        ? item.book_formats.inventory[0]
        : item.book_formats.inventory
      : null;
    return inventory?.stock_status === "out_of_stock";
  });
  if (unavailable) {
    throw new Error(
      `"${unavailable.book_formats?.books?.title}" is no longer available and must be removed from your basket.`
    );
  }

  const subtotalPence = items.reduce(
    (sum, item) => sum + item.unit_price_amount * item.quantity,
    0
  );
  const hasPhysicalItem = items.some((item) => item.book_formats && !item.book_formats.is_digital);

  const user = await getCurrentUser();

  let couponId: string | undefined;
  let discountCode: string | undefined;
  if (options?.discountCode) {
    const result = await validateDiscountCodeAction(options.discountCode, subtotalPence / 100);
    if (result.valid && result.discountAmount) {
      const stripe = getStripeClient();
      const coupon = await stripe.coupons.create({
        amount_off: Math.round(result.discountAmount * 100),
        currency: "gbp",
        duration: "once",
        name: result.code,
      });
      couponId = coupon.id;
      discountCode = result.code;
    }
  }

  const stripe = getStripeClient();

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
    quantity: item.quantity,
    price_data: {
      currency: "gbp",
      unit_amount: item.unit_price_amount,
      product_data: {
        name: `${item.book_formats?.books?.title ?? "Book"} — ${item.book_formats?.label ?? ""}`,
      },
    },
  }));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    success_url: `${siteConfig.siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteConfig.siteUrl}/checkout/cancel`,
    customer_email: user?.email,
    shipping_address_collection: hasPhysicalItem
      ? { allowed_countries: [...ALLOWED_SHIPPING_COUNTRIES] }
      : undefined,
    discounts: couponId ? [{ coupon: couponId }] : undefined,
    metadata: {
      basket_id: basketId,
      user_id: user?.id ?? "",
      discount_code: discountCode ?? "",
    },
    payment_intent_data: {
      metadata: {
        basket_id: basketId,
        user_id: user?.id ?? "",
        discount_code: discountCode ?? "",
      },
    },
  });

  if (!session.url) {
    throw new Error("Could not start checkout. Please try again.");
  }

  redirect(session.url);
}
