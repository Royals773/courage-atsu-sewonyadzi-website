"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, ShoppingBag, User } from "lucide-react";

import { mainNav } from "@/lib/content/site-config";
import { Button } from "@/components/ui/button";
import { useBasket } from "@/components/basket/basket-provider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MobileNav({ isSignedIn, displayName }: { isSignedIn: boolean; displayName: string }) {
  const [open, setOpen] = useState(false);
  const { itemCount } = useBasket();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Open menu" />
        }
      >
        <Menu aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-xs">
        <SheetHeader>
          <SheetTitle className="text-balance">{displayName}</SheetTitle>
        </SheetHeader>
        <nav
          aria-label="Mobile"
          className="flex flex-col gap-1 px-4 pb-4"
        >
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 text-base font-medium text-foreground hover:bg-muted"
            >
              {item.label}
            </Link>
          ))}
          <div className="my-2 border-t border-border" />
          <Link
            href="/basket"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between gap-2 rounded-md px-3 py-2.5 text-base font-medium text-foreground hover:bg-muted"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="size-4" aria-hidden="true" />
              Basket
            </span>
            {itemCount > 0 ? (
              <span className="rounded-full bg-gold px-2 py-0.5 text-xs font-semibold text-gold-foreground">
                {itemCount}
              </span>
            ) : null}
          </Link>
          <Link
            href={isSignedIn ? "/account/orders" : "/account/sign-in"}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-md px-3 py-2.5 text-base font-medium text-foreground hover:bg-muted"
          >
            <User className="size-4" aria-hidden="true" />
            {isSignedIn ? "Your Account" : "Sign In"}
          </Link>
          <Button
            className="mt-3"
            render={
              <Link href="/speaking/enquiry" onClick={() => setOpen(false)} />
            }
          >
            Book Me to Speak
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
