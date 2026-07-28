"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";

import { submitContactFormAction } from "@/lib/contact/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactFormAction, {});

  if (state.success) {
    return (
      <div className="rounded-lg border border-border bg-secondary/30 p-8 text-center">
        <h2 className="font-heading text-xl font-semibold">Message sent</h2>
        <p className="mt-2 text-muted-foreground">
          Thank you — your message has been received and someone will be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5" aria-describedby="contact-form-note">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="contact-name">Name</Label>
          <Input id="contact-name" name="name" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="contact-email">Email</Label>
          <Input id="contact-email" name="email" type="email" required className="mt-1.5" />
        </div>
      </div>
      <div>
        <Label htmlFor="contact-subject">Subject</Label>
        <Input id="contact-subject" name="subject" className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="contact-message">Message</Label>
        <Textarea id="contact-message" name="message" rows={6} required className="mt-1.5" />
      </div>

      {state.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={isPending}
        aria-label={isPending ? "Sending message…" : undefined}
      >
        {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : "Send Message"}
      </Button>
      <p id="contact-form-note" className="text-sm text-muted-foreground">
        We typically respond within 2-3 business days.
      </p>
    </form>
  );
}
