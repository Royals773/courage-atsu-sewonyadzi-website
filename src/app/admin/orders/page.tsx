import type { Metadata } from "next";
import Link from "next/link";

import { requireAdmin } from "@/lib/admin/auth";
import { getAdminOrders } from "@/lib/admin/orders/queries";
import { formatPrice } from "@/lib/format";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { OrderStatus } from "@/lib/supabase/database.types";

export const metadata: Metadata = { title: "Orders" };

const STATUSES: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "completed",
  "cancelled",
  "refunded",
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  await requireAdmin("administrator");
  const { status, q } = await searchParams;
  const orders = await getAdminOrders({
    status: status as OrderStatus | undefined,
    search: q,
  });

  return (
    <>
      <AdminPageHeader title="Orders" description="View, filter and manage orders." />

      <form className="mb-4 flex flex-wrap gap-2" method="get">
        <Input name="q" placeholder="Search order number" defaultValue={q} className="max-w-xs" />
        <Button type="submit" variant="outline">
          Search
        </Button>
      </form>

      <div className="mb-4 flex flex-wrap gap-2">
        <Button variant={!status ? "default" : "secondary"} size="sm" render={<Link href="/admin/orders" />}>
          All
        </Button>
        {STATUSES.map((s) => (
          <Button
            key={s}
            variant={status === s ? "default" : "secondary"}
            size="sm"
            render={<Link href={`/admin/orders?status=${s}`} />}
          >
            {s}
          </Button>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="text-sm text-muted-foreground">No orders found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.orderNumber}</TableCell>
                <TableCell className="max-w-40 truncate">{order.customerLabel}</TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell>{formatPrice(order.totalAmount, order.currency)}</TableCell>
                <TableCell>{formatDate(order.placedAt)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    render={<Link href={`/admin/orders/${order.orderNumber}`} />}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
