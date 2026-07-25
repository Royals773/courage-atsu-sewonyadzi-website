import type { Metadata } from "next";
import Link from "next/link";

import { blogPosts, getFeaturedPost } from "@/lib/content/blog-posts";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Articles on leadership, adult social care, business, entrepreneurship, personal growth, investment, Africa and technology.",
};

const categories = [
  "leadership",
  "adult-social-care",
  "business",
  "entrepreneurship",
  "personal-growth",
  "investment",
  "africa",
  "technology",
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function InsightsPage() {
  const featured = getFeaturedPost();
  const rest = blogPosts.filter((p) => p.id !== featured.id);

  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Articles and insights"
        description="Category filtering and search go live alongside the full content platform. Browse everything below for now."
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Input
          placeholder="Search articles (coming soon)"
          disabled
          className="max-w-sm"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge key={category} variant="secondary" className="opacity-70 capitalize">
              {category.replace(/-/g, " ")}
            </Badge>
          ))}
        </div>

        <Link href={`/insights/${featured.slug}`} className="mt-10 block">
          <Card className="grid grid-cols-1 overflow-hidden sm:grid-cols-2">
            <ImagePlaceholder
              label={`Cover image placeholder — ${featured.title}`}
              aspect="landscape"
              className="h-full rounded-none border-0"
            />
            <CardContent className="flex flex-col justify-center gap-3">
              <Badge className="w-fit">Featured</Badge>
              <h2 className="font-heading text-2xl font-semibold">
                {featured.title}
              </h2>
              <p className="text-muted-foreground">{featured.excerpt}</p>
              <p className="text-xs text-muted-foreground/80">
                {formatDate(featured.publishedAt)} · {featured.readingTimeMinutes} min read
              </p>
            </CardContent>
          </Card>
        </Link>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <Link key={post.id} href={`/insights/${post.slug}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <div className="px-4 pt-4">
                  <ImagePlaceholder
                    label={`Cover image placeholder — ${post.title}`}
                    aspect="landscape"
                  />
                </div>
                <CardContent className="flex flex-col gap-2">
                  <p className="text-xs font-medium tracking-wide text-gold uppercase">
                    {post.category.replace(/-/g, " ")}
                  </p>
                  <h3 className="font-heading text-lg font-semibold leading-snug">
                    {post.title}
                  </h3>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground/80">
                    {formatDate(post.publishedAt)} · {post.readingTimeMinutes} min read
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
