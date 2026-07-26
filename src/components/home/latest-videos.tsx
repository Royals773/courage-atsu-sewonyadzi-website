import Link from "next/link";
import { PlayCircle } from "lucide-react";

import { getPublishedVideos } from "@/lib/videos/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/shared/section-heading";
import { CmsImage } from "@/components/shared/cms-image";
import { Reveal } from "@/components/shared/reveal";

export async function LatestVideos() {
  const videos = (await getPublishedVideos()).slice(0, 3);
  if (videos.length === 0) return null;

  return (
    <section className="border-b border-border bg-secondary/30 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Watch"
            title="Latest videos"
            description="Keynote clips, event highlights and interviews."
          />
          <Button
            variant="outline"
            className="w-fit"
            render={<Link href="/videos" />}
          >
            View video library
          </Button>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {videos.map((video, i) => (
            <Reveal key={video.id} delay={i * 80}>
              <Link href="/videos">
                <Card className="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="group relative px-4 pt-4">
                    <CmsImage
                      src={video.thumbnailUrl}
                      alt={`Thumbnail — ${video.title}`}
                      aspect="landscape"
                      sizes="(min-width: 640px) 33vw, 100vw"
                    />
                    <div className="absolute inset-4 flex items-center justify-center">
                      <div className="flex size-12 items-center justify-center rounded-full bg-background/80 shadow-md ring-1 ring-foreground/10 backdrop-blur transition-transform group-hover:scale-105">
                        <PlayCircle className="size-6 text-foreground/70" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="flex flex-col gap-2">
                    <h3 className="font-heading text-lg font-semibold leading-snug">
                      {video.title}
                    </h3>
                    {video.description ? (
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {video.description}
                      </p>
                    ) : null}
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
