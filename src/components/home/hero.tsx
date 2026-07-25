import Link from "next/link";
import { PlayCircle } from "lucide-react";

import { siteConfig } from "@/lib/content/site-config";
import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";

export function Hero() {
  return (
    <section className="border-b border-border bg-secondary/30">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-24 lg:px-8">
        <div>
          <p className="mb-4 text-sm font-medium tracking-wide text-gold uppercase">
            {siteConfig.tagline}
          </p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Helping leaders build stronger organisations, better systems and
            meaningful impact.
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg text-muted-foreground">
            {siteConfig.shortBio}
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
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-foreground"
          >
            <PlayCircle className="size-4" aria-hidden="true" />
            Watch My Speaking Reel
          </Link>
        </div>
        <ImagePlaceholder
          label="Professional author/speaker photograph placeholder"
          aspect="portrait"
          className="mx-auto w-full max-w-md lg:max-w-none"
        />
      </div>
    </section>
  );
}
