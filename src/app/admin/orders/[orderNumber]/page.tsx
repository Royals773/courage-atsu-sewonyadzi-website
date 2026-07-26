import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/admin/auth";
import { getAdminOrderByNumber } from "@/lib/admin/orders/queries";
import { formatPrice } from "@/lib/format";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { OrderActions } from "@/components/admin/orders/order-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = { title: "Order Detail" };

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  await requireAdmin("administrator");
  const { orderNumber } = await params;
  const order = await getAdminOrderByNumber(orderNumber);
  if (!order) notFound();

  const hasSuccessfulPayment = order.payments.some((p) => p.status === "succeeded");
  const address = order.shipping_addresses;

  return (
    <>
      <AdminPageHeader title={order.order_number} description={order.guest_email ?? order.user_id ?? undefined} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardContent>
            <ul className="divide-y divide-border">
              {order.order_items.map((item) => (
                <li key={item.id} className="flex justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="font-medium">{item.book_title}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.format_label} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-heading font-semibold">
                    {formatPrice(item.line_total_amount / 100, order.currency)}
                  </p>
                </li>
              ))}
            </ul>

            <Separator className="my-4" />

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.subtotal_amount / 100, order.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Discount</span>
                <span>-{formatPrice(order.discount_amount / 100, order.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{formatPrice(order.shipping_amount / 100, order.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatPrice(order.tax_amount / 100, order.currency)}</span>
              </div>
              <div className="flex justify-between pt-1.5 font-semibold">
                <span>Total</span>
                <span>{formatPrice(order.total_amount / 100, order.currency)}</span>
              </div>
            </div>

            {address ? (
              <>
                <Separator className="my-4" />
                <div>
                  <p className="text-sm font-semibold">Shipping address</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {address.full_name}
                    <br />
                    {address.address_line1}
                    {address.address_line2 ? <>, {address.address_line2}</> : null}
                    <br />
                    {address.city}, {address.postal_code}
                    <br />
                    {address.country}
                  </p>
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>

        <OrderActions
          orderId={order.id}
          status={order.status}
          trackingNumber={order.tracking_number}
          trackingUrl={order.tracking_url}
          canRefund={hasSuccessfulPayment}
        />
      </div>
    </>
  );
}
