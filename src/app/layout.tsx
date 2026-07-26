import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { siteConfig } from "@/lib/content/site-config";
import { getSettingGroup } from "@/lib/settings/queries";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import { BasketProvider } from "@/components/basket/basket-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "oklch(0.985 0.006 85)" },
    { media: "(prefers-color-scheme: dark)", color: "oklch(0.19 0.025 262)" },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const [seo, brand] = await Promise.all([
    getSettingGroup("seo"),
    getSettingGroup("brand"),
  ]);

  return {
    metadataBase: new URL(siteConfig.siteUrl),
    title: {
      default: seo.defaultTitle,
      template: `%s | ${brand.displayName}`,
    },
    description: seo.defaultDescription,
    icons: {
      icon: [
        { url: siteConfig.assets.favicon, type: "image/svg+xml" },
        { url: siteConfig.assets.icon, type: "image/svg+xml", sizes: "any" },
      ],
      apple: siteConfig.assets.appleTouchIcon,
    },
    openGraph: {
      title: seo.defaultTitle,
      description: seo.defaultDescription,
      url: siteConfig.siteUrl,
      siteName: brand.displayName,
      locale: "en_GB",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.defaultTitle,
      description: seo.defaultDescription,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [brand, social, contact] = await Promise.all([
    getSettingGroup("brand"),
    getSettingGroup("social"),
    getSettingGroup("contact"),
  ]);
  const colorOverrides = [
    brand.primaryColor ? `--primary: ${brand.primaryColor};` : "",
    brand.accentColor ? `--gold: ${brand.accentColor}; --ring: ${brand.accentColor};` : "",
    brand.secondaryColor ? `--burgundy: ${brand.secondaryColor};` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: brand.fullName,
    alternateName: brand.initials,
    jobTitle: brand.positioningStatement,
    url: siteConfig.siteUrl,
    description: brand.shortBio,
    email: contact.email || undefined,
    telephone: brand.phone || undefined,
    sameAs: [social.linkedin, social.instagram, social.youtube, social.x].filter(Boolean),
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {colorOverrides ? <style>{`:root { ${colorOverrides} }`}</style> : null}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <BasketProvider>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </BasketProvider>
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
