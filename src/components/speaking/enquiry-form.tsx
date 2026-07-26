"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";

import { submitSpeakingEnquiryAction } from "@/lib/speaking/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EVENT_TYPES = [
  "Conference or summit",
  "Corporate away day",
  "Leadership training",
  "Workshop",
  "Panel discussion",
  "Virtual event",
  "Other",
];

interface EnquiryFormProps {
  topics: { id: string; title: string }[];
  defaultTopicId?: string;
}

export function SpeakingEnquiryForm({ topics, defaultTopicId }: EnquiryFormProps) {
  const [state, formAction, isPending] = useActionState(submitSpeakingEnquiryAction, {});

  if (state.success) {
    return (
      <div className="rounded-lg border border-border bg-secondary/30 p-8 text-center">
        <h2 className="font-heading text-xl font-semibold">Enquiry received</h2>
        <p className="mt-2 text-muted-foreground">
          Thank you — your enquiry has been received and someone will be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6" aria-describedby="enquiry-form-note">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="organisation">Organisation</Label>
          <Input id="organisation" name="organisation" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="contactName">Contact name</Label>
          <Input id="contactName" name="contactName" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="phone">Telephone</Label>
          <Input id="phone" name="phone" type="tel" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="eventType">Event type</Label>
          <Select name="eventType" defaultValue={EVENT_TYPES[0]}>
            <SelectTrigger id="eventType" className="mt-1.5 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EVENT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="venue">Venue</Label>
          <Input id="venue" name="venue" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Input id="country" name="country" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="audienceSize">Expected audience size</Label>
          <Input id="audienceSize" name="audienceSize" type="number" min="1" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="eventDate">Event date</Label>
          <Input id="eventDate" name="eventDate" type="date" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="budgetRange">Estimated budget</Label>
          <Input id="budgetRange" name="budgetRange" placeholder="£" className="mt-1.5" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="preferredTopicId">Preferred topic</Label>
          <Select name="preferredTopicId" defaultValue={defaultTopicId}>
            <SelectTrigger id="preferredTopicId" className="mt-1.5 w-full">
              <SelectValue placeholder="Not sure yet" />
            </SelectTrigger>
            <SelectContent>
              {topics.map((topic) => (
                <SelectItem key={topic.id} value={topic.id}>
                  {topic.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="notes">Additional notes</Label>
          <Textarea
            id="notes"
            name="notes"
            rows={4}
            className="mt-1.5"
            placeholder="Travel, accessibility needs, AV requirements, session length, etc."
          />
        </div>
      </div>

      <div className="flex items-start gap-2.5">
        <Checkbox id="enquiry-consent" required className="mt-0.5" />
        <Label htmlFor="enquiry-consent" className="text-sm font-normal">
          I consent to my details being stored and used to respond to this enquiry.
        </Label>
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
        className="w-full sm:w-auto"
        aria-label={isPending ? "Submitting enquiry…" : undefined}
      >
        {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : "Submit Enquiry"}
      </Button>
      <p id="enquiry-form-note" className="text-sm text-muted-foreground">
        We typically respond within 2 business days.
      </p>
    </form>
  );
}
