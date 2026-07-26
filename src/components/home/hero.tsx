import Link from "next/link";
import { PlayCircle } from "lucide-react";

import { getSettingGroup } from "@/lib/settings/queries";
import { getAuthorPhotoUrl } from "@/lib/settings/logo";
import { Button } from "@/components/ui/button";
import { CmsImage } from "@/components/shared/cms-image";
import { Reveal } from "@/components/shared/reveal";

export async function Hero() {
  const [brand, hero] = await Promise.all([
    getSettingGroup("brand"),
    getSettingGroup("hero"),
  ]);
  const photoUrl = brand.authorPhotoPath ? await getAuthorPhotoUrl(brand.authorPhotoPath) : null;

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
        </Reveal>
        <Reveal delay={120}>
          <CmsImage
            src={photoUrl}
            alt={`Professional photograph of ${brand.displayName}`}
            aspect="portrait"
            priority
            className="mx-auto w-full max-w-md shadow-xl shadow-foreground/5 ring-1 ring-foreground/5 lg:max-w-none"
            sizes="(min-width: 1024px) 50vw, (min-width: 640px) 28rem, 100vw"
          />
        </Reveal>
      </div>
    </section>
  );
}
