import Link from "next/link";

import { getLatestPosts } from "@/lib/content/blog-posts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/shared/section-heading";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function LatestInsights() {
  const posts = getLatestPosts(3);

  return (
    <section className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Insights"
            title="Latest insights"
            description="Writing on leadership, care quality, business and building across borders."
          />
          <Button
            variant="outline"
            className="w-fit"
            render={<Link href="/insights" />}
          >
            View all insights
          </Button>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {posts.map((post) => (
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
    </section>
  );
}
