import Link from "next/link";
import { PlayCircle, CalendarDays } from "lucide-react";

import { getSettingGroup } from "@/lib/settings/queries";
import { getAuthorPhotoUrl } from "@/lib/settings/logo";
import { getFeaturedBooks } from "@/lib/books/queries";
import { getUpcomingPublicEvents } from "@/lib/speaking/events";
import { Button } from "@/components/ui/button";
import { CmsImage } from "@/components/shared/cms-image";
import { Reveal } from "@/components/shared/reveal";
import { CountUp } from "@/components/shared/count-up";

function formatEventMonth(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

export async function Hero() {
  const [brand, hero, credibility, featuredBooks, upcomingEvents] = await Promise.all([
    getSettingGroup("brand"),
    getSettingGroup("hero"),
    getSettingGroup("credibility"),
    getFeaturedBooks(),
    getUpcomingPublicEvents(),
  ]);
  const photoUrl = brand.authorPhotoPath ? await getAuthorPhotoUrl(brand.authorPhotoPath) : null;
  const featuredBook = featuredBooks[0] ?? null;
  const nextEvent = upcomingEvents[0] ?? null;

  const trustIndicators = [
    { label: "Years of experience", value: credibility.yearsExperience },
    { label: "People reached", value: credibility.peopleReached },
    { label: "Countries reached", value: credibility.countriesReached },
  ];

  return (
    <section className="relative overflow-hidden border-b border-border bg-secondary/30">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_80%_0%,color-mix(in_oklch,var(--gold),transparent_88%),transparent)]"
      />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-24 lg:px-8">
        <Reveal>
          <p className="mb-4 text-sm font-medium tracking-wide text-gold uppercase">
            {brand.tagline}
          </p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            {hero.headline}
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg text-muted-foreground">
            {hero.subheading}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button size="lg" render={<Link href="/books" />}>
              Explore My Books
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<Link href="/speaking/enquiry" />}
            >
              Book Me to Speak
            </Button>
          </div>
          <Link
            href="/speaking"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            <PlayCircle className="size-4" aria-hidden="true" />
            Watch My Speaking Reel
          </Link>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-border/70 pt-6">
            {trustIndicators.map((stat) => (
              <div key={stat.label}>
                <p className="font-heading text-2xl font-semibold text-gold">
                  <CountUp value={stat.value} />
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <CmsImage
              src={photoUrl}
              alt={`Professional photograph of ${brand.displayName}`}
              aspect="portrait"
              priority
              className="shadow-xl shadow-foreground/5 ring-1 ring-foreground/5"
              sizes="(min-width: 1024px) 50vw, (min-width: 640px) 28rem, 100vw"
            />

            {nextEvent ? (
              <div className="absolute top-4 right-4 flex max-w-[75%] items-center gap-2 rounded-full bg-background/90 px-3 py-2 text-xs font-medium shadow-md ring-1 ring-foreground/10 backdrop-blur">
                <CalendarDays className="size-3.5 shrink-0 text-gold" aria-hidden="true" />
                <span className="truncate">Speaking — {formatEventMonth(nextEvent.eventDate)}</span>
              </div>
            ) : null}

            {featuredBook ? (
              <Link
                href={`/books/${featuredBook.slug}`}
                className="absolute bottom-4 left-4 flex max-w-[80%] items-center gap-3 rounded-xl bg-background/90 p-2.5 shadow-lg ring-1 ring-foreground/10 backdrop-blur transition-transform hover:-translate-y-0.5"
              >
                <div className="w-10 shrink-0">
                  <CmsImage
                    src={featuredBook.coverImageUrl}
                    alt=""
                    aspect="portrait"
                    sizes="40px"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[0.65rem] font-medium tracking-wide text-gold uppercase">Latest book</p>
                  <p className="truncate text-sm font-medium">{featuredBook.title}</p>
                </div>
              </Link>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
