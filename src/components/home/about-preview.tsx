import Link from "next/link";

import { getSettingGroup } from "@/lib/settings/queries";
import { getAuthorPhotoUrl } from "@/lib/settings/logo";
import { Button } from "@/components/ui/button";
import { CmsImage } from "@/components/shared/cms-image";
import { Reveal } from "@/components/shared/reveal";

export async function AboutPreview() {
  const [brand, about] = await Promise.all([
    getSettingGroup("brand"),
    getSettingGroup("about"),
  ]);
  const photoUrl = brand.authorPhotoPath ? await getAuthorPhotoUrl(brand.authorPhotoPath) : null;

  return (
    <section className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <Reveal>
          <CmsImage
            src={photoUrl}
            alt={`Professional photograph of ${brand.displayName}`}
            aspect="landscape"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="shadow-lg shadow-foreground/5 ring-1 ring-foreground/5"
          />
        </Reveal>
        <Reveal delay={120}>
          <p className="mb-3 text-sm font-medium tracking-wide text-gold uppercase">
            About
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {brand.displayName}
          </h2>
          <p className="mt-4 text-pretty text-base text-muted-foreground sm:text-lg">
            {brand.shortBio} {about.heroIntro}
          </p>
          <Button
            variant="outline"
            className="mt-6 w-fit"
            render={<Link href="/about" />}
          >
            Read the full story
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
