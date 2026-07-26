import type { Metadata } from "next";
import Link from "next/link";
import { XCircle } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Checkout Cancelled",
  robots: { index: false },
};

export default function CheckoutCancelPage() {
  return (
    <>
      <PageHeader eyebrow="Checkout" title="Checkout cancelled" />
      <div className="mx-auto max-w-md px-4 py-16 text-center sm:px-6 lg:px-8">
        <XCircle className="mx-auto size-10 text-muted-foreground/50" aria-hidden="true" />
        <h2 className="mt-4 font-heading text-xl font-semibold">
          No payment was taken
        </h2>
        <p className="mt-2 text-muted-foreground">
          Your basket is still saved — you can pick up where you left off.
        </p>
        <Button className="mt-6" render={<Link href="/basket" />}>
          Return to basket
        </Button>
      </div>
    </>
  );
}
