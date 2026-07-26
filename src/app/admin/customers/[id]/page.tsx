import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/admin/auth";
import { getAdminCustomerDetail } from "@/lib/admin/customers/queries";
import { formatPrice } from "@/lib/format";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { CustomerActions } from "@/components/admin/customers/customer-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Customer Detail" };

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin("administrator");
  const { id } = await params;
  const detail = await getAdminCustomerDetail(id);
  if (!detail) notFound();

  const isBanned = Boolean(
    detail.user.banned_until && new Date(detail.user.banned_until) > new Date()
  );

  return (
    <>
      <AdminPageHeader
        title={detail.user.email ?? "Customer"}
        description={`Joined ${formatDate(detail.user.created_at)}`}
        action={<CustomerActions userId={detail.user.id} email={detail.user.email ?? ""} isBanned={isBanned} />}
      />

      <div>
        <h2 className="font-heading text-lg font-semibold">Order history</h2>
        {detail.orders.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">No orders yet.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {detail.orders.map((order) => (
              <Link key={order.id} href={`/admin/orders/${order.order_number}`}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="flex items-center justify-between gap-3">
                    <span className="font-medium">{order.order_number}</span>
                    <OrderStatusBadge status={order.status} />
                    <span className="text-sm text-muted-foreground">{formatDate(order.placed_at)}</span>
                    <span className="font-heading font-semibold">
                      {formatPrice(order.total_amount / 100, order.currency)}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="font-heading text-lg font-semibold">Digital downloads</h2>
        {detail.downloads.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">No digital purchases yet.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {detail.downloads.map((download) => (
              <Card key={download.id}>
                <CardContent className="flex items-center justify-between gap-3">
                  <span className="text-sm">{download.order_items?.book_title}</span>
                  <span className="text-xs text-muted-foreground">
                    {download.download_count}/{download.max_downloads} downloads used
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    render={<a href={`/api/downloads/${download.download_token}`} />}
                  >
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
