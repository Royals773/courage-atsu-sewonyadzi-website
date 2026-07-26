import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

export interface AdminCustomer {
  id: string;
  email: string;
  createdAt: string;
  lastSignInAt: string | null;
  isBanned: boolean;
  orderCount: number;
}

export async function getAdminCustomers(): Promise<AdminCustomer[]> {
  const admin = createAdminClient();
  const { data: usersResult, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error || !usersResult) {
    logger.error("getAdminCustomers failed", { error });
    return [];
  }

  const { data: orderCounts } = await admin.from("orders").select("user_id");
  const countByUser = new Map<string, number>();
  for (const row of orderCounts ?? []) {
    if (!row.user_id) continue;
    countByUser.set(row.user_id, (countByUser.get(row.user_id) ?? 0) + 1);
  }

  return usersResult.users.map((user) => ({
    id: user.id,
    email: user.email ?? "—",
    createdAt: user.created_at,
    lastSignInAt: user.last_sign_in_at ?? null,
    isBanned: Boolean(user.banned_until && new Date(user.banned_until) > new Date()),
    orderCount: countByUser.get(user.id) ?? 0,
  }));
}

export async function getAdminCustomerDetail(userId: string) {
  const admin = createAdminClient();
  const { data: userResult, error } = await admin.auth.admin.getUserById(userId);
  if (error || !userResult.user) return null;

  const { data: orders } = await admin
    .from("orders")
    .select("id, order_number, status, total_amount, currency, placed_at")
    .eq("user_id", userId)
    .order("placed_at", { ascending: false });

  const { data: downloads } = await admin
    .from("digital_downloads")
    .select("id, download_token, expires_at, download_count, max_downloads, order_items(book_title, order_id)")
    .in("order_item_id", (orders ?? []).length > 0 ? await getOrderItemIds(orders!.map((o) => o.id)) : []);

  return {
    user: userResult.user,
    orders: orders ?? [],
    downloads: downloads ?? [],
  };
}

async function getOrderItemIds(orderIds: string[]): Promise<string[]> {
  if (orderIds.length === 0) return [];
  const admin = createAdminClient();
  const { data } = await admin.from("order_items").select("id").in("order_id", orderIds);
  return (data ?? []).map((row) => row.id);
}
