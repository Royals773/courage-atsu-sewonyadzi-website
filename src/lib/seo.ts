import type { Metadata } from "next";

import { siteConfig } from "@/lib/content/site-config";

/**
 * Builds a page's Metadata with a canonical URL and matching OpenGraph/
 * Twitter fields, so social shares reflect the page's own content instead
 * of falling back to the sitewide defaults in the root layout. Unspecified
 * OpenGraph/Twitter fields (siteName, locale, card type) are inherited from
 * the root layout's metadata per Next.js's metadata merging.
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

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}
