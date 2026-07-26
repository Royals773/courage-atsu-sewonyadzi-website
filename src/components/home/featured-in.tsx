import Link from "next/link";

import { getPublishedPressItems } from "@/lib/press/queries";
import { Reveal } from "@/components/shared/reveal";

export async function FeaturedIn() {
  const items = (await getPublishedPressItems()).filter((item) => item.isFeatured && item.publicationName);
  if (items.length === 0) return null;

  return (
    <section className="border-b border-border py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-center">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Featured in
          </p>
          {items.map((item) => (
            <Link
              key={item.id}
              href="/media"
              className="font-heading text-lg font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              {item.publicationName}
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
