import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { OrderStatus } from "@/lib/supabase/database.types";

export interface DashboardStats {
  totalBookSales: number;
  revenue: number;
  orderCount: number;
  customerCount: number;
  newsletterSubscriberCount: number;
  publishedPostCount: number;
  bookCount: number;
  pendingOrders: number;
  unapprovedTestimonials: number;
  lowOrOutOfStockFormats: number;
  speakingEnquiryCount: number;
  newSpeakingEnquiries: number;
}

const REVENUE_STATUSES: OrderStatus[] = ["paid", "processing", "shipped", "delivered", "completed"];

export async function getDashboardStats(): Promise<DashboardStats> {
  const admin = createAdminClient();

  const [
    orderItemsResult,
    revenueOrdersResult,
    orderCountResult,
    usersResult,
    subscriberCountResult,
    publishedPostCountResult,
    bookCountResult,
    pendingOrdersResult,
    unapprovedTestimonialsResult,
    inventoryResult,
    speakingEnquiryCountResult,
    newSpeakingEnquiriesResult,
  ] = await Promise.allSettled([
    admin.from("order_items").select("quantity"),
    admin.from("orders").select("total_amount").in("status", REVENUE_STATUSES),
    admin.from("orders").select("id", { count: "exact", head: true }),
    admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    admin
      .from("newsletter_subscribers")
      .select("id", { count: "exact", head: true })
      .is("unsubscribed_at", null),
    admin
      .from("blog_posts")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    admin
      .from("books")
      .select("id", { count: "exact", head: true })
      .is("deleted_at", null),
    admin
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    admin
      .from("testimonials")
      .select("id", { count: "exact", head: true })
      .eq("is_approved", false),
    admin.from("inventory").select("stock_status").in("stock_status", ["low_stock", "out_of_stock"]),
    admin.from("speaking_enquiries").select("id", { count: "exact", head: true }),
    admin
      .from("speaking_enquiries")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
  ]);

  const totalBookSales =
    orderItemsResult.status === "fulfilled"
      ? (orderItemsResult.value.data ?? []).reduce((sum, row) => sum + row.quantity, 0)
      : 0;

  const revenue =
    revenueOrdersResult.status === "fulfilled"
      ? (revenueOrdersResult.value.data ?? []).reduce((sum, row) => sum + row.total_amount, 0) / 100
      : 0;

  const orderCount = orderCountResult.status === "fulfilled" ? (orderCountResult.value.count ?? 0) : 0;

  const customerCount =
    usersResult.status === "fulfilled" ? (usersResult.value.data?.users.length ?? 0) : 0;

  const newsletterSubscriberCount =
    subscriberCountResult.status === "fulfilled" ? (subscriberCountResult.value.count ?? 0) : 0;

  const publishedPostCount =
    publishedPostCountResult.status === "fulfilled" ? (publishedPostCountResult.value.count ?? 0) : 0;

  const bookCount = bookCountResult.status === "fulfilled" ? (bookCountResult.value.count ?? 0) : 0;

  const pendingOrders =
    pendingOrdersResult.status === "fulfilled" ? (pendingOrdersResult.value.count ?? 0) : 0;

  const unapprovedTestimonials =
    unapprovedTestimonialsResult.status === "fulfilled"
      ? (unapprovedTestimonialsResult.value.count ?? 0)
      : 0;

  const lowOrOutOfStockFormats =
    inventoryResult.status === "fulfilled" ? (inventoryResult.value.data ?? []).length : 0;

  const speakingEnquiryCount =
    speakingEnquiryCountResult.status === "fulfilled" ? (speakingEnquiryCountResult.value.count ?? 0) : 0;

  const newSpeakingEnquiries =
    newSpeakingEnquiriesResult.status === "fulfilled" ? (newSpeakingEnquiriesResult.value.count ?? 0) : 0;

  return {
    totalBookSales,
    revenue,
    orderCount,
    customerCount,
    newsletterSubscriberCount,
    publishedPostCount,
    bookCount,
    pendingOrders,
    unapprovedTestimonials,
    lowOrOutOfStockFormats,
    speakingEnquiryCount,
    newSpeakingEnquiries,
  };
}
