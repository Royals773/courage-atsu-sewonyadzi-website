import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SectionHeading } from "@/components/shared/section-heading";

export function NewsletterSection() {
  return (
    <section className="border-b border-border bg-primary py-16 text-primary-foreground sm:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Free guide"
          title="Get the free guide: 5 Systems Every Leader Needs"
          description="Join the mailing list for occasional insights on leadership, care quality and building across borders — plus the free guide as a welcome gift."
          align="center"
          className="[&_p]:text-primary-foreground/80 [&_h2]:text-primary-foreground"
        />
        <form className="mx-auto mt-8 flex max-w-xl flex-col gap-4 text-left">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="newsletter-first-name" className="text-primary-foreground/90">
                First name
              </Label>
              <Input
                id="newsletter-first-name"
                name="firstName"
                autoComplete="given-name"
                placeholder="Jane"
                disabled
                className="mt-1.5 bg-primary-foreground/5 text-primary-foreground placeholder:text-primary-foreground/40"
              />
            </div>
            <div>
              <Label htmlFor="newsletter-email" className="text-primary-foreground/90">
                Email address
              </Label>
              <Input
                id="newsletter-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                disabled
                className="mt-1.5 bg-primary-foreground/5 text-primary-foreground placeholder:text-primary-foreground/40"
              />
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Checkbox id="newsletter-consent" disabled className="mt-0.5" />
            <Label
              htmlFor="newsletter-consent"
              className="text-sm font-normal text-primary-foreground/80"
            >
              I agree to receive emails and understand I can unsubscribe at
              any time. See the{" "}
              <Link href="/legal/privacy-policy" className="underline">
                Privacy Policy
              </Link>
              .
            </Label>
          </div>
          <Button
            type="submit"
            disabled
            variant="secondary"
            size="lg"
            className="w-full"
          >
            Join the Mailing List
          </Button>
          <p className="text-center text-xs text-primary-foreground/60">
            Newsletter sign-up goes live in Phase 3 — form shown for layout
            review only.
          </p>
        </form>
      </div>
    </section>
  );
}
