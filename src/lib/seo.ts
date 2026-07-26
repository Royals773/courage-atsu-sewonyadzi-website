import type { Metadata } from "next";

import { siteConfig } from "@/lib/content/site-config";

/**
 * Builds a page's Metadata with a canonical URL and matching OpenGraph/
 * Twitter fields, so social shares reflect the page's own content instead
 * of falling back to the sitewide defaults in the root layout.
 *
 * Next.js does NOT deep-merge nested metadata objects (openGraph/twitter)
 * across the layout chain — a page that returns its own `openGraph` object
 * replaces the root layout's entirely, it doesn't fill in missing fields
 * (verified empirically: pages using this helper were dropping the root's
 * og:site_name/og:locale/og:image). So every field that matters is set
 * explicitly here rather than relied on to inherit, including a default
 * image (the static public/brand/og-default.png) when the page has none of
 * its own.
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: "website" | "article";
}): Metadata {
  const url = `${siteConfig.siteUrl}${path}`;
  const ogImage = image ?? siteConfig.assets.ogDefault;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type,
      siteName: siteConfig.displayName,
      locale: "en_GB",
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
