"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { subscribeToNewsletterAction } from "@/lib/newsletter/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SectionHeading } from "@/components/shared/section-heading";

export function NewsletterSection() {
  const [state, formAction, isPending] = useActionState(subscribeToNewsletterAction, {});

  return (
    <section className="border-b border-border bg-primary py-16 text-primary-foreground sm:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Free guide"
          title="Get the free guide: 5 Systems Every Leader Needs"
          description="Join the mailing list for occasional insights on leadership, strategy and building organisations that last — plus the free guide as a welcome gift."
          align="center"
          className="[&_p]:text-primary-foreground/80 [&_h2]:text-primary-foreground"
        />
        {state.success ? (
          <p className="mx-auto mt-8 max-w-xl rounded-md bg-primary-foreground/10 px-4 py-3 text-sm">
            You&apos;re on the list — thank you for subscribing.
          </p>
        ) : (
          <form action={formAction} className="mx-auto mt-8 flex max-w-xl flex-col gap-4 text-left">
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
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="mt-1.5 bg-primary-foreground/5 text-primary-foreground placeholder:text-primary-foreground/40"
                />
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Checkbox id="newsletter-consent" name="consent" required className="mt-0.5" />
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
            {state.error ? (
              <p className="text-sm text-destructive-foreground" role="alert">
                {state.error}
              </p>
            ) : null}
            <Button
              type="submit"
              disabled={isPending}
              variant="secondary"
              size="lg"
              className="w-full"
              aria-label={isPending ? "Joining the mailing list…" : undefined}
            >
              {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : "Join the Mailing List"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
