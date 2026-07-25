import type { SpeakingTopic } from "./types";

export const speakingTopics: SpeakingTopic[] = [
  {
    id: "topic-1",
    slug: "leadership-under-pressure",
    title: "Leadership Under Pressure",
    description:
      "How leaders make sound decisions and hold their teams together when stakes, scrutiny and pace are all rising at once.",
    audienceOutcomes: [
      "A framework for decision-making under time pressure",
      "How to protect team morale during high-stakes periods",
    ],
  },
  {
    id: "topic-2",
    slug: "building-resilient-organisations",
    title: "Building Resilient Organisations",
    description:
      "Practical principles for designing organisations that adapt to shocks instead of being derailed by them.",
    audienceOutcomes: [
      "How to identify single points of failure in your organisation",
      "Building redundancy without building bureaucracy",
    ],
  },
  {
    id: "topic-3",
    slug: "quality-culture-and-accountability",
    title: "Quality, Culture and Accountability",
    description:
      "Grounded in frontline care experience, this talk explores how to build a culture where quality and accountability reinforce each other.",
    audienceOutcomes: [
      "A practical model for accountability without blame",
      "How quality becomes a shared cultural value, not a compliance exercise",
    ],
  },
  {
    id: "topic-4",
    slug: "entrepreneurship-and-african-opportunities",
    title: "Entrepreneurship and African Opportunities",
    description:
      "An honest look at the opportunities — and the groundwork required — for entrepreneurs and investors building across the UK, Ghana and wider Africa.",
    audienceOutcomes: [
      "A realistic view of cross-border opportunity",
      "First steps for aspiring entrepreneurs and investors",
    ],
  },
  {
    id: "topic-5",
    slug: "from-frontline-experience-to-strategic-leadership",
    title: "From Frontline Experience to Strategic Leadership",
    description:
      "For professionals whose credibility was earned on the frontline and who now need to lead strategically without losing what made them effective.",
    audienceOutcomes: [
      "How to translate operational credibility into strategic influence",
      "Avoiding the common traps of newly-promoted leaders",
    ],
  },
  {
    id: "topic-6",
    slug: "building-systems-that-dont-depend-on-heroic-individuals",
    title: "Building Systems That Don't Depend on Heroic Individuals",
    description:
      "Why organisations that rely on exceptional individuals are fragile — and how to design systems that make good outcomes the default.",
    audienceOutcomes: [
      "A practical audit for over-reliance on key individuals",
      "Designing processes that make good outcomes repeatable",
    ],
  },
];

export function getSpeakingTopicBySlug(slug: string): SpeakingTopic | undefined {
  return speakingTopics.find((topic) => topic.slug === slug);
}
