import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/content/site-config";
import { legalPages } from "@/lib/content/legal";
import { getPublishedBooks } from "@/lib/books/queries";
import { getPublishedPosts } from "@/lib/blog/queries";
import { getPublishedSpeakingTopics } from "@/lib/speaking/topics";

const STATIC_ROUTES = [
  "",
  "/about",
  "/books",
  "/speaking",
  "/speaking/enquiry",
  "/insights",
  "/media",
  "/media-kit",
  "/videos",
  "/testimonials",
  "/faq",
  "/contact",
  "/courses",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [books, posts, topics] = await Promise.all([
    getPublishedBooks(),
    getPublishedPosts(),
    getPublishedSpeakingTopics(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${siteConfig.siteUrl}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const legalEntries: MetadataRoute.Sitemap = legalPages.map((page) => ({
    url: `${siteConfig.siteUrl}/legal/${page.slug}`,
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  const bookEntries: MetadataRoute.Sitemap = books.map((book) => ({
    url: `${siteConfig.siteUrl}/books/${book.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.siteUrl}/insights/${post.slug}`,
    lastModified: post.publishedAt || undefined,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const topicEntries: MetadataRoute.Sitemap = topics.map((topic) => ({
    url: `${siteConfig.siteUrl}/speaking/topics/${topic.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...bookEntries, ...postEntries, ...topicEntries, ...legalEntries];
}
