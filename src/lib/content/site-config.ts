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
  tagline: "Leadership that moves nations forward.",
  shortBio:
    "Courage Atsu Sewonyadzi is an internationally recognised leadership thinker, keynote speaker, author and entrepreneur. His work spans governance, regulation, organisational culture, strategy, execution and transformation — helping leaders and institutions move from good intentions to lasting results.",
  longBiography:
    "Courage Atsu Sewonyadzi is an internationally recognised leadership thinker, keynote speaker, author and entrepreneur, working at the intersection of governance, regulation, organisational culture, strategy, execution and transformation. His positioning extends across sectors — business, public service, education and beyond — with adult social care standing as one proving ground among several where his leadership thinking has been tested and demonstrated in practice.\n\n" +
    "His work is built on a single conviction: that most organisations do not fail from a shortage of good ideas, but from the gap between deciding and doing. Across boardrooms, public institutions and growing enterprises, he works with leaders to close that gap — building the governance structures, the culture and the execution discipline that turn strategy into results that last.\n\n" +
    "[Placeholder — a paragraph on specific career milestones, roles held, and organisations led or advised. Content pending your review and confirmation.]\n\n" +
    "As an author and keynote speaker, his books and platform talks bring the same practical, execution-first thinking to audiences and readers navigating change of their own — in leadership, in governance, and in building institutions strong enough to outlast the people who founded them.",
  mission:
    "To equip leaders and institutions with the governance, culture and execution capability to turn bold strategy into lasting results — and to prove, in the process, that world-class leadership can be built anywhere, including in the sectors and geographies too often overlooked.",
  vision:
    "A future in which institutions — in business, government and public life — are led with enough discipline to execute, enough integrity to be trusted, and enough vision to outlast the leaders who built them; and in which leadership from Africa and its diaspora is recognised among the world's best, not as an exception but as a standard.",
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
    logoVertical: "/brand/logo-vertical.svg",
    monogram: "/brand/monogram.svg",
    icon: "/brand/icon.svg",
    iconTransparent: "/brand/icon-transparent.svg",
    socialProfileIcon: "/brand/social-profile-icon.svg",
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
