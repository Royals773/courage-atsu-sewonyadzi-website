import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { createAdminClient } from "@/lib/supabase/admin";
import { getStripeClient } from "@/lib/stripe/client";
import { sendOrderConfirmationEmail } from "@/lib/email/send-order-confirmation";
import type { Json } from "@/lib/supabase/database.types";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

interface CheckoutLineItem {
  id: string;
  book_format_id: string;
  quantity: number;
  unit_price_amount: number;
  book_formats: {
    label: string;
    is_digital: boolean;
    digital_file_storage_path: string | null;
    books: { title: string } | null;
  } | null;
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const admin = createAdminClient();

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : (session.payment_intent?.id ?? null);

  // Idempotency: Stripe may retry webhook delivery.
  if (paymentIntentId) {
    const { data: existingPayment } = await admin
      .from("payments")
      .select("id")
      .eq("provider_payment_intent_id", paymentIntentId)
      .maybeSingle();
    if (existingPayment) {
      logger.info("Skipping already-processed checkout session", { sessionId: session.id });
      return;
    }
  }

  const basketId = session.metadata?.basket_id;
  if (!basketId) {
    logger.error("checkout.session.completed missing basket_id metadata", { sessionId: session.id });
    return;
  }

  const { data, error } = await admin
    .from("basket_items")
    .select(
      `id, book_format_id, quantity, unit_price_amount,
       book_formats ( label, is_digital, digital_file_storage_path, books ( title ) )`
    )
    .eq("basket_id", basketId);

  if (error || !data || data.length === 0) {
    logger.error("No basket items found for basket", { basketId, error });
    return;
  }

  const lineItems = data as unknown as CheckoutLineItem[];

  const userId = session.metadata?.user_id || null;
  const guestEmail = session.customer_details?.email ?? session.customer_email ?? null;

  if (!userId && !guestEmail) {
    logger.error("Checkout session has neither user_id nor an email", { sessionId: session.id });
    return;
  }

  const subtotalAmount = lineItems.reduce(
    (sum, item) => sum + item.unit_price_amount * item.quantity,
    0
  );
  const totalAmount = session.amount_total ?? subtotalAmount;
  const discountAmount = session.total_details?.amount_discount ?? 0;
  const shippingAmount = session.total_details?.amount_shipping ?? 0;
  const taxAmount = session.total_details?.amount_tax ?? 0;
  const currency = (session.currency ?? "gbp").toUpperCase();

  // Discount code lookup (for orders.discount_code_id + redemption count).
  let discountCodeId: string | null = null;
  const discountCode = session.metadata?.discount_code || null;
  if (discountCode) {
    const { data: code } = await admin
      .from("discount_codes")
      .select("id, times_redeemed")
      .eq("code", discountCode)
      .maybeSingle();
    if (code) {
      discountCodeId = code.id;
      await admin
        .from("discount_codes")
        .update({ times_redeemed: code.times_redeemed + 1 })
        .eq("id", code.id);
    }
  }

  // Shipping address, if collected.
  let shippingAddressId: string | null = null;
  const shippingDetails = session.collected_information?.shipping_details;
  if (shippingDetails) {
    const { data: address } = await admin
      .from("shipping_addresses")
      .insert({
        user_id: userId,
        full_name: shippingDetails.name,
        address_line1: shippingDetails.address.line1 ?? "",
        address_line2: shippingDetails.address.line2 ?? null,
        city: shippingDetails.address.city ?? "",
        region: shippingDetails.address.state ?? null,
        postal_code: shippingDetails.address.postal_code ?? "",
        country: shippingDetails.address.country ?? "",
      })
      .select("id")
      .single();
    shippingAddressId = address?.id ?? null;
  }

  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      user_id: userId,
      guest_email: userId ? null : guestEmail,
      status: "paid",
      subtotal_amount: subtotalAmount,
      discount_amount: discountAmount,
      shipping_amount: shippingAmount,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      currency,
      discount_code_id: discountCodeId,
      shipping_address_id: shippingAddressId,
      billing_address_id: shippingAddressId,
    })
    .select("id, order_number")
    .single();

  if (orderError || !order) {
    logger.error("Failed to create order", { error: orderError });
    throw new Error("Failed to create order");
  }

  const orderItemRows = lineItems.map((item) => ({
    order_id: order.id,
    book_format_id: item.book_format_id,
    book_title: item.book_formats?.books?.title ?? "Unknown title",
    format_label: item.book_formats?.label ?? "Unknown format",
    is_digital: item.book_formats?.is_digital ?? false,
    unit_price_amount: item.unit_price_amount,
    quantity: item.quantity,
    line_total_amount: item.unit_price_amount * item.quantity,
  }));

  const { data: insertedItems, error: itemsError } = await admin
    .from("order_items")
    .insert(orderItemRows)
    .select("id, book_format_id, is_digital, quantity");

  if (itemsError || !insertedItems) {
    logger.error("Failed to create order items", { error: itemsError });
    throw new Error("Failed to create order items");
  }

  await admin.from("payments").insert({
    order_id: order.id,
    provider: "stripe",
    provider_payment_intent_id: paymentIntentId,
    status: "succeeded",
    amount: totalAmount,
    currency,
    raw_response: session as unknown as Json,
  });

  // Inventory + digital downloads, per order item.
  const downloadLinks: { title: string; url: string }[] = [];
  for (const inserted of insertedItems) {
    const source = lineItems.find((li) => li.book_format_id === inserted.book_format_id);
    if (!source) continue;

    if (inserted.is_digital) {
      const storagePath = source.book_formats?.digital_file_storage_path;
      if (storagePath) {
        const { data: download } = await admin
          .from("digital_downloads")
          .insert({
            order_item_id: inserted.id,
            book_format_id: source.book_format_id,
            storage_path: storagePath,
          })
          .select("download_token")
          .single();
        if (download) {
          downloadLinks.push({
            title: source.book_formats?.books?.title ?? "Your ebook",
            url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/downloads/${download.download_token}`,
          });
        }
      }
    } else {
      await admin.rpc("decrement_inventory", {
        p_book_format_id: source.book_format_id,
        p_quantity: inserted.quantity,
      });
    }
  }

  await admin.from("baskets").update({ status: "converted" }).eq("id", basketId);

  const recipientEmail = guestEmail ?? session.customer_details?.email;
  if (recipientEmail) {
    await sendOrderConfirmationEmail({
      to: recipientEmail,
      orderNumber: order.order_number,
      items: orderItemRows.map((item) => ({
        title: item.book_title,
        format: item.format_label,
        quantity: item.quantity,
        lineTotal: item.line_total_amount / 100,
      })),
      totalAmount: totalAmount / 100,
      downloadLinks,
    });
  }
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    logger.error("STRIPE_WEBHOOK_SECRET is not set.");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const payload = await request.text();

  let event: Stripe.Event;
  try {
    const stripe = getStripeClient();
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    logger.error("Stripe webhook signature verification failed", { error: err });
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
    }
  } catch (err) {
    logger.error(`Failed to process Stripe event ${event.type}`, { error: err });
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
