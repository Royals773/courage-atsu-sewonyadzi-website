import type { Metadata } from "next";
import Link from "next/link";

import { siteConfig } from "@/lib/content/site-config";
import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardContent } from "@/components/ui/card";

const timeline = [
  { year: "[Year]", label: "[Placeholder milestone — e.g. started career in the care sector]" },
  { year: "[Year]", label: "[Placeholder milestone — e.g. moved into strategic leadership]" },
  { year: "[Year]", label: "[Placeholder milestone — e.g. first speaking engagement]" },
  { year: "[Year]", label: "[Placeholder milestone — e.g. first book published]" },
];

const values = [
  "[Placeholder value — e.g. Integrity in leadership]",
  "[Placeholder value — e.g. Practical, evidence-based thinking]",
  "[Placeholder value — e.g. Building across communities and borders]",
];

const expertiseAreas = [
  "Leadership development",
  "Care quality and compliance",
  "Organisational resilience",
  "Entrepreneurship and cross-border investment",
];

export const metadata: Metadata = {
  title: "About",
  description:
    "The background, journey and mission behind the books and speaking work.",
};

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-border bg-secondary/30">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <div>
            <p className="mb-3 text-sm font-medium tracking-wide text-gold uppercase">
              About
            </p>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              {siteConfig.brandName}
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-lg text-muted-foreground">
              [Placeholder personal background — a few sentences on who you
              are, where you started, and what led to this work.]
            </p>
          </div>
          <ImagePlaceholder label="Professional photograph placeholder" aspect="portrait" />
        </div>
      </section>

      <section className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-3xl space-y-10 px-4 sm:px-6 lg:px-8">
          <div>
            <h2 className="font-heading text-2xl font-semibold">
              Professional journey
            </h2>
            <p className="mt-4 text-pretty text-foreground/90">
              [Placeholder — outline the professional path from frontline
              work through to strategic leadership, consulting, writing and
              speaking.]
            </p>
          </div>
          <div>
            <h2 className="font-heading text-2xl font-semibold">
              Leadership experience
            </h2>
            <p className="mt-4 text-pretty text-foreground/90">
              [Placeholder — summarise leadership roles and the kinds of
              organisations and teams led.]
            </p>
          </div>
          <div>
            <h2 className="font-heading text-2xl font-semibold">
              Motivation for writing
            </h2>
            <p className="mt-4 text-pretty text-foreground/90">
              [Placeholder — why these books exist and who they were written
              for.]
            </p>
          </div>
          <div>
            <h2 className="font-heading text-2xl font-semibold">
              Speaking mission
            </h2>
            <p className="mt-4 text-pretty text-foreground/90">
              [Placeholder — what speaking work is meant to achieve for
              audiences and organisations.]
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <h2 className="font-heading text-2xl font-semibold">
                Areas of expertise
              </h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-foreground/90">
                {expertiseAreas.map((area) => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-heading text-2xl font-semibold">Values</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-foreground/90">
                {values.map((value) => (
                  <li key={value}>{value}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Timeline" title="Personal timeline" />
          <ol className="mt-8 space-y-6 border-l border-border pl-6">
            {timeline.map((item) => (
              <li key={item.label} className="relative">
                <span className="absolute -left-[1.6rem] top-1 size-2.5 rounded-full bg-gold" />
                <p className="text-sm font-semibold text-gold">{item.year}</p>
                <p className="mt-1 text-foreground/90">{item.label}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Selected achievements" title="Selected achievements" align="center" />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent>
                  <p className="text-sm text-foreground/90">
                    [Placeholder achievement {i} — replace with a real,
                    verifiable accomplishment.]
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-semibold">Media biography</h2>
          <p className="mt-4 text-pretty text-foreground/90">
            [Placeholder short-form biography suitable for event programmes
            and press use. See the Media page for the full media kit.]
          </p>
          <Button
            variant="outline"
            className="mt-4"
            render={<Link href="/media" />}
          >
            View media kit
          </Button>
        </div>
      </section>

      <section className="py-16 text-center sm:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Work together
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" render={<Link href="/books" />}>
              Buy a Book
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<Link href="/speaking/enquiry" />}
            >
              Book a Speaking Engagement
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
