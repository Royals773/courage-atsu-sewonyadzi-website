import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = {
  title: "Basket",
  description: "Review the items in your basket.",
};

export default function BasketPage() {
  return (
    <>
      <PageHeader eyebrow="Basket" title="Your basket" />
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <ShoppingBag
          className="mx-auto size-10 text-muted-foreground/50"
          aria-hidden="true"
        />
        <h2 className="mt-4 font-heading text-xl font-semibold">
          Basket functionality arrives in Phase 2
        </h2>
        <p className="mt-2 text-muted-foreground">
          Adding books, adjusting quantities, applying discount codes and
          checking out with Stripe will all be enabled once payments are
          built. For now, browse the catalogue below.
        </p>
        <Button className="mt-6" render={<Link href="/books" />}>
          Browse Books
        </Button>
      </div>
    </>
  );
}
