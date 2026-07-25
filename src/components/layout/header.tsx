import Link from "next/link";
import { Search, ShoppingBag, User } from "lucide-react";

import { mainNav, siteConfig } from "@/lib/content/site-config";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/layout/mobile-nav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-heading text-lg font-semibold tracking-tight"
        >
          {siteConfig.brandName}
        </Link>

        <nav aria-label="Primary" className="hidden lg:flex lg:items-center lg:gap-1">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex"
            render={<Link href="/insights" aria-label="Search insights" />}
          >
            <Search aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex"
            render={<Link href="/basket" aria-label="View basket" />}
          >
            <ShoppingBag aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex opacity-50"
            aria-disabled="true"
            title="Account access is coming soon"
          >
            <User aria-hidden="true" />
            <span className="sr-only">Account (coming soon)</span>
          </Button>
          <Button
            className="hidden md:inline-flex"
            render={<Link href="/speaking/enquiry" />}
          >
            Book Me to Speak
          </Button>
          <div className="lg:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
