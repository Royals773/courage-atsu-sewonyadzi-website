import Link from "next/link";

import { footerNav, siteConfig } from "@/lib/content/site-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SocialLinks } from "@/components/shared/social-links";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr_1fr_1fr_1.4fr]">
          <div>
            <p className="font-heading text-lg font-semibold">
              {siteConfig.brandName}
            </p>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              {siteConfig.shortBio}
            </p>
            <SocialLinks className="mt-5 flex flex-wrap gap-2" />
          </div>

          {footerNav.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-semibold">{group.title}</p>
              <ul className="mt-4 space-y-2.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-sm font-semibold">Stay in touch</p>
            <p className="mt-4 text-sm text-muted-foreground">
              Occasional insights on leadership, care quality and building
              across borders. No spam.
            </p>
            <form
              className="mt-4 flex flex-col gap-2"
              aria-describedby="footer-newsletter-note"
            >
              <Label htmlFor="footer-newsletter-email" className="sr-only">
                Email address
              </Label>
              <Input
                id="footer-newsletter-email"
                type="email"
                placeholder="you@example.com"
                disabled
              />
              <Button type="submit" disabled>
                Subscribe
              </Button>
              <p
                id="footer-newsletter-note"
                className="text-xs text-muted-foreground/80"
              >
                Newsletter sign-up goes live in Phase 3.
              </p>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.brandName}. All
            rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/legal/cookie-policy" className="hover:text-foreground">
              Cookie settings
            </Link>
            <span className="text-muted-foreground/60">
              {siteConfig.contactEmail}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
