import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";

import { createAdminClient } from "@/lib/supabase/admin";
import { getStripeClient } from "@/lib/stripe/client";
import { formatPrice } from "@/lib/format";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { logger } from "@/lib/logger";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false },
};

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function findOrderForSession(sessionId: string) {
  let paymentIntentId: string | null = null;
  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : (session.payment_intent?.id ?? null);
  } catch (error) {
    logger.error("Could not retrieve Stripe session", { error });
    return null;
  }

  if (!paymentIntentId) return null;

  const admin = createAdminClient();

  // The webhook may not have finished processing yet — retry briefly.
  for (let attempt = 0; attempt < 4; attempt++) {
    const { data: payment } = await admin
      .from("payments")
      .select("order_id")
      .eq("provider_payment_intent_id", paymentIntentId)
      .maybeSingle();

    if (payment) {
      const { data: order } = await admin
        .from("orders")
        .select(
          "order_number, total_amount, currency, order_items(id, book_title, format_label, quantity)"
        )
        .eq("id", payment.order_id)
        .maybeSingle();
      if (order) return order;
    }

    if (attempt < 3) await sleep(1000);
  }

  return null;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const order = sessionId ? await findOrderForSession(sessionId) : null;

  return (
    <>
      <PageHeader eyebrow="Checkout" title="Order confirmed" />
      <div className="mx-auto max-w-2xl px-4 py-14 text-center sm:px-6 lg:px-8">
        {order ? (
          <>
            <CheckCircle2 className="mx-auto size-10 text-primary" aria-hidden="true" />
            <h2 className="mt-4 font-heading text-xl font-semibold">
              Thank you — order {order.order_number} is confirmed
            </h2>
            <p className="mt-2 text-muted-foreground">
              A confirmation email is on its way to you.
            </p>
            <Card className="mt-8 text-left">
              <CardContent>
                <ul className="divide-y divide-border">
                  {order.order_items.map((item) => (
                    <li key={item.id} className="flex justify-between py-3 first:pt-0 last:pb-0">
                      <span>
                        {item.book_title} — {item.format_label} × {item.quantity}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex justify-between border-t border-border pt-3 font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(order.total_amount / 100, order.currency)}</span>
                </div>
              </CardContent>
            </Card>
            <Button className="mt-8" render={<Link href="/account/orders" />}>
              View your orders
            </Button>
          </>
        ) : (
          <>
            <Loader2 className="mx-auto size-10 animate-spin text-muted-foreground" aria-hidden="true" />
            <h2 className="mt-4 font-heading text-xl font-semibold">
              Finishing up your order
            </h2>
            <p className="mt-2 text-muted-foreground">
              Payment was received and your order is still being processed — this page
              will update shortly, and we&apos;ll also email your confirmation.
            </p>
            <Button variant="outline" className="mt-8" render={<Link href="/books" />}>
              Continue shopping
            </Button>
          </>
        )}
      </div>
    </>
  );
}
