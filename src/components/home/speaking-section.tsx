import Link from "next/link";
import { PlayCircle } from "lucide-react";

import { getFeaturedSpeakingTopics } from "@/lib/speaking/topics";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/shared/reveal";

export async function SpeakingSection() {
  const topics = await getFeaturedSpeakingTopics();

  return (
    <section className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="Speaking"
              title="Speaking that moves organisations to act"
              description="From boardrooms to conference stages, sessions are built on frontline experience — practical, honest and built to be applied the next day."
            />
            {topics.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {topics.slice(0, 4).map((topic) => (
                  <Badge key={topic.id} variant="secondary">
                    {topic.title}
                  </Badge>
                ))}
              </div>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" render={<Link href="/speaking/enquiry" />}>
                Book Me to Speak
              </Button>
              <Button
                size="lg"
                variant="outline"
                render={<Link href="/speaking" />}
              >
                See all topics
              </Button>
            </div>
          </Reveal>
          <Reveal delay={120} className="space-y-4">
            <div className="group relative">
              <ImagePlaceholder
                label="Speaking reel video placeholder"
                aspect="wide"
              />
              <div className="absolute top-1/2 left-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 shadow-md ring-1 ring-foreground/10 backdrop-blur transition-transform group-hover:scale-105">
                <PlayCircle
                  className="size-8 text-foreground/60"
                  aria-hidden="true"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <ImagePlaceholder label="Event photography placeholder" aspect="square" />
              <ImagePlaceholder label="Audience photography placeholder" aspect="square" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
