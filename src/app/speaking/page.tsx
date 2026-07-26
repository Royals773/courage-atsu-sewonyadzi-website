import type { Metadata } from "next";
import Link from "next/link";
import { PlayCircle } from "lucide-react";

import { getPublishedSpeakingTopics } from "@/lib/speaking/topics";
import { getApprovedTestimonials } from "@/lib/testimonials/queries";
import { getFaqs } from "@/lib/faqs/queries";
import { getSettingGroup } from "@/lib/settings/queries";
import { getAuthorPhotoUrl } from "@/lib/settings/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import { CmsImage } from "@/components/shared/cms-image";
import { SectionHeading } from "@/components/shared/section-heading";
import { buildMetadata } from "@/lib/seo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getSettingGroup("brand");
  const photoUrl = brand.authorPhotoPath ? await getAuthorPhotoUrl(brand.authorPhotoPath) : null;
  return buildMetadata({
    title: "Speaking",
    description:
      "Book a keynote or workshop on leadership, resilient organisations, care quality and building across borders.",
    path: "/speaking",
    image: photoUrl,
  });
}

const BOOK_TESTIMONIAL_CATEGORY = "books";

export default async function SpeakingPage() {
  const [topics, allTestimonials, allFaqs, speaking, brand] = await Promise.all([
    getPublishedSpeakingTopics(),
    getApprovedTestimonials(),
    getFaqs(),
    getSettingGroup("speaking"),
    getSettingGroup("brand"),
  ]);
  const photoUrl = brand.authorPhotoPath ? await getAuthorPhotoUrl(brand.authorPhotoPath) : null;
  const testimonials = allTestimonials
    .filter((t) => t.category !== BOOK_TESTIMONIAL_CATEGORY)
    .slice(0, 3);
  const speakingFaqs = allFaqs.filter((f) =>
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
              {speaking.introduction}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" render={<Link href="/speaking/enquiry" />}>
                Book Me to Speak
              </Button>
              <Button size="lg" variant="outline" render={<Link href="/media-kit" />}>
                Download Media Kit
              </Button>
            </div>
          </div>
          <CmsImage
            src={photoUrl}
            alt={`Professional photograph of ${brand.displayName}`}
            aspect="portrait"
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
      </section>

      <section className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
            <div>
              <SectionHeading eyebrow="About" title="Biography" />
              <p className="mt-4 text-pretty text-foreground/90">{speaking.biography}</p>
            </div>
            <div>
              <SectionHeading eyebrow="Approach" title="Speaking philosophy" />
              <p className="mt-4 text-pretty text-foreground/90">{speaking.philosophy}</p>
            </div>
          </div>
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
          <SectionHeading eyebrow="Gallery" title="Professional photography" align="center" />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ImagePlaceholder key={i} label="Professional photograph placeholder" aspect="square" />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Topics" title="Main speaking topics" align="center" />
          {topics.length === 0 ? (
            <p className="mt-6 text-center text-muted-foreground">
              Topics will be published here soon.
            </p>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {topics.map((topic) => (
                <Card key={topic.id} className="flex h-full flex-col">
                  <CardContent className="flex h-full flex-col">
                    <h3 className="font-heading text-lg font-semibold">{topic.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{topic.summary}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {topic.duration ? <Badge variant="secondary">{topic.duration}</Badge> : null}
                      {topic.deliveryFormat.slice(0, 2).map((format) => (
                        <Badge key={format} variant="outline">
                          {format}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      variant="link"
                      className="mt-4 self-start px-0"
                      render={<Link href={`/speaking/topics/${topic.slug}`} />}
                    >
                      View details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
            <div>
              <h2 className="font-heading text-2xl font-semibold">Audience outcomes</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-foreground/90">
                {speaking.audienceOutcomes.map((outcome) => (
                  <li key={outcome}>{outcome}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-heading text-2xl font-semibold">Industries served</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-foreground/90">
                {speaking.industries.map((industry) => (
                  <li key={industry}>{industry}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Clients" title="Previous clients" align="center" />
          <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ImagePlaceholder key={i} label="Client logo placeholder" aspect="square" />
            ))}
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

      {testimonials.length > 0 ? (
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
      ) : null}

      {speakingFaqs.length > 0 ? (
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
      ) : null}

      <section className="py-16 text-center sm:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to bring this to your event?
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" render={<Link href="/speaking/enquiry" />}>
              Book Me to Speak
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/media-kit" />}>
              Download Speaker Profile
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
