import type { Metadata } from "next";
import Image from "next/image";
import { Download, Mail } from "lucide-react";

import { getMediaKitAssets } from "@/lib/media-kit/queries";
import { getPublishedSpeakingTopics } from "@/lib/speaking/topics";
import { getPublishedBooks } from "@/lib/books/queries";
import { getSettingGroup } from "@/lib/settings/queries";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeading } from "@/components/shared/section-heading";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = buildMetadata({
  title: "Media Kit",
  description: "Biography, photography, logos and topics for press, organisers and event planners.",
  path: "/media-kit",
});

const CATEGORY_LABELS: Record<string, string> = {
  headshot: "Headshots",
  logo: "Logos",
  "event-photo": "Event photography",
  "book-cover": "Book covers",
  other: "Other assets",
};

export default async function MediaKitPage() {
  const [assets, topics, books, speaking, contact] = await Promise.all([
    getMediaKitAssets(),
    getPublishedSpeakingTopics(),
    getPublishedBooks(),
    getSettingGroup("speaking"),
    getSettingGroup("contact"),
  ]);

  const grouped = assets.reduce<Record<string, typeof assets>>((acc, asset) => {
    (acc[asset.kitCategory] ??= []).push(asset);
    return acc;
  }, {});

  return (
    <>
      <PageHeader
        eyebrow="Press & Organisers"
        title="Media Kit"
        description="Everything needed to introduce, promote and host a speaking engagement."
      />

      <div className="mx-auto max-w-5xl space-y-14 px-4 py-14 sm:px-6 lg:px-8">
        <section>
          <SectionHeading eyebrow="Introduction" title="Speaker introduction" />
          <p className="mt-4 text-pretty text-foreground/90">{speaking.introduction}</p>
        </section>

        <section>
          <SectionHeading eyebrow="About" title="Biography" />
          <p className="mt-4 text-pretty text-foreground/90">{speaking.biography}</p>
        </section>

        {Object.keys(grouped).length === 0 ? (
          <section>
            <SectionHeading eyebrow="Photos & Logos" title="Photography and brand assets" />
            <p className="mt-4 text-muted-foreground">
              High-resolution photography and logos will be published here soon.
            </p>
          </section>
        ) : (
          Object.entries(grouped).map(([category, items]) => (
            <section key={category}>
              <SectionHeading
                eyebrow="Downloads"
                title={CATEGORY_LABELS[category] ?? category}
              />
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {items.map((asset) =>
                  asset.url ? (
                    <a
                      key={asset.id}
                      href={asset.url}
                      download={asset.fileName}
                      className="group relative block overflow-hidden rounded-lg border border-border"
                    >
                      <Image
                        src={asset.url}
                        alt={asset.altText ?? asset.fileName}
                        width={300}
                        height={300}
                        className="aspect-square w-full object-cover"
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                        <Download className="size-6 text-white" aria-hidden="true" />
                      </span>
                    </a>
                  ) : null
                )}
              </div>
            </section>
          ))
        )}

        {topics.length > 0 ? (
          <section>
            <SectionHeading eyebrow="Topics" title="Speaking topics" />
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {topics.map((topic) => (
                <Card key={topic.id}>
                  <CardContent>
                    <h3 className="font-heading font-semibold">{topic.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{topic.summary}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ) : null}

        {books.length > 0 ? (
          <section>
            <SectionHeading eyebrow="Books" title="Book covers" />
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {books.map((book) => (
                <ImagePlaceholder key={book.id} label={book.coverImageLabel} aspect="portrait" />
              ))}
            </div>
          </section>
        ) : null}

        <section className="rounded-lg border border-border bg-secondary/30 p-8">
          <SectionHeading eyebrow="Contact" title="Get in touch" />
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Button render={<a href={`mailto:${contact.speakingEmail}`} />}>
              <Mail className="size-4" aria-hidden="true" />
              {contact.speakingEmail}
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
