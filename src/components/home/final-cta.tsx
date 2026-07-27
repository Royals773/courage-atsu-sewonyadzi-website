import Link from "next/link";

import { getSettingGroup } from "@/lib/settings/queries";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";

export async function FinalCta() {
  const cta = await getSettingGroup("cta");

  return (
    <section className="bg-secondary/40 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {cta.headline}
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground sm:text-lg">
            {cta.description}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" render={<Link href="/books" />}>
              {cta.primaryLabel}
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<Link href="/speaking/enquiry" />}
            >
              {cta.secondaryLabel}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
