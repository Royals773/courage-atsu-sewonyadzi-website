import Link from "next/link";

import { getPublishedPosts } from "@/lib/blog/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/shared/section-heading";
import { CmsImage } from "@/components/shared/cms-image";
import { Reveal } from "@/components/shared/reveal";

function formatDate(dateString: string) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function LatestInsights() {
  const posts = (await getPublishedPosts()).slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Insights"
            title="Latest insights"
            description="Writing on leadership, strategy, culture and building organisations that last."
          />
          <Button
            variant="outline"
            className="w-fit"
            render={<Link href="/insights" />}
          >
            View all insights
          </Button>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.id} delay={i * 80}>
              <Link href={`/insights/${post.slug}`}>
                <Card className="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="px-4 pt-4">
                    <CmsImage
                      src={post.featuredImageUrl}
                      alt={`Cover image — ${post.title}`}
                      aspect="landscape"
                      sizes="(min-width: 640px) 33vw, 100vw"
                    />
                  </div>
                  <CardContent className="flex flex-col gap-2">
                    <p className="text-xs font-medium tracking-wide text-gold uppercase">
                      {post.category}
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
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
