import type { Metadata } from "next";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = {
  title: "Speaking Enquiry",
  description: "Submit a speaking enquiry for your event or organisation.",
};

const fields: { id: string; label: string; type?: string; placeholder?: string; colSpan?: boolean }[] = [
  { id: "fullName", label: "Full name", placeholder: "Jane Doe" },
  { id: "organisation", label: "Organisation", placeholder: "Acme Ltd" },
  { id: "jobTitle", label: "Job title", placeholder: "Head of Events" },
  { id: "email", label: "Email", type: "email", placeholder: "you@example.com" },
  { id: "telephone", label: "Telephone", type: "tel", placeholder: "+44 7000 000000" },
  { id: "eventName", label: "Event name", placeholder: "Annual Leadership Summit" },
  { id: "eventType", label: "Event type", placeholder: "Conference, corporate away day, etc." },
  { id: "eventDate", label: "Event date", type: "date" },
  { id: "startTime", label: "Start time", type: "time" },
  { id: "endTime", label: "End time", type: "time" },
  { id: "venue", label: "Venue", placeholder: "Venue name" },
  { id: "city", label: "City", placeholder: "London" },
  { id: "country", label: "Country", placeholder: "United Kingdom" },
  { id: "audienceSize", label: "Expected audience size", type: "number", placeholder: "150" },
  { id: "topic", label: "Preferred speaking topic", placeholder: "e.g. Leadership Under Pressure" },
  { id: "format", label: "In-person or virtual", placeholder: "In-person / Virtual / Hybrid" },
  { id: "budget", label: "Estimated budget", placeholder: "£" },
  { id: "source", label: "How did you hear about us?", placeholder: "LinkedIn, referral, etc." },
];

export default function SpeakingEnquiryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Speaking"
        title="Speaking enquiry"
        description="Tell us about your event. Submission and email confirmation go live in Phase 3 — this form shows the full field set for design review."
      />
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <form className="space-y-6" aria-describedby="enquiry-form-note">
          <fieldset disabled className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <legend className="sr-only">Speaking enquiry details</legend>
            {fields.map((field) => (
              <div key={field.id}>
                <Label htmlFor={field.id}>{field.label}</Label>
                <Input
                  id={field.id}
                  name={field.id}
                  type={field.type ?? "text"}
                  placeholder={field.placeholder}
                  className="mt-1.5"
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <Label htmlFor="travel">Travel and accommodation details</Label>
              <Textarea
                id="travel"
                name="travel"
                className="mt-1.5"
                placeholder="Any travel, accommodation or logistical details we should know"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="additionalRequirements">
                Additional requirements
              </Label>
              <Textarea
                id="additionalRequirements"
                name="additionalRequirements"
                className="mt-1.5"
                placeholder="AV requirements, accessibility needs, session length, etc."
              />
            </div>
          </fieldset>

          <div className="flex items-start gap-2.5">
            <Checkbox id="enquiry-consent" disabled className="mt-0.5" />
            <Label htmlFor="enquiry-consent" className="text-sm font-normal">
              I consent to my details being stored and used to respond to this
              enquiry.
            </Label>
          </div>

          <Button type="submit" size="lg" disabled className="w-full sm:w-auto">
            Submit Enquiry
          </Button>
          <p id="enquiry-form-note" className="text-sm text-muted-foreground">
            Submitting an enquiry, Supabase storage, and confirmation emails
            go live in Phase 3.
          </p>
        </form>
      </div>
    </>
  );
}
