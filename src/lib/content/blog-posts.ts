import type { BlogPost } from "./types";

/**
 * Fictional placeholder articles (6) for layout and IA purposes.
 */
export const blogPosts: BlogPost[] = [
  {
    id: "post-1",
    slug: "the-quiet-work-of-good-leadership",
    title: "The Quiet Work of Good Leadership",
    excerpt:
      "Most leadership advice focuses on the visible moments. The real work happens somewhere else entirely.",
    content: "[Placeholder article content — replace with final copy.]",
    category: "leadership",
    author: "[Your Name]",
    publishedAt: "2026-07-10",
    readingTimeMinutes: 6,
    featured: true,
  },
  {
    id: "post-2",
    slug: "what-care-quality-really-depends-on",
    title: "What Care Quality Really Depends On",
    excerpt:
      "Compliance checklists matter, but they aren't where quality actually comes from.",
    content: "[Placeholder article content — replace with final copy.]",
    category: "adult-social-care",
    author: "[Your Name]",
    publishedAt: "2026-06-28",
    readingTimeMinutes: 8,
    featured: true,
  },
  {
    id: "post-3",
    slug: "three-questions-before-your-next-cross-border-investment",
    title: "Three Questions Before Your Next Cross-Border Investment",
    excerpt:
      "A short framework for evaluating opportunities between the UK and African markets.",
    content: "[Placeholder article content — replace with final copy.]",
    category: "investment",
    author: "[Your Name]",
    publishedAt: "2026-06-15",
    readingTimeMinutes: 5,
    featured: true,
  },
  {
    id: "post-4",
    slug: "why-founder-led-businesses-stall",
    title: "Why Founder-Led Businesses Stall",
    excerpt:
      "The habits that make a founder successful early on are often the same habits that cap growth later.",
    content: "[Placeholder article content — replace with final copy.]",
    category: "business",
    author: "[Your Name]",
    publishedAt: "2026-05-30",
    readingTimeMinutes: 7,
    featured: false,
  },
  {
    id: "post-5",
    slug: "personal-development-is-not-a-side-project",
    title: "Personal Development Is Not a Side Project",
    excerpt:
      "Treating your own growth as optional is one of the quietest ways leaders limit their organisations.",
    content: "[Placeholder article content — replace with final copy.]",
    category: "personal-growth",
    author: "[Your Name]",
    publishedAt: "2026-05-12",
    readingTimeMinutes: 4,
    featured: false,
  },
  {
    id: "post-6",
    slug: "building-in-ghana-lessons-from-the-ground",
    title: "Building in Ghana: Lessons From the Ground",
    excerpt:
      "Notes from the field on what actually helps entrepreneurs succeed when building in Ghana.",
    content: "[Placeholder article content — replace with final copy.]",
    category: "africa",
    author: "[Your Name]",
    publishedAt: "2026-04-22",
    readingTimeMinutes: 9,
    featured: false,
  },
];

export function getFeaturedPost(): BlogPost {
  return blogPosts.find((p) => p.featured) ?? blogPosts[0];
}

export function getLatestPosts(count: number): BlogPost[] {
  return [...blogPosts]
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
    .slice(0, count);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
