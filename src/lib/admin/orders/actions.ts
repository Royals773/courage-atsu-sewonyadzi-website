"use server";

import { revalidatePath } from "next/cache";

import { requireAdminAction } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripeClient } from "@/lib/stripe/client";
import { sendOrderConfirmationEmail } from "@/lib/email/send-order-confirmation";
import type { OrderStatus } from "@/lib/supabase/database.types";

export async function updateOrderStatusAction(
  orderId: string,
  status: OrderStatus
): Promise<void> {
  await requireAdminAction("administrator");
  const admin = createAdminClient();
  const { error } = await admin.from("orders").update({ status }).eq("id", orderId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/orders");
}

export async function setOrderTrackingAction(
  orderId: string,
  trackingNumber: string,
  trackingUrl: string
): Promise<void> {
  await requireAdminAction("administrator");
  const admin = createAdminClient();
  const { error } = await admin
    .from("orders")
    .update({
      tracking_number: trackingNumber || null,
      tracking_url: trackingUrl || null,
      status: trackingNumber ? "shipped" : undefined,
    })
    .eq("id", orderId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/orders");
}

export async function refundOrderAction(orderId: string): Promise<void> {
  await requireAdminAction("administrator");
  const admin = createAdminClient();

  const { data: payment } = await admin
    .from("payments")
    .select("id, provider_payment_intent_id, amount")
    .eq("order_id", orderId)
    .eq("status", "succeeded")
    .maybeSingle();

  if (!payment?.provider_payment_intent_id) {
    throw new Error("No successful payment found for this order.");
  }

  const stripe = getStripeClient();
  await stripe.refunds.create({ payment_intent: payment.provider_payment_intent_id });

  await admin
    .from("payments")
    .update({ status: "refunded", refunded_amount: payment.amount })
    .eq("id", payment.id);
  await admin.from("orders").update({ status: "refunded" }).eq("id", orderId);

  revalidatePath("/admin/orders");
}

export async function resendOrderConfirmationAction(orderId: string): Promise<void> {
  await requireAdminAction("administrator");
  const admin = createAdminClient();

  const { data: order } = await admin
    .from("orders")
    .select("order_number, guest_email, user_id, total_amount, order_items(*)")
    .eq("id", orderId)
    .maybeSingle();

  if (!order) throw new Error("Order not found.");

  let email = order.guest_email;
  if (!email && order.user_id) {
    const { data: userResult } = await admin.auth.admin.getUserById(order.user_id);
    email = userResult.user?.email ?? null;
  }
  if (!email) throw new Error("No email address on file for this order.");

  await sendOrderConfirmationEmail({
    to: email,
    orderNumber: order.order_number,
    items: order.order_items.map((item) => ({
      title: item.book_title,
      format: item.format_label,
      quantity: item.quantity,
      lineTotal: item.line_total_amount / 100,
    })),
    totalAmount: order.total_amount / 100,
    downloadLinks: [],
  });
}
