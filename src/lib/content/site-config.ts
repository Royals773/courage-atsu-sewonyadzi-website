import type { NavItem } from "./types";

/**
 * Single central source of truth for brand-level copy and identity. The
 * admin-editable "brand" settings group (src/lib/settings/keys.ts,
 * site_settings table, /admin/settings) overrides these at runtime — this
 * file only supplies the defaults/fallbacks. Update copy here rather than
 * hardcoding brand strings in components.
 *
 * Real facts (career history, achievements, contact details, social
 * handles) are still placeholders pending the client's confirmation —
 * see PRODUCTION_CHECKLIST.md.
 */
export const siteConfig = {
  fullName: "Courage Atsu Sewonyadzi",
  displayName: "Courage Atsu Sewonyadzi",
  initials: "CAS",
  positioningStatement:
    "Author | Keynote Speaker | Adult Social Care Strategist | Entrepreneur",
  tagline: "Strategic leadership for adult social care and beyond.",
  shortBio:
    "Courage Atsu Sewonyadzi helps leaders and organisations in adult social care build stronger systems, sound strategy and lasting impact.",
  longBiography:
    "Courage Atsu Sewonyadzi is an author, keynote speaker, adult social care strategist and entrepreneur.\n\n" +
    "[Placeholder — a paragraph on professional background and the specific experience in adult social care leadership that underpins this work. Content pending final approval.]\n\n" +
    "[Placeholder — a paragraph on the books, speaking practice and consulting work, including the kinds of organisations and audiences typically served. Content pending final approval.]",
  mission:
    "[Draft — pending your review] To equip leaders in adult social care and beyond with the strategic clarity, sound systems and confidence to build organisations that last.",
  vision:
    "[Draft — pending your review] A future where care organisations are led with the same rigour, integrity and ambition as any world-class enterprise.",
  domain: "courageatsusewonyadzi.com",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  contactEmail: "hello@courageatsusewonyadzi.com",
  speakingEmail: "speaking@courageatsusewonyadzi.com",
  mediaEmail: "media@courageatsusewonyadzi.com",
  phone: "",
  location: "",
  emailSenderName: "Courage Atsu Sewonyadzi",
  copyrightName: "Courage Atsu Sewonyadzi",
  social: {
    linkedin: "https://linkedin.com/in/courage-atsu-sewonyadzi",
    instagram: "https://instagram.com/courageatsusewonyadzi",
    x: "https://x.com/courageasewonyadzi",
    youtube: "https://youtube.com/@courageatsusewonyadzi",
  },
  /** Static fallback brand assets, used until an admin uploads a replacement via /admin/settings. */
  assets: {
    logoPrimary: "/brand/logo-primary.svg",
    logoHorizontal: "/brand/logo-horizontal.svg",
    monogram: "/brand/monogram.svg",
    icon: "/brand/icon.svg",
    logoWhite: "/brand/logo-white.svg",
    logoBlack: "/brand/logo-black.svg",
    favicon: "/brand/favicon.svg",
    ogDefault: "/brand/og-default.png",
    appleTouchIcon: "/brand/apple-touch-icon.png",
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
