import type { Book } from "./types";

/**
 * Fictional placeholder catalogue (3 books) used until real titles are
 * supplied. Do not present these as real published works.
 */
export const books: Book[] = [
  {
    id: "book-1",
    slug: "the-quiet-architecture-of-leadership",
    title: "The Quiet Architecture of Leadership",
    subtitle: "Building organisations that outlast the people who lead them",
    description:
      "A field-tested guide to designing teams, systems and culture that hold up under pressure — for leaders who want their organisation to work even when they're not in the room.",
    authorNote:
      "[Placeholder author's note — replace with a short, personal reflection on why this book was written.]",
    coverImageLabel: "Book cover placeholder — The Quiet Architecture of Leadership",
    categories: ["leadership", "business"],
    formats: [
      { id: "b1-paperback", type: "paperback", label: "Paperback", price: 16.99, currency: "GBP", isDigital: false, stockStatus: "in-stock" },
      { id: "b1-ebook", type: "ebook", label: "eBook", price: 9.99, currency: "GBP", isDigital: true, stockStatus: "in-stock" },
      { id: "b1-signed", type: "signed", label: "Signed Paperback", price: 24.99, currency: "GBP", isDigital: false, stockStatus: "low-stock" },
    ],
    publicationDate: "2025-03-01",
    featured: true,
    isNew: true,
    ratingPlaceholder: true,
    keyLessons: [
      "How to design decisions systems instead of relying on heroics",
      "Building accountability without fear",
      "Turning frontline insight into strategic change",
    ],
    whoItsFor: [
      "Business owners scaling past founder-led operations",
      "Care-sector leaders responsible for quality and compliance",
      "Managers stepping into their first strategic leadership role",
    ],
    tableOfContents: [
      { title: "1. The Cost of Heroic Leadership" },
      { title: "2. Systems, Not Saviours" },
      { title: "3. Culture as Infrastructure" },
      { title: "4. Accountability Without Fear" },
      { title: "5. Leading Through Pressure" },
    ],
    hasSampleChapter: true,
  },
  {
    id: "book-2",
    slug: "frontline-to-boardroom",
    title: "Frontline to Boardroom",
    subtitle: "A practical playbook for care-sector leaders moving into strategy",
    description:
      "Written for professionals who earned their expertise on the frontline and are now navigating the very different demands of strategic leadership and quality governance.",
    authorNote:
      "[Placeholder author's note — replace with a short, personal reflection on why this book was written.]",
    coverImageLabel: "Book cover placeholder — Frontline to Boardroom",
    categories: ["care-quality", "leadership"],
    formats: [
      { id: "b2-hardcover", type: "hardcover", label: "Hardcover", price: 21.99, currency: "GBP", isDigital: false, stockStatus: "in-stock" },
      { id: "b2-ebook", type: "ebook", label: "eBook", price: 11.99, currency: "GBP", isDigital: true, stockStatus: "in-stock" },
    ],
    publicationDate: "2024-06-10",
    featured: true,
    isNew: false,
    ratingPlaceholder: true,
    keyLessons: [
      "Translating operational excellence into strategic credibility",
      "Building a culture of quality and accountability",
      "Managing regulatory relationships with confidence",
    ],
    whoItsFor: [
      "Care-sector managers moving into senior leadership",
      "Quality and compliance leads",
      "Anyone leading a team through a CQC or regulatory transition",
    ],
    tableOfContents: [
      { title: "1. Two Different Jobs" },
      { title: "2. Earning Strategic Trust" },
      { title: "3. Quality as a Leadership Discipline" },
      { title: "4. Regulators as Partners" },
    ],
    hasSampleChapter: true,
  },
  {
    id: "book-3",
    slug: "the-opportunity-in-between",
    title: "The Opportunity In Between",
    subtitle: "Notes on entrepreneurship, investment and building across borders",
    description:
      "An exploration of the practical realities — and real opportunities — of building businesses and investing between the UK, Ghana and wider Africa.",
    authorNote:
      "[Placeholder author's note — replace with a short, personal reflection on why this book was written.]",
    coverImageLabel: "Book cover placeholder — The Opportunity In Between",
    categories: ["entrepreneurship", "africa-investment"],
    formats: [
      { id: "b3-paperback", type: "paperback", label: "Paperback", price: 15.99, currency: "GBP", isDigital: false, stockStatus: "preorder" },
      { id: "b3-ebook", type: "ebook", label: "eBook", price: 8.99, currency: "GBP", isDigital: true, stockStatus: "preorder" },
      { id: "b3-bundle", type: "bundle", label: "Book Bundle (all 3 titles)", price: 39.99, currency: "GBP", isDigital: false, stockStatus: "preorder" },
    ],
    publicationDate: "2026-01-15",
    featured: true,
    isNew: true,
    ratingPlaceholder: true,
    keyLessons: [
      "Spotting genuine opportunity versus hype",
      "Building trust-based cross-border partnerships",
      "Practical steps for first-time diaspora investors",
    ],
    whoItsFor: [
      "Aspiring entrepreneurs exploring African markets",
      "Diaspora professionals considering their first investment",
      "Community leaders building cross-border initiatives",
    ],
    tableOfContents: [
      { title: "1. Two Markets, One Mindset" },
      { title: "2. Due Diligence Across Borders" },
      { title: "3. Trust as Currency" },
      { title: "4. Starting Small, Thinking Long" },
    ],
    hasSampleChapter: false,
  },
];

export function getFeaturedBooks(): Book[] {
  return books.filter((book) => book.featured);
}

export function getBookBySlug(slug: string): Book | undefined {
  return books.find((book) => book.slug === slug);
}
