import type { FaqItem } from "./types";

export const faqs: FaqItem[] = [
  {
    id: "faq-1",
    question: "How long does delivery take for physical books?",
    answer:
      "[Placeholder answer — replace with real shipping timelines once a fulfilment provider is confirmed.]",
    category: "delivery",
  },
  {
    id: "faq-2",
    question: "How do I access my eBook after purchase?",
    answer:
      "[Placeholder answer — digital downloads will be available via a secure, expiring link sent to your email after payment.]",
    category: "digital-downloads",
  },
  {
    id: "faq-3",
    question: "What is your refund policy?",
    answer:
      "[Placeholder answer — final refund terms will be published in the Refund and Returns Policy.]",
    category: "refunds",
  },
  {
    id: "faq-4",
    question: "How do I book a speaking engagement?",
    answer:
      "Use the speaking enquiry form on the Speaking page. We'll respond with availability and next steps.",
    category: "speaking-engagements",
  },
  {
    id: "faq-5",
    question: "When will courses be available?",
    answer:
      "Courses are in development. Join the priority list on the Courses page to be notified first.",
    category: "courses",
  },
];

export function getFaqsByCategory(category: FaqItem["category"]): FaqItem[] {
  return faqs.filter((f) => f.category === category);
}
