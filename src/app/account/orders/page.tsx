import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PackageSearch } from "lucide-react";

import { getCurrentUser } from "@/lib/auth/session";
import { getOrdersForCurrentUser, formatOrderTotal } from "@/lib/orders/queries";
import { PageHeader } from "@/components/shared/page-header";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Your Orders",
  description: "View your order history.",
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/account/sign-in");

  const orders = await getOrdersForCurrentUser();

  return (
    <>
      <PageHeader eyebrow="Account" title="Your orders" />
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Signed in as {user.email}</p>
          <SignOutButton />
        </div>

        {orders.length === 0 ? (
          <div className="mt-10 text-center">
            <PackageSearch className="mx-auto size-10 text-muted-foreground/50" aria-hidden="true" />
            <h2 className="mt-4 font-heading text-xl font-semibold">No orders yet</h2>
            <p className="mt-2 text-muted-foreground">
              When you buy a book, it will show up here.
            </p>
            <Button className="mt-6" render={<Link href="/books" />}>
              Browse Books
            </Button>
          </div>
        ) : (
          <ul className="mt-8 space-y-4">
            {orders.map((order) => (
              <li key={order.id}>
                <Link href={`/account/orders/${order.orderNumber}`}>
                  <Card className="transition-shadow hover:shadow-md">
                    <CardContent className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-heading font-semibold">{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(order.placedAt)} · {order.itemCount}{" "}
                          {order.itemCount === 1 ? "item" : "items"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <OrderStatusBadge status={order.status} />
                        <span className="font-heading font-semibold">
                          {formatOrderTotal(order)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
