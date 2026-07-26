import Image from "next/image";

import { getPublishedClientLogos } from "@/lib/client-logos/queries";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";

export async function FeaturedOrganisations() {
  const logos = await getPublishedClientLogos();
  if (logos.length === 0) return null;

  return (
    <section className="border-b border-border py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading eyebrow="Trusted by" title="Organisations worked with" align="center" />
        </Reveal>
        <div className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-6">
          {logos.map((logo, i) => {
            const image = logo.logoUrl ? (
              <div className="relative aspect-square w-full grayscale transition-all duration-300 hover:grayscale-0">
                <Image
                  src={logo.logoUrl}
                  alt={logo.name}
                  fill
                  sizes="(min-width: 640px) 16vw, 33vw"
                  className="object-contain p-3"
                />
              </div>
            ) : null;

            if (!image) return null;

            return (
              <Reveal key={logo.id} delay={i * 60}>
                {logo.websiteUrl ? (
                  <a
                    href={logo.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    aria-label={logo.name}
                  >
                    {image}
                  </a>
                ) : (
                  image
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
