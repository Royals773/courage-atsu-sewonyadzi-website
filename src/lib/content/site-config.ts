import type { NavItem } from "./types";

/**
 * Single source of truth for brand-level copy. Replace the placeholder
 * strings below with real brand details before launch — nothing here should
 * be treated as final copy.
 */
export const siteConfig = {
  brandName: "[Your Name]",
  tagline: "[Your tagline goes here]",
  shortBio:
    "[A one-sentence description of who you are and who you help — placeholder copy until final bio is supplied.]",
  domain: "yourdomain.com",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  contactEmail: "hello@yourdomain.com",
  speakingEmail: "speaking@yourdomain.com",
  mediaEmail: "media@yourdomain.com",
  social: {
    linkedin: "https://linkedin.com/in/your-handle",
    instagram: "https://instagram.com/your-handle",
    x: "https://x.com/your-handle",
    youtube: "https://youtube.com/@your-handle",
  },
} as const;

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Books", href: "/books" },
  { label: "Speaking", href: "/speaking" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
  { label: "Courses", href: "/courses" },
  { label: "Media", href: "/media" },
  { label: "Contact", href: "/contact" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Explore",
    items: mainNav,
  },
  {
    title: "Shop",
    items: [
      { label: "All Books", href: "/books" },
      { label: "Basket", href: "/basket" },
      { label: "Book Me to Speak", href: "/speaking/enquiry" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "Testimonials", href: "/testimonials" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
      { label: "Media Kit", href: "/media-kit" },
      { label: "Video Library", href: "/videos" },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Privacy Policy", href: "/legal/privacy-policy" },
      { label: "Terms & Conditions", href: "/legal/terms-conditions" },
      { label: "Cookie Policy", href: "/legal/cookie-policy" },
      { label: "Accessibility Statement", href: "/legal/accessibility-statement" },
    ],
  },
];

