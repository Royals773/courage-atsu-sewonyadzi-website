import type { Metadata } from "next";
import Link from "next/link";

import { getPublishedPosts } from "@/lib/blog/queries";
import { isSupabaseConfigured } from "@/lib/env";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CmsImage } from "@/components/shared/cms-image";
import { BackendUnavailable } from "@/components/shared/backend-unavailable";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Insights",
  description:
    "Articles on leadership, adult social care, business, entrepreneurship, personal growth, investment, Africa and technology.",
  path: "/insights",
});

function formatDate(dateString: string) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function InsightsPage() {
  const posts = await getPublishedPosts();
  const [featured, ...rest] = posts;
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Articles and insights"
        description="Search arrives with the next content update. Browse everything below for now."
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {posts.length === 0 ? (
          !isSupabaseConfigured() ? (
            <BackendUnavailable
              title="Insights aren't connected yet"
              description="No Supabase project is configured, so articles can't be loaded."
            />
          ) : (
            <p className="text-center text-muted-foreground">
              No articles published yet — check back soon.
            </p>
          )
        ) : (
          <>
            <Input placeholder="Search articles (coming soon)" disabled className="max-w-sm" />
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>

            {featured ? (
              <Link href={`/insights/${featured.slug}`} className="mt-10 block">
                <Card className="grid grid-cols-1 overflow-hidden sm:grid-cols-2">
                  <CmsImage
                    src={featured.featuredImageUrl}
                    alt={`Cover image — ${featured.title}`}
                    aspect="landscape"
                    className="h-full rounded-none border-0"
                    sizes="(min-width: 640px) 50vw, 100vw"
                  />
                  <CardContent className="flex flex-col justify-center gap-3">
                    <Badge className="w-fit">Featured</Badge>
                    <h2 className="font-heading text-2xl font-semibold">{featured.title}</h2>
                    <p className="text-muted-foreground">{featured.excerpt}</p>
                    <p className="text-xs text-muted-foreground/80">
                      {formatDate(featured.publishedAt)} · {featured.readingTimeMinutes} min read
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ) : null}

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <Link key={post.id} href={`/insights/${post.slug}`}>
                  <Card className="h-full transition-shadow hover:shadow-md">
                    <div className="px-4 pt-4">
                      <CmsImage
                        src={post.featuredImageUrl}
                        alt={`Cover image — ${post.title}`}
                        aspect="landscape"
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      />
                    </div>
                    <CardContent className="flex flex-col gap-2">
                      <p className="text-xs font-medium tracking-wide text-gold uppercase">
                        {post.category}
                      </p>
                      <h3 className="font-heading text-lg font-semibold leading-snug">
                        {post.title}
                      </h3>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
                      <p className="mt-1 text-xs text-muted-foreground/80">
                        {formatDate(post.publishedAt)} · {post.readingTimeMinutes} min read
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
