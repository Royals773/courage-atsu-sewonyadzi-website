import Link from "next/link";
import Image from "next/image";
import { Search, User } from "lucide-react";

import { mainNav, siteConfig } from "@/lib/content/site-config";
import { getSettingGroup } from "@/lib/settings/queries";
import { getCurrentUser } from "@/lib/auth/session";
import { getLogoUrl } from "@/lib/settings/logo";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { BasketButton } from "@/components/basket/basket-button";

export async function Header() {
  const [user, brand] = await Promise.all([getCurrentUser(), getSettingGroup("brand")]);
  const logoUrl = (brand.logoPath ? await getLogoUrl(brand.logoPath) : null) ?? siteConfig.assets.logoHorizontal;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center font-heading text-lg font-semibold tracking-tight"
        >
          <Image src={logoUrl} alt={brand.displayName} width={220} height={40} className="h-8 w-auto sm:h-9" priority />
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
          <BasketButton className="hidden sm:inline-flex" />
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex"
            render={<Link href={user ? "/account/orders" : "/account/sign-in"} aria-label="Account" />}
          >
            <User aria-hidden="true" />
          </Button>
          <Button
            className="hidden md:inline-flex"
            render={<Link href="/speaking/enquiry" />}
          >
            Book Me to Speak
          </Button>
          <div className="lg:hidden">
            <MobileNav isSignedIn={Boolean(user)} displayName={brand.displayName} />
          </div>
        </div>
      </div>
    </header>
  );
}
