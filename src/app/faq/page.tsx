import type { Metadata } from "next";

import { getFaqs } from "@/lib/faqs/queries";
import type { FaqCategory } from "@/lib/supabase/database.types";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/shared/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = buildMetadata({
  title: "FAQ",
  description:
    "Frequently asked questions about book orders, delivery, digital downloads, refunds, speaking engagements, travel, courses and more.",
  path: "/faq",
});

const categoryLabels: Record<FaqCategory, string> = {
  "book-orders": "Book Orders",
  delivery: "Delivery",
  "digital-downloads": "Digital Downloads",
  refunds: "Refunds",
  "speaking-engagements": "Speaking Engagements",
  travel: "Travel",
  courses: "Courses",
  "media-enquiries": "Media Enquiries",
  "general-enquiries": "General Enquiries",
};

export default async function FaqPage() {
  const faqs = await getFaqs();
  const categories = Object.keys(categoryLabels) as FaqCategory[];

  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="Frequently asked questions"
      />
      <div className="mx-auto max-w-3xl space-y-12 px-4 py-14 sm:px-6 lg:px-8">
        {faqs.length === 0 ? (
          <p className="text-center text-muted-foreground">No FAQs published yet.</p>
        ) : (
          categories.map((category) => {
            const items = faqs.filter((f) => f.category === category);
            if (items.length === 0) return null;

            return (
              <div key={category}>
                <h2 className="font-heading text-xl font-semibold">
                  {categoryLabels[category]}
                </h2>
                <Accordion className="mt-3">
                  {items.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
