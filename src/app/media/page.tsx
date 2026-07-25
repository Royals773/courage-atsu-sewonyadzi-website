import type { Metadata } from "next";

import { mediaItems } from "@/lib/content/media";
import { siteConfig } from "@/lib/content/site-config";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";

export const metadata: Metadata = {
  title: "Media",
  description:
    "Media kit, biography, headshots, and press, podcast and video appearances.",
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function MediaPage() {
  return (
    <>
      <PageHeader
        eyebrow="Media"
        title="Media and press"
        description="Illustrative sample appearances shown below — replace with real coverage before launch."
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-2xl font-semibold">
              Short biography
            </h2>
            <p className="mt-4 text-pretty text-foreground/90">
              [Placeholder short biography — 2-3 sentences suitable for event
              programmes and quick press use.]
            </p>
          </div>
          <div>
            <h2 className="font-heading text-2xl font-semibold">
              Long biography
            </h2>
            <p className="mt-4 text-pretty text-foreground/90">
              [Placeholder long biography — a fuller account of background,
              expertise and achievements suitable for detailed press
              features.]
            </p>
          </div>
        </div>
      </div>

      <div className="border-y border-border py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Assets" title="Headshots and book covers" align="center" />
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <ImagePlaceholder label="Headshot placeholder 1" aspect="portrait" />
            <ImagePlaceholder label="Headshot placeholder 2" aspect="portrait" />
            <ImagePlaceholder label="Book cover placeholder 1" aspect="portrait" />
            <ImagePlaceholder label="Book cover placeholder 2" aspect="portrait" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Appearances" title="Press, podcasts and interviews" />
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {mediaItems.map((item) => (
            <Card key={item.id}>
              <CardContent>
                <Badge variant="secondary" className="w-fit capitalize">
                  {item.type}
                </Badge>
                <h3 className="mt-3 font-heading text-base font-semibold">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.outlet} · {formatDate(item.date)}
                </p>
                <p className="mt-2 text-sm text-foreground/90">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground/70">
          Sample appearances shown for illustrative purposes only.
        </p>
      </div>

      <div className="border-t border-border py-14 text-center">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-semibold">
            Media enquiries
          </h2>
          <p className="mt-3 text-muted-foreground">
            For interviews, features or press enquiries, contact{" "}
            <a href={`mailto:${siteConfig.mediaEmail}`} className="underline">
              {siteConfig.mediaEmail}
            </a>
            .
          </p>
          <Button className="mt-6" disabled title="Media kit download coming soon">
            Download Media Kit
          </Button>
        </div>
      </div>
    </>
  );
}
