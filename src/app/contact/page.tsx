import type { Metadata } from "next";
import Link from "next/link";

import { getFaqs } from "@/lib/faqs/queries";
import { getSettingGroup } from "@/lib/settings/queries";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SocialLinks } from "@/components/shared/social-links";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Get in touch for general, speaking or media enquiries.",
  path: "/contact",
});

export default async function ContactPage() {
  const [faqs, contact, social] = await Promise.all([
    getFaqs(),
    getSettingGroup("contact"),
    getSettingGroup("social"),
  ]);
  const generalFaqs = faqs.filter((f) => f.category === "general-enquiries");

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Get in touch"
        description="For speaking, media or general enquiries — typical response time: [Placeholder — e.g. 2-3 business days]."
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr]">
          <form className="space-y-5" aria-describedby="contact-form-note">
            <fieldset disabled className="space-y-5">
              <legend className="sr-only">Contact form</legend>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="contact-name">Name</Label>
                  <Input id="contact-name" name="name" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="contact-email">Email</Label>
                  <Input
                    id="contact-email"
                    name="email"
                    type="email"
                    className="mt-1.5"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="contact-subject">Subject</Label>
                <Input id="contact-subject" name="subject" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="contact-message">Message</Label>
                <Textarea
                  id="contact-message"
                  name="message"
                  rows={6}
                  className="mt-1.5"
                />
              </div>
            </fieldset>
            <Button type="submit" size="lg" disabled>
              Send Message
            </Button>
            <p id="contact-form-note" className="text-sm text-muted-foreground">
              Direct message submission is being finalised. In the meantime,
              please reach out using the details to the right.
            </p>
          </form>

          <div className="space-y-8">
            <div>
              <h2 className="font-heading text-lg font-semibold">
                General enquiries
              </h2>
              <a
                href={`mailto:${contact.email}`}
                className="mt-1 block text-muted-foreground underline"
              >
                {contact.email}
              </a>
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold">
                Speaking enquiries
              </h2>
              <Link
                href="/speaking/enquiry"
                className="mt-1 block text-muted-foreground underline"
              >
                Go to the speaking enquiry form
              </Link>
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold">
                Media enquiries
              </h2>
              <a
                href={`mailto:${contact.mediaEmail}`}
                className="mt-1 block text-muted-foreground underline"
              >
                {contact.mediaEmail}
              </a>
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold">Follow</h2>
              <SocialLinks className="mt-2 flex flex-wrap gap-2" social={social} />
            </div>
          </div>
        </div>

        {generalFaqs.length > 0 ? (
          <div className="mx-auto mt-16 max-w-2xl">
            <h2 className="font-heading text-2xl font-semibold">
              Frequently asked questions
            </h2>
            <Accordion className="mt-4">
              {generalFaqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ) : null}
      </div>
    </>
  );
}
