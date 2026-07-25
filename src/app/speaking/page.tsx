import type { Metadata } from "next";
import Link from "next/link";
import { PlayCircle } from "lucide-react";

import { speakingTopics } from "@/lib/content/speaking-topics";
import { getFeaturedTestimonials } from "@/lib/content/testimonials";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/lib/content/faqs";

export const metadata: Metadata = {
  title: "Speaking",
  description:
    "Book a keynote or workshop on leadership, resilient organisations, care quality and building across borders.",
};

const eventTypes = [
  "Conferences and summits",
  "Corporate away days",
  "Care-sector leadership events",
  "University and community events",
  "Panel discussions and fireside chats",
];

export default function SpeakingPage() {
  const testimonials = getFeaturedTestimonials().slice(0, 3);
  const speakingFaqs = faqs.filter((f) =>
    ["speaking-engagements", "travel"].includes(f.category)
  );

  return (
    <>
      <section className="border-b border-border bg-secondary/30">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <div>
            <p className="mb-3 text-sm font-medium tracking-wide text-gold uppercase">
              Speaking
            </p>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Speaking that moves organisations to act
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-lg text-muted-foreground">
              [Placeholder speaker introduction — a short paragraph on
              speaking style, experience and the kind of events typically
              served.]
            </p>
            <Button
              size="lg"
              className="mt-8"
              render={<Link href="/speaking/enquiry" />}
            >
              Book Me to Speak
            </Button>
          </div>
          <ImagePlaceholder
            label="Professional speaker photograph placeholder"
            aspect="portrait"
          />
        </div>
      </section>

      <section className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <ImagePlaceholder label="Speaking reel video placeholder" aspect="wide" />
            <PlayCircle
              className="absolute top-1/2 left-1/2 size-16 -translate-x-1/2 -translate-y-1/2 text-foreground/40"
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Topics" title="Main speaking topics" align="center" />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {speakingTopics.map((topic) => (
              <Card key={topic.id}>
                <CardContent>
                  <h3 className="font-heading text-lg font-semibold">
                    {topic.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {topic.description}
                  </p>
                  <p className="mt-3 text-xs font-medium tracking-wide text-gold uppercase">
                    Audience outcomes
                  </p>
                  <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-foreground/90">
                    {topic.audienceOutcomes.map((outcome) => (
                      <li key={outcome}>{outcome}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
            <div>
              <h2 className="font-heading text-2xl font-semibold">
                Types of events served
              </h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-foreground/90">
                {eventTypes.map((type) => (
                  <li key={type}>{type}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-heading text-2xl font-semibold">
                Previous clients
              </h2>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ImagePlaceholder
                    key={i}
                    label="Client logo placeholder"
                    aspect="square"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Photography" title="Event gallery" align="center" />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ImagePlaceholder key={i} label="Event photography placeholder" aspect="square" />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-secondary/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Testimonials" title="What organisers say" align="center" />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.id}>
                <CardContent>
                  <p className="text-sm text-foreground/90">&ldquo;{t.quote}&rdquo;</p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {t.authorName}, {t.authorRole}, {t.organisation}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
          <Accordion className="mt-6">
            {speakingFaqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="py-16 text-center sm:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to bring this to your event?
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" render={<Link href="/speaking/enquiry" />}>
              Book Me to Speak
            </Button>
            <Button size="lg" variant="outline" disabled title="Media kit coming soon">
              Download Speaker Profile
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
