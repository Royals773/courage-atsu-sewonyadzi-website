import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Download } from "lucide-react";

import { getCurrentUser } from "@/lib/auth/session";
import { getOrderByNumber } from "@/lib/orders/queries";
import { formatPrice } from "@/lib/format";
import { PageHeader } from "@/components/shared/page-header";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Order Details",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/account/sign-in");

  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);
  if (!order) notFound();

  return (
    <>
      <PageHeader eyebrow="Account" title={order.orderNumber} />
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <OrderStatusBadge status={order.status} />
          <Button variant="outline" size="sm" render={<Link href="/account/orders" />}>
            Back to orders
          </Button>
        </div>

        {order.trackingNumber ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Tracking number: <span className="font-medium text-foreground">{order.trackingNumber}</span>
            {order.trackingUrl ? (
              <>
                {" "}
                ·{" "}
                <a href={order.trackingUrl} className="underline" target="_blank" rel="noopener noreferrer">
                  Track shipment
                </a>
              </>
            ) : null}
          </p>
        ) : null}

        <Card className="mt-6">
          <CardContent>
            <ul className="divide-y divide-border">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                  <div>
                    <p className="font-medium">{item.bookTitle}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.formatLabel} × {item.quantity}
                    </p>
                    {item.isDigital && item.downloadUrl ? (
                      <Button
                        variant="link"
                        className="mt-1 h-auto p-0"
                        render={<a href={item.downloadUrl} />}
                      >
                        <Download className="size-3.5" aria-hidden="true" />
                        Download
                      </Button>
                    ) : item.isDigital ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Download link will appear here once your order finishes processing.
                      </p>
                    ) : null}
                  </div>
                  <p className="font-heading font-semibold">{formatPrice(item.lineTotal)}</p>
                </li>
              ))}
            </ul>

            <Separator className="my-4" />

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.subtotalAmount)}</span>
              </div>
              {order.discountAmount > 0 ? (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount</span>
                  <span>-{formatPrice(order.discountAmount)}</span>
                </div>
              ) : null}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{formatPrice(order.shippingAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatPrice(order.taxAmount)}</span>
              </div>
              <div className="flex justify-between pt-1.5 font-semibold">
                <span>Total</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
