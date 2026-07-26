import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { OrderStatus } from "@/lib/supabase/database.types";
import { logger } from "@/lib/logger";

export interface AdminOrderListItem {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  currency: string;
  placedAt: string;
  customerLabel: string;
}

export async function getAdminOrders(filters: {
  status?: OrderStatus;
  search?: string;
}): Promise<AdminOrderListItem[]> {
  const admin = createAdminClient();
  let query = admin
    .from("orders")
    .select("id, order_number, status, total_amount, currency, placed_at, guest_email, user_id")
    .order("placed_at", { ascending: false })
    .limit(200);

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.search) query = query.ilike("order_number", `%${filters.search}%`);

  const { data, error } = await query;
  if (error || !data) {
    logger.error("getAdminOrders failed", { error });
    return [];
  }

  return data.map((order) => ({
    id: order.id,
    orderNumber: order.order_number,
    status: order.status,
    totalAmount: order.total_amount / 100,
    currency: order.currency,
    placedAt: order.placed_at,
    customerLabel: order.guest_email ?? order.user_id ?? "—",
  }));
}

export async function getAdminOrderByNumber(orderNumber: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("orders")
    .select(
      `*, order_items(*), payments(*), shipping_addresses!orders_shipping_address_id_fkey(*)`
    )
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}
