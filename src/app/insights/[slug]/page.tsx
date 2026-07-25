import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { blogPosts, getPostBySlug } from "@/lib/content/blog-posts";
import { siteConfig } from "@/lib/content/site-config";
import { Badge } from "@/components/ui/badge";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import { ShareLinks } from "@/components/shared/share-links";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function InsightPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const index = blogPosts.findIndex((p) => p.id === post.id);
  const previousPost = blogPosts[index - 1];
  const nextPost = blogPosts[index + 1];
  const relatedPosts = blogPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 2);
  const shareUrl = `${siteConfig.siteUrl}/insights/${post.slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
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
      <Badge variant="secondary" className="capitalize">
        {post.category.replace(/-/g, " ")}
      </Badge>
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
        <ImagePlaceholder
          label={`Cover image placeholder — ${post.title}`}
          aspect="wide"
        />
      </div>

      <div className="mt-8 max-w-none text-pretty text-base leading-relaxed text-foreground/90">
        <p>{post.content}</p>
      </div>

      <ShareLinks url={shareUrl} title={post.title} className="mt-10 flex flex-wrap gap-2" />

      <div className="mt-12 flex items-start gap-4 rounded-lg border border-border p-5">
        <Avatar size="lg">
          <AvatarFallback>{post.author.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-heading font-semibold">{post.author}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {siteConfig.shortBio}
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
