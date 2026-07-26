"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { useBasket } from "@/components/basket/basket-provider";
import { Button } from "@/components/ui/button";

export function BasketButton({ className }: { className?: string }) {
  const { itemCount } = useBasket();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      render={<Link href="/basket" aria-label={`View basket (${itemCount} items)`} />}
    >
      <span className="relative inline-flex">
        <ShoppingBag aria-hidden="true" />
        {itemCount > 0 ? (
          <span className="absolute -top-2 -right-2 flex size-4 items-center justify-center rounded-full bg-gold text-[10px] font-semibold text-gold-foreground">
            {itemCount > 9 ? "9+" : itemCount}
          </span>
        ) : null}
      </span>
    </Button>
  );
}
