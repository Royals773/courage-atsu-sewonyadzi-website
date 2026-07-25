import Link from "next/link";

import { siteConfig } from "@/lib/content/site-config";
import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";

export function AboutPreview() {
  return (
    <section className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <ImagePlaceholder
          label="Professional photograph placeholder"
          aspect="landscape"
        />
        <div>
          <p className="mb-3 text-sm font-medium tracking-wide text-gold uppercase">
            About
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {siteConfig.brandName}
          </h2>
          <p className="mt-4 text-pretty text-base text-muted-foreground sm:text-lg">
            {siteConfig.shortBio} [Placeholder personal story — replace with a
            short, authentic account of the author&apos;s journey and
            motivation before launch.]
          </p>
          <Button
            variant="outline"
            className="mt-6 w-fit"
            render={<Link href="/about" />}
          >
            Read the full story
          </Button>
        </div>
      </div>
    </section>
  );
}
