import type { Metadata } from "next";

import { isStripeConfigured } from "@/lib/env";
import { PageHeader } from "@/components/shared/page-header";
import { BasketView } from "@/components/basket/basket-view";

export const metadata: Metadata = {
  title: "Basket",
  description: "Review the items in your basket.",
};

export default function BasketPage() {
  return (
    <>
      <PageHeader eyebrow="Basket" title="Your basket" />
      <BasketView stripeConfigured={isStripeConfigured()} />
    </>
  );
}
