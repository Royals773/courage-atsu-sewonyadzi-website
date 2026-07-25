"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, ShoppingBag, User } from "lucide-react";

import { mainNav, siteConfig } from "@/lib/content/site-config";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MobileNav() {
  const [open, setOpen] = useState(false);

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
          <SheetTitle>{siteConfig.brandName}</SheetTitle>
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
            className="flex items-center gap-2 rounded-md px-3 py-2.5 text-base font-medium text-foreground hover:bg-muted"
          >
            <ShoppingBag className="size-4" aria-hidden="true" />
            Basket
          </Link>
          <span
            aria-disabled="true"
            title="Account access is coming soon"
            className="flex items-center gap-2 rounded-md px-3 py-2.5 text-base font-medium text-muted-foreground/60"
          >
            <User className="size-4" aria-hidden="true" />
            Account (coming soon)
          </span>
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
