import type { Metadata } from "next";
import Link from "next/link";

import { getSettingGroup } from "@/lib/settings/queries";
import { getAuthorPhotoUrl } from "@/lib/settings/logo";
import { buildMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { CmsImage } from "@/components/shared/cms-image";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardContent } from "@/components/ui/card";

export async function generateMetadata(): Promise<Metadata> {
  const [brand, about] = await Promise.all([
    getSettingGroup("brand"),
    getSettingGroup("about"),
  ]);
  const photoUrl = brand.authorPhotoPath ? await getAuthorPhotoUrl(brand.authorPhotoPath) : null;
  return buildMetadata({
    title: "About",
    description: about.heroIntro,
    path: "/about",
    image: photoUrl,
  });
}

export default async function AboutPage() {
  const [brand, about] = await Promise.all([
    getSettingGroup("brand"),
    getSettingGroup("about"),
  ]);
  const photoUrl = brand.authorPhotoPath ? await getAuthorPhotoUrl(brand.authorPhotoPath) : null;

  return (
    <>
      <section className="border-b border-border bg-secondary/30">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <div>
            <p className="mb-3 text-sm font-medium tracking-wide text-gold uppercase">
              About
            </p>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              {brand.displayName}
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-lg text-muted-foreground">
              {about.heroIntro}
            </p>
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
        <div className="mx-auto max-w-3xl space-y-10 px-4 sm:px-6 lg:px-8">
          <div>
            <h2 className="font-heading text-2xl font-semibold">
              Professional journey
            </h2>
            <p className="mt-4 text-pretty text-foreground/90">{about.professionalJourney}</p>
          </div>
          <div>
            <h2 className="font-heading text-2xl font-semibold">
              Leadership experience
            </h2>
            <p className="mt-4 text-pretty text-foreground/90">{about.leadershipExperience}</p>
          </div>
          <div>
            <h2 className="font-heading text-2xl font-semibold">
              Motivation for writing
            </h2>
            <p className="mt-4 text-pretty text-foreground/90">{about.motivationForWriting}</p>
          </div>
          <div>
            <h2 className="font-heading text-2xl font-semibold">
              Speaking mission
            </h2>
            <p className="mt-4 text-pretty text-foreground/90">{about.speakingMission}</p>
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
                {about.expertiseAreas.map((area) => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-heading text-2xl font-semibold">Values</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-foreground/90">
                {about.values.map((value) => (
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
            {about.timeline.map((item) => (
              <li key={`${item.year}-${item.label}`} className="relative">
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
            {about.achievements.map((achievement) => (
              <Card key={achievement}>
                <CardContent>
                  <p className="text-sm text-foreground/90">{achievement}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-semibold">Media biography</h2>
          <p className="mt-4 text-pretty text-foreground/90">{about.mediaBiography}</p>
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
