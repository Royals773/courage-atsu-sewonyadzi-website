import Link from "next/link";

import { footerNav } from "@/lib/content/site-config";
import { getSettingGroup } from "@/lib/settings/queries";
import { SocialLinks } from "@/components/shared/social-links";
import { FooterNewsletterForm } from "@/components/layout/footer-newsletter-form";

export async function Footer() {
  const [general, contact, social] = await Promise.all([
    getSettingGroup("general"),
    getSettingGroup("contact"),
    getSettingGroup("social"),
  ]);

  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr_1fr_1fr_1.4fr]">
          <div>
            <p className="font-heading text-lg font-semibold">{general.brandName}</p>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">{general.shortBio}</p>
            <SocialLinks className="mt-5 flex flex-wrap gap-2" social={social} />
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
            <FooterNewsletterForm />
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {general.brandName}. All
            rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/legal/cookie-policy" className="hover:text-foreground">
              Cookie settings
            </Link>
            <span className="text-muted-foreground/60">{contact.email}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
