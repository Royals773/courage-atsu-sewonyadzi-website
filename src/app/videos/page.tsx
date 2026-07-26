import type { Metadata } from "next";

import { getPublishedVideos } from "@/lib/videos/queries";
import { getEmbedUrl } from "@/lib/videos/embed";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = buildMetadata({
  title: "Video Library",
  description: "Keynote clips, event highlights and interviews.",
  path: "/videos",
});

export default async function VideosPage() {
  const videos = await getPublishedVideos();

  return (
    <>
      <PageHeader
        eyebrow="Watch"
        title="Video Library"
        description="Keynote clips, event highlights and interviews."
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {videos.length === 0 ? (
          <p className="text-center text-muted-foreground">Videos will be published here soon.</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <Card key={video.id} className="overflow-hidden">
                <div className="aspect-video bg-muted">
                  {video.platform === "upload" ? (
                    video.playbackUrl ? (
                      <video
                        src={video.playbackUrl}
                        poster={video.thumbnailUrl ?? undefined}
                        controls
                        className="size-full object-cover"
                      />
                    ) : null
                  ) : (
                    (() => {
                      const embedUrl = getEmbedUrl(video.platform, video.videoUrl);
                      return embedUrl ? (
                        <iframe
                          src={embedUrl}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="size-full"
                        />
                      ) : null;
                    })()
                  )}
                </div>
                <CardContent>
                  <h2 className="font-heading text-lg font-semibold">{video.title}</h2>
                  {video.description ? (
                    <p className="mt-1 text-sm text-muted-foreground">{video.description}</p>
                  ) : null}
                  {video.category ? (
                    <Badge variant="secondary" className="mt-3">
                      {video.category}
                    </Badge>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
