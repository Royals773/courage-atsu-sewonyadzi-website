import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, FileText, Mic, Newspaper, Radio, Video } from "lucide-react";

import { getPublishedPressItems } from "@/lib/press/queries";
import { getSettingGroup } from "@/lib/settings/queries";
import { buildMetadata } from "@/lib/seo";
import type { PressItemType } from "@/lib/supabase/database.types";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = buildMetadata({
  title: "Media & Press",
  description: "Interviews, podcasts, publications, videos and press releases.",
  path: "/media",
});

const TYPE_LABELS: Record<PressItemType, string> = {
  interview: "Interview",
  podcast: "Podcast",
  publication: "Publication",
  video: "Video",
  press_release: "Press Release",
};

const TYPE_ICONS: Record<PressItemType, React.ElementType> = {
  interview: Mic,
  podcast: Radio,
  publication: Newspaper,
  video: Video,
  press_release: FileText,
};

export default async function MediaPage() {
  const [items, contact] = await Promise.all([
    getPublishedPressItems(),
    getSettingGroup("contact"),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Media"
        title="Media and press"
        description="Interviews, podcast appearances, publications, videos and press releases."
      />

      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        {items.length === 0 ? (
          <p className="text-center text-muted-foreground">Press coverage will be listed here soon.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {items.map((item) => {
              const Icon = TYPE_ICONS[item.type];
              return (
                <Card key={item.id} className={item.isFeatured ? "border-gold" : undefined}>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Icon className="size-4 text-gold" aria-hidden="true" />
                      <Badge variant="secondary">{TYPE_LABELS[item.type]}</Badge>
                    </div>
                    <h2 className="mt-3 font-heading text-lg font-semibold">{item.title}</h2>
                    {item.publicationName ? (
                      <p className="mt-1 text-sm text-muted-foreground">{item.publicationName}</p>
                    ) : null}
                    {item.description ? (
                      <p className="mt-2 text-sm text-foreground/90">{item.description}</p>
                    ) : null}
                    {item.url ? (
                      <Link
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-gold"
                      >
                        View <ExternalLink className="size-3.5" aria-hidden="true" />
                      </Link>
                    ) : null}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t border-border py-14 text-center">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-semibold">Media enquiries</h2>
          <p className="mt-3 text-muted-foreground">
            For interviews, features or press enquiries, contact{" "}
            <a href={`mailto:${contact.mediaEmail}`} className="underline">
              {contact.mediaEmail}
            </a>
            .
          </p>
          <Button className="mt-6" render={<Link href="/media-kit" />}>
            View Media Kit
          </Button>
        </div>
      </div>
    </>
  );
}
