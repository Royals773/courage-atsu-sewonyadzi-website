/**
 * Shared content types.
 *
 * These interfaces mirror the shape of the Supabase tables that will back
 * this content from Phase 2 onward (see the project plan's "Database design"
 * section: books, book_formats, speaking_topics, testimonials, blog_posts,
 * course_interest, faq_items, media_items, site_settings). Keeping the shape
 * identical means components built against this static data won't need to
 * change when the data source moves from a local array to a Supabase query.
 */

export type BookCategory =
  | "leadership"
  | "business"
  | "personal-development"
  | "care-quality"
  | "entrepreneurship"
  | "africa-investment";

export type BookFormatType =
  | "paperback"
  | "hardcover"
  | "ebook"
  | "audiobook"
  | "signed"
  | "bundle";

export type StockStatus = "in-stock" | "low-stock" | "preorder" | "out-of-stock";

export interface BookFormat {
  id: string;
  type: BookFormatType;
  label: string;
  price: number;
  currency: "GBP";
  isDigital: boolean;
  stockStatus: StockStatus;
}

export interface TableOfContentsEntry {
  title: string;
}

export interface Book {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  authorNote: string;
  coverImageLabel: string;
  categories: BookCategory[];
  formats: BookFormat[];
  publicationDate: string;
  featured: boolean;
  isNew: boolean;
  ratingPlaceholder: true;
  keyLessons: string[];
  whoItsFor: string[];
  tableOfContents: TableOfContentsEntry[];
  hasSampleChapter: boolean;
}

export interface SpeakingTopic {
  id: string;
  slug: string;
  title: string;
  description: string;
  audienceOutcomes: string[];
}

export type TestimonialCategory =
  | "book-review"
  | "speaking"
  | "consulting"
  | "event-organiser"
  | "media";

export interface Testimonial {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string;
  organisation: string;
  category: TestimonialCategory;
  featured: boolean;
  isFictionalPlaceholder: true;
}

export type BlogCategory =
  | "leadership"
  | "adult-social-care"
  | "business"
  | "entrepreneurship"
  | "personal-growth"
  | "investment"
  | "africa"
  | "technology";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  author: string;
  publishedAt: string;
  readingTimeMinutes: number;
  featured: boolean;
}

export type CourseCategory =
  | "leadership"
  | "care-quality"
  | "entrepreneurship";

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: CourseCategory;
  format: "free" | "paid";
  status: "coming-soon";
}

export type FaqCategory =
  | "book-orders"
  | "delivery"
  | "digital-downloads"
  | "refunds"
  | "speaking-engagements"
  | "travel"
  | "courses"
  | "media-enquiries"
  | "general-enquiries";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
}

export type MediaItemType = "press" | "podcast" | "interview" | "video";

export interface MediaItem {
  id: string;
  type: MediaItemType;
  title: string;
  outlet: string;
  date: string;
  description: string;
  isFictionalPlaceholder: true;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface CredibilityStat {
  label: string;
  valuePlaceholder: string;
}

export interface LegalPageSection {
  heading: string;
  body: string[];
}

export interface LegalPage {
  slug: string;
  title: string;
  sections: LegalPageSection[];
}
