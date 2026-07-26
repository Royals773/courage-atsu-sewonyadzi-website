import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import { getSpeakingTopicBySlug } from "@/lib/speaking/topics";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/content/site-config";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface TopicPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = await getSpeakingTopicBySlug(slug);
  if (!topic) return {};
  return buildMetadata({
    title: topic.title,
    description: topic.summary,
    path: `/speaking/topics/${topic.slug}`,
  });
}

export default async function SpeakingTopicPage({ params }: TopicPageProps) {
  const { slug } = await params;
  const topic = await getSpeakingTopicBySlug(slug);
  if (!topic) notFound();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.siteUrl },
      { "@type": "ListItem", position: 2, name: "Speaking", item: `${siteConfig.siteUrl}/speaking` },
      {
        "@type": "ListItem",
        position: 3,
        name: topic.title,
        item: `${siteConfig.siteUrl}/speaking/topics/${topic.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PageHeader eyebrow="Speaking Topic" title={topic.title} description={topic.summary} />

      <div className="mx-auto max-w-5xl space-y-14 px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-3">
          {topic.duration ? <Badge variant="secondary">{topic.duration}</Badge> : null}
          {topic.audience ? <Badge variant="secondary">For: {topic.audience}</Badge> : null}
          {topic.deliveryFormat.map((format) => (
            <Badge key={format} variant="outline">
              {format}
            </Badge>
          ))}
        </div>

        {topic.learningObjectives.length > 0 ? (
          <section>
            <SectionHeading eyebrow="Objectives" title="What audiences take away" />
            <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {topic.learningObjectives.map((objective) => (
                <li key={objective} className="flex items-start gap-3 text-foreground/90">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden="true" />
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {topic.faqs.length > 0 ? (
          <section>
            <SectionHeading eyebrow="FAQ" title="Questions organisers ask" />
            <Accordion className="mt-6">
              {topic.faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ) : null}

        <section className="rounded-lg border border-border bg-secondary/30 p-8 text-center">
          <h2 className="font-heading text-2xl font-semibold">
            Bring &ldquo;{topic.title}&rdquo; to your event
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button size="lg" render={<Link href={`/speaking/enquiry?topic=${topic.id}`} />}>
              Book Me to Speak
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/speaking" />}>
              See all topics
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
