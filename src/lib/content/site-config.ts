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
    "Author | International Keynote Speaker | Leadership Strategist | Entrepreneur | Governance & Transformation Advisor",
  tagline: "Leading Change. Building Excellence. Inspiring People.",
  shortBio:
    "Courage Atsu Sewonyadzi helps leaders across business, public service, education and beyond build organisations people trust, cultures where people thrive, and systems that create lasting impact.",
  longBiography:
    "Courage Atsu Sewonyadzi is an author, keynote speaker, leadership strategist and entrepreneur working across leadership, organisational culture, strategy, governance and entrepreneurship — with recognised expertise in adult social care and a long-standing interest in Africa's economic development.\n\n" +
    "[Placeholder — a paragraph on professional background and the range of leadership roles and sectors that underpin this work. Content pending final approval.]\n\n" +
    "[Placeholder — a paragraph on the books, speaking practice and consulting work, including the kinds of organisations and audiences typically served. Content pending final approval.]",
  mission:
    "[Draft — pending your review] To equip leaders with the thinking, systems and practical strategies they need to build organisations that people trust, cultures where people thrive, and institutions that create lasting impact.",
  vision:
    "[Draft — pending your review] A future in which leaders across business, public service, education and community life build institutions strong enough to outlast them and trusted enough to be worth the effort — with Africa's own leaders and enterprises recognised among the world's best.",
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
