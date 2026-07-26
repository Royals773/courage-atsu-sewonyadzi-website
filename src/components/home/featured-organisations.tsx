import { SectionHeading } from "@/components/shared/section-heading";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";

export function FeaturedOrganisations() {
  return (
    <section className="border-b border-border py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Trusted by" title="Organisations worked with" align="center" />
        <div className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ImagePlaceholder key={i} label="Organisation logo placeholder" aspect="square" />
          ))}
        </div>
      </div>
    </section>
  );
}
