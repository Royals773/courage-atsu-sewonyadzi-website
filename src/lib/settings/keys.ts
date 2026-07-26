import { siteConfig } from "@/lib/content/site-config";

/**
 * site_settings is a key/value store (see the Step 4 migration). Each key
 * below holds a whole settings "group" as one JSONB object, so the admin
 * UI and storefront only ever need one row per group rather than one row
 * per field. Defaults mirror src/lib/content/site-config.ts so the site
 * looks identical until an admin actually changes something.
 */

export interface GeneralSettings {
  brandName: string;
  tagline: string;
  shortBio: string;
  logoPath: string | null;
  authorPhotoPath: string | null;
  primaryColor: string | null;
  accentColor: string | null;
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
  general: {
    brandName: siteConfig.brandName,
    tagline: siteConfig.tagline,
    shortBio: siteConfig.shortBio,
    logoPath: null,
    authorPhotoPath: null,
    primaryColor: null,
    accentColor: null,
  } satisfies GeneralSettings,
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
    defaultTitle: `${siteConfig.brandName} — Author, Speaker & Consultant`,
    defaultDescription: siteConfig.tagline,
  } satisfies SeoSettings,
  hero: {
    headline: "Helping leaders build stronger organisations, better systems and meaningful impact.",
    subheading: siteConfig.shortBio,
  } satisfies HeroSettings,
  speaking: {
    introduction:
      "[Placeholder speaker introduction — a short paragraph on speaking style, experience and the kind of events typically served.]",
    biography: siteConfig.shortBio,
    philosophy:
      "[Placeholder speaking philosophy — practical, frontline-tested ideas delivered so audiences can apply them the next day, not just feel inspired for an afternoon.]",
    audienceOutcomes: [
      "Leave with a practical framework, not just inspiration",
      "See a clear first step they can take within a week",
      "Understand how to apply the ideas within their own team or organisation",
    ],
    industries: [
      "Healthcare and care services",
      "Financial services",
      "Technology",
      "Government and public sector",
      "Education",
      "Non-profit and social enterprise",
    ],
  } satisfies SpeakingSettings,
  about: {
    heroIntro:
      "[Placeholder personal background — a few sentences on who you are, where you started, and what led to this work.]",
    professionalJourney:
      "[Placeholder — outline the professional path from frontline work through to strategic leadership, consulting, writing and speaking.]",
    leadershipExperience:
      "[Placeholder — summarise leadership roles and the kinds of organisations and teams led.]",
    motivationForWriting: "[Placeholder — why these books exist and who they were written for.]",
    speakingMission:
      "[Placeholder — what speaking work is meant to achieve for audiences and organisations.]",
    expertiseAreas: [
      "Leadership development",
      "Care quality and compliance",
      "Organisational resilience",
      "Entrepreneurship and cross-border investment",
    ],
    values: [
      "[Placeholder value — e.g. Integrity in leadership]",
      "[Placeholder value — e.g. Practical, evidence-based thinking]",
      "[Placeholder value — e.g. Building across communities and borders]",
    ],
    timeline: [
      { year: "[Year]", label: "[Placeholder milestone — e.g. started career in the care sector]" },
      { year: "[Year]", label: "[Placeholder milestone — e.g. moved into strategic leadership]" },
      { year: "[Year]", label: "[Placeholder milestone — e.g. first speaking engagement]" },
      { year: "[Year]", label: "[Placeholder milestone — e.g. first book published]" },
    ],
    achievements: [
      "[Placeholder achievement 1 — replace with a real, verifiable accomplishment.]",
      "[Placeholder achievement 2 — replace with a real, verifiable accomplishment.]",
      "[Placeholder achievement 3 — replace with a real, verifiable accomplishment.]",
    ],
    mediaBiography:
      "[Placeholder short-form biography suitable for event programmes and press use. See the Media page for the full media kit.]",
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
