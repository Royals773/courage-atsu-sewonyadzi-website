import { siteConfig } from "@/lib/content/site-config";

/**
 * site_settings is a key/value store (see the Step 4 migration). Each key
 * below holds a whole settings "group" as one JSONB object, so the admin
 * UI and storefront only ever need one row per group rather than one row
 * per field. Defaults mirror src/lib/content/site-config.ts so the site
 * looks identical until an admin actually changes something.
 */

export type HeadingFontOption = "fraunces" | "playfair-display";
export type BodyFontOption = "inter" | "source-sans-3";

/**
 * The dedicated Brand Settings group — identity, positioning, contact
 * details, logo/asset overrides, and design tokens. This is the
 * admin-editable layer on top of the static defaults in
 * src/lib/content/site-config.ts (see that file's fallback logic).
 */
export interface BrandSettings {
  fullName: string;
  displayName: string;
  initials: string;
  positioningStatement: string;
  tagline: string;
  shortBio: string;
  longBiography: string;
  mission: string;
  vision: string;
  phone: string;
  location: string;
  emailSenderName: string;
  copyrightName: string;
  logoPath: string | null;
  monogramPath: string | null;
  authorPhotoPath: string | null;
  ogImagePath: string | null;
  primaryColor: string | null;
  accentColor: string | null;
  secondaryColor: string | null;
  headingFont: HeadingFontOption;
  bodyFont: BodyFontOption;
}

export interface ContactSettings {
  email: string;
  speakingEmail: string;
  mediaEmail: string;
}

export interface SocialSettings {
  linkedin: string;
  instagram: string;
  youtube: string;
  x: string;
}

export interface SeoSettings {
  defaultTitle: string;
  defaultDescription: string;
}

export interface HeroSettings {
  headline: string;
  subheading: string;
}

export interface SpeakingSettings {
  introduction: string;
  biography: string;
  philosophy: string;
  audienceOutcomes: string[];
  industries: string[];
}

export interface AboutSettings {
  heroIntro: string;
  professionalJourney: string;
  leadershipExperience: string;
  lessonsLearned: string;
  motivationForWriting: string;
  speakingMission: string;
  expertiseAreas: string[];
  values: string[];
  timeline: { year: string; label: string }[];
  achievements: string[];
  mediaBiography: string;
}

/**
 * Homepage "credibility" stats and the speaking-page stats strip. Values
 * are free text (not numbers) so they can hold "[X]+" style placeholders
 * until real figures are supplied — see saveCredibilitySettingsAction.
 */
export interface CredibilitySettings {
  yearsExperience: string;
  peopleReached: string;
  organisationsSupported: string;
  booksPublished: string;
  speakingEngagements: string;
  countriesReached: string;
  eventsDelivered: string;
  countriesSpokenIn: string;
  audienceReached: string;
  clientSatisfaction: string;
}

export const SETTINGS_DEFAULTS = {
  brand: {
    fullName: siteConfig.fullName,
    displayName: siteConfig.displayName,
    initials: siteConfig.initials,
    positioningStatement: siteConfig.positioningStatement,
    tagline: siteConfig.tagline,
    shortBio: siteConfig.shortBio,
    longBiography: siteConfig.longBiography,
    mission: siteConfig.mission,
    vision: siteConfig.vision,
    phone: siteConfig.phone,
    location: siteConfig.location,
    emailSenderName: siteConfig.emailSenderName,
    copyrightName: siteConfig.copyrightName,
    logoPath: null,
    monogramPath: null,
    authorPhotoPath: null,
    ogImagePath: null,
    primaryColor: null,
    accentColor: null,
    secondaryColor: null,
    headingFont: "fraunces",
    bodyFont: "inter",
  } satisfies BrandSettings,
  contact: {
    email: siteConfig.contactEmail,
    speakingEmail: siteConfig.speakingEmail,
    mediaEmail: siteConfig.mediaEmail,
  } satisfies ContactSettings,
  social: {
    linkedin: siteConfig.social.linkedin,
    instagram: siteConfig.social.instagram,
    youtube: siteConfig.social.youtube,
    x: siteConfig.social.x,
  } satisfies SocialSettings,
  seo: {
    defaultTitle: `${siteConfig.fullName} — ${siteConfig.positioningStatement}`,
    defaultDescription: siteConfig.tagline,
  } satisfies SeoSettings,
  hero: {
    headline: "Helping leaders build better organisations, stronger cultures and lasting impact.",
    subheading:
      "An author, keynote speaker and leadership strategist working across business, public service, education and adult social care — helping organisations build stronger leadership, culture and systems.",
  } satisfies HeroSettings,
  speaking: {
    introduction:
      "[Placeholder speaker introduction — a short paragraph on speaking style, experience and the kind of events typically served, across leadership, strategy and organisational culture.]",
    biography: siteConfig.shortBio,
    philosophy:
      "[Placeholder speaking philosophy — practical, frontline-tested ideas delivered so audiences can apply them the next day, not just feel inspired for an afternoon.]",
    audienceOutcomes: [
      "Leave with a practical framework, not just inspiration",
      "See a clear first step they can take within a week",
      "Understand how to apply the ideas within their own team or organisation",
    ],
    industries: [
      "Business and entrepreneurship",
      "Public service and government",
      "Education",
      "Healthcare and adult social care",
      "Non-profit and community organisations",
      "Technology and AI-driven organisations",
    ],
  } satisfies SpeakingSettings,
  about: {
    heroIntro:
      "[Placeholder personal background — a few sentences on who you are, where you started, and what led to this work across leadership, business and public service. Content pending final approval.]",
    professionalJourney:
      "[Placeholder — outline the professional path from frontline experience through to strategic leadership, consulting, writing and speaking across sectors. Content pending final approval.]",
    leadershipExperience:
      "[Placeholder — summarise leadership roles and the kinds of organisations and teams led. Content pending final approval.]",
    lessonsLearned:
      "[Placeholder — the practical lessons learned leading real organisations through real pressure, in your own words. Content pending final approval.]",
    motivationForWriting: "[Placeholder — why these books exist and who they were written for. Content pending final approval.]",
    speakingMission:
      "[Placeholder — what speaking work is meant to achieve for audiences and organisations. Content pending final approval.]",
    expertiseAreas: [
      "Leadership and organisational strategy",
      "Organisational culture and governance",
      "Entrepreneurship and business growth",
      "AI-enabled transformation",
      "Adult social care and public service",
      "Community and economic development across Africa",
    ],
    values: [
      "[Placeholder value — e.g. Integrity in leadership]",
      "[Placeholder value — e.g. Practical, evidence-based thinking]",
      "[Placeholder value — e.g. Building across communities and borders]",
    ],
    timeline: [
      { year: "[Year]", label: "[Placeholder milestone — e.g. started career in adult social care]" },
      { year: "[Year]", label: "[Placeholder milestone — e.g. moved into strategic leadership]" },
      { year: "[Year]", label: "[Placeholder milestone — e.g. first speaking engagement]" },
      { year: "[Year]", label: "[Placeholder milestone — e.g. first book published]" },
    ],
    achievements: [
      "Content pending final approval — replace with a real, verifiable accomplishment.",
      "Content pending final approval — replace with a real, verifiable accomplishment.",
      "Content pending final approval — replace with a real, verifiable accomplishment.",
    ],
    mediaBiography:
      "[Placeholder short-form biography suitable for event programmes and press use. See the Media page for the full media kit. Content pending final approval.]",
  } satisfies AboutSettings,
  credibility: {
    yearsExperience: "[X]+",
    peopleReached: "[X]",
    organisationsSupported: "[X]",
    booksPublished: "[X]",
    speakingEngagements: "[X]",
    countriesReached: "[X]",
    eventsDelivered: "[X]+",
    countriesSpokenIn: "[X]+",
    audienceReached: "[X],000+",
    clientSatisfaction: "[X]%",
  } satisfies CredibilitySettings,
} as const;

export type SettingsKey = keyof typeof SETTINGS_DEFAULTS;
