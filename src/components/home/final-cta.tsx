import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";

export function FinalCta() {
  return (
    <section className="bg-secondary/40 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to take the next step?
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground sm:text-lg">
            Whether you&apos;re looking for your next read or a speaker for
            your next event, it starts here.
          </p>
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
        </Reveal>
      </div>
    </section>
  );
}
