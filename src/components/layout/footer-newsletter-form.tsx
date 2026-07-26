"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { subscribeToNewsletterAction } from "@/lib/newsletter/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function FooterNewsletterForm() {
  const [state, formAction, isPending] = useActionState(subscribeToNewsletterAction, {});

  if (state.success) {
    return (
      <p className="mt-4 text-sm text-foreground">
        You&apos;re on the list — thank you for subscribing.
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-4 flex flex-col gap-2" aria-describedby="footer-newsletter-note">
      <Label htmlFor="footer-newsletter-email" className="sr-only">
        Email address
      </Label>
      <Input id="footer-newsletter-email" name="email" type="email" placeholder="you@example.com" required />
      <div className="flex items-start gap-2">
        <Checkbox id="footer-newsletter-consent" name="consent" required className="mt-0.5" />
        <Label htmlFor="footer-newsletter-consent" className="text-xs font-normal text-muted-foreground">
          I agree to receive emails. See the{" "}
          <Link href="/legal/privacy-policy" className="underline">
            Privacy Policy
          </Link>
          .
        </Label>
      </div>
      {state.error ? (
        <p className="text-xs text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" disabled={isPending} aria-label={isPending ? "Subscribing…" : undefined}>
        {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : "Subscribe"}
      </Button>
      <p id="footer-newsletter-note" className="text-xs text-muted-foreground/80">
        No spam, unsubscribe any time.
      </p>
    </form>
  );
}
