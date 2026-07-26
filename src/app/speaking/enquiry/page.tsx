import type { Metadata } from "next";

import { getPublishedSpeakingTopics } from "@/lib/speaking/topics";
import { PageHeader } from "@/components/shared/page-header";
import { SpeakingEnquiryForm } from "@/components/speaking/enquiry-form";

export const metadata: Metadata = {
  title: "Speaking Enquiry",
  description: "Submit a speaking enquiry for your event or organisation.",
};

export default async function SpeakingEnquiryPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const [topics, { topic }] = await Promise.all([getPublishedSpeakingTopics(), searchParams]);

  return (
    <>
      <PageHeader
        eyebrow="Speaking"
        title="Speaking enquiry"
        description="Tell us about your event and we'll be in touch to discuss availability and fit."
      />
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <SpeakingEnquiryForm topics={topics} defaultTopicId={topic} />
      </div>
    </>
  );
}
