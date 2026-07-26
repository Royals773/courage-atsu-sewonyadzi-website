import "server-only";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/format";
import type { OrderStatus } from "@/lib/supabase/database.types";
import { logger } from "@/lib/logger";

export interface OrderSummary {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  currency: string;
  placedAt: string;
  itemCount: number;
}

export interface OrderDetailItem {
  id: string;
  bookTitle: string;
  formatLabel: string;
  isDigital: boolean;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  downloadUrl: string | null;
}

export interface OrderDetail extends OrderSummary {
  subtotalAmount: number;
  discountAmount: number;
  shippingAmount: number;
  taxAmount: number;
  trackingNumber: string | null;
  trackingUrl: string | null;
  items: OrderDetailItem[];
}

/**
 * Relies on the `orders` RLS policy from Step 1 ("Users view their own
 * orders") via the regular session-scoped client — no admin client needed
 * for a signed-in user reading their own order history.
 */
export async function getOrdersForCurrentUser(): Promise<OrderSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("id, order_number, status, total_amount, currency, placed_at, order_items(id)")
    .order("placed_at", { ascending: false });

  if (error || !data) {
    logger.error("getOrdersForCurrentUser failed", { error });
    return [];
  }

  return data.map((order) => ({
    id: order.id,
    orderNumber: order.order_number,
    status: order.status,
    totalAmount: order.total_amount / 100,
    currency: order.currency,
    placedAt: order.placed_at,
    itemCount: order.order_items?.length ?? 0,
  }));
}

export async function getOrderByNumber(orderNumber: string): Promise<OrderDetail | null> {
  const supabase = await createClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `id, order_number, status, total_amount, subtotal_amount, discount_amount,
       shipping_amount, tax_amount, currency, placed_at, tracking_number, tracking_url,
       order_items ( id, book_title, format_label, is_digital, quantity, unit_price_amount, line_total_amount )`
    )
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (error || !order) return null;

  // Ownership of `order` is already guaranteed by RLS above. Digital
  // download tokens are service-role-only (see Step 1/3 RLS notes), so we
  // fetch just the token for this already-verified order's items.
  const admin = createAdminClient();
  const orderItemIds = order.order_items.map((item) => item.id);
  const { data: downloads } = orderItemIds.length
    ? await admin
        .from("digital_downloads")
        .select("order_item_id, download_token")
        .in("order_item_id", orderItemIds)
    : { data: [] };

  const downloadByOrderItem = new Map(
    (downloads ?? []).map((d) => [d.order_item_id, d.download_token])
  );

  return {
    id: order.id,
    orderNumber: order.order_number,
    status: order.status,
    totalAmount: order.total_amount / 100,
    subtotalAmount: order.subtotal_amount / 100,
    discountAmount: order.discount_amount / 100,
    shippingAmount: order.shipping_amount / 100,
    taxAmount: order.tax_amount / 100,
    currency: order.currency,
    placedAt: order.placed_at,
    trackingNumber: order.tracking_number,
    trackingUrl: order.tracking_url,
    itemCount: order.order_items.length,
    items: order.order_items.map((item) => {
      const token = downloadByOrderItem.get(item.id);
      return {
        id: item.id,
        bookTitle: item.book_title,
        formatLabel: item.format_label,
        isDigital: item.is_digital,
        quantity: item.quantity,
        unitPrice: item.unit_price_amount / 100,
        lineTotal: item.line_total_amount / 100,
        downloadUrl: token ? `/api/downloads/${token}` : null,
      };
    }),
  };
}

export function formatOrderTotal(order: OrderSummary) {
  return formatPrice(order.totalAmount, order.currency);
}
