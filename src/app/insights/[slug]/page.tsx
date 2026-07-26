import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getPostBySlug, getPublishedPosts } from "@/lib/blog/queries";
import { renderMarkdown } from "@/lib/markdown";
import { siteConfig } from "@/lib/content/site-config";
import { getSettingGroup } from "@/lib/settings/queries";
import { buildMetadata } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";
import { CmsImage } from "@/components/shared/cms-image";
import { ShareLinks } from "@/components/shared/share-links";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function formatDate(dateString: string) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    path: `/insights/${post.slug}`,
    image: post.featuredImageUrl,
    type: "article",
  });
}

export default async function InsightPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [allPosts, general] = await Promise.all([getPublishedPosts(), getSettingGroup("general")]);
  const index = allPosts.findIndex((p) => p.id === post.id);
  const previousPost = allPosts[index - 1];
  const nextPost = allPosts[index + 1];
  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 2);
  const shareUrl = `${siteConfig.siteUrl}/insights/${post.slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImageUrl ?? undefined,
    datePublished: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author,
    },
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Badge variant="secondary">{post.category}</Badge>
      <h1 className="mt-4 text-balance font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
        {post.title}
      </h1>
      <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
        <Avatar size="sm">
          <AvatarFallback>{post.author.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <span>{post.author}</span>
        <span aria-hidden="true">·</span>
        <span>{formatDate(post.publishedAt)}</span>
        <span aria-hidden="true">·</span>
        <span>{post.readingTimeMinutes} min read</span>
      </div>

      <div className="mt-8">
        <CmsImage src={post.featuredImageUrl} alt={`Cover image — ${post.title}`} aspect="wide" priority />
      </div>

      <div
        className="prose-content mt-8 max-w-none text-pretty text-base leading-relaxed text-foreground/90"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
      />

      <ShareLinks url={shareUrl} title={post.title} className="mt-10 flex flex-wrap gap-2" />

      <div className="mt-12 flex items-start gap-4 rounded-lg border border-border p-5">
        <Avatar size="lg">
          <AvatarFallback>{post.author.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-heading font-semibold">{post.author}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {general.shortBio}
          </p>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-border pt-6 text-sm">
        {previousPost ? (
          <Link
            href={`/insights/${previousPost.slug}`}
            className="font-medium hover:underline"
          >
            ← {previousPost.title}
          </Link>
        ) : (
          <span />
        )}
        {nextPost ? (
          <Link
            href={`/insights/${nextPost.slug}`}
            className="text-right font-medium hover:underline"
          >
            {nextPost.title} →
          </Link>
        ) : (
          <span />
        )}
      </div>

      {relatedPosts.length > 0 ? (
        <div className="mt-12">
          <h2 className="font-heading text-xl font-semibold">
            Related articles
          </h2>
          <ul className="mt-4 space-y-2">
            {relatedPosts.map((related) => (
              <li key={related.id}>
                <Link
                  href={`/insights/${related.slug}`}
                  className="font-medium hover:underline"
                >
                  {related.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}
