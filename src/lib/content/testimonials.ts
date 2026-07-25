import type { Testimonial } from "./types";

/**
 * Fictional placeholder testimonials (6). These are clearly-marked samples
 * for layout purposes and must never be presented as real endorsements.
 */
export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "[Placeholder testimonial] This book gave our leadership team a shared language for accountability we'd been missing for years.",
    authorName: "Sample Reader",
    authorRole: "Operations Director",
    organisation: "Fictional Care Group",
    category: "book-review",
    featured: true,
    isFictionalPlaceholder: true,
  },
  {
    id: "t2",
    quote:
      "[Placeholder testimonial] Our delegates are still talking about this session months later. Exactly the balance of challenge and warmth we needed.",
    authorName: "Sample Organiser",
    authorRole: "Head of Events",
    organisation: "Fictional Leadership Conference",
    category: "event-organiser",
    featured: true,
    isFictionalPlaceholder: true,
  },
  {
    id: "t3",
    quote:
      "[Placeholder testimonial] The consulting engagement paid for itself within the first quarter — practical, not theoretical.",
    authorName: "Sample Client",
    authorRole: "Managing Director",
    organisation: "Fictional Business Ltd",
    category: "consulting",
    featured: true,
    isFictionalPlaceholder: true,
  },
  {
    id: "t4",
    quote:
      "[Placeholder testimonial] As a care-sector leader, I finally felt like someone was speaking directly to the pressure we're under.",
    authorName: "Sample Manager",
    authorRole: "Registered Manager",
    organisation: "Fictional Care Home",
    category: "speaking",
    featured: true,
    isFictionalPlaceholder: true,
  },
  {
    id: "t5",
    quote:
      "[Placeholder testimonial] A rare speaker who is equally credible in the boardroom and on the frontline.",
    authorName: "Sample Attendee",
    authorRole: "Conference Delegate",
    organisation: "Fictional Industry Summit",
    category: "speaking",
    featured: false,
    isFictionalPlaceholder: true,
  },
  {
    id: "t6",
    quote:
      "[Placeholder testimonial] Thoughtful, well-researched, and refreshingly honest about the realities of building across borders.",
    authorName: "Sample Reviewer",
    authorRole: "Podcast Host",
    organisation: "Fictional Media Outlet",
    category: "media",
    featured: false,
    isFictionalPlaceholder: true,
  },
];

export function getFeaturedTestimonials(): Testimonial[] {
  return testimonials.filter((t) => t.featured);
}
