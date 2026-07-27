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
  /**
   * Alternative premium taglines an admin can copy into the `tagline`
   * field above to switch the live tagline without any code change.
   */
  taglineAlternatives: string[];
  shortBio: string;
  longBiography: string;
  mission: string;
  vision: string;
  phone: string;
  location: string;
  emailSenderName: string;
  copyrightName: string;
  logoPath: string | null;
  /** Optional variants prepared for future light/dark-aware rendering. */
  logoLightPath: string | null;
  logoDarkPath: string | null;
  monogramPath: string | null;
  authorPhotoPath: string | null;
  ogImagePath: string | null;
  faviconPath: string | null;
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
  /** Left empty until real, verifiable awards exist — never fabricated. */
  awards: string[];
  mediaBiography: string;
}

export interface NewsletterSettings {
  headline: string;
  description: string;
  consentText: string;
}

export interface CtaSettings {
  headline: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
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
    taglineAlternatives: [
      "Leading Change. Building Excellence. Inspiring People.",
      "Leadership That Transforms. Strategy That Endures.",
      "Building Institutions Worth Trusting.",
      "Strategy, Governance and the Courage to Lead.",
      "Where Leadership Meets Lasting Impact.",
      "Practical Leadership for a Changing World.",
      "Turning Vision Into Institutions That Last.",
      "Leadership, Reimagined for Real Organisations.",
      "Excellence in Leadership. Integrity in Practice.",
      "Shaping Leaders. Transforming Organisations.",
      "From Insight to Impact — Leadership That Delivers.",
    ],
    shortBio: siteConfig.shortBio,
    longBiography: siteConfig.longBiography,
    mission: siteConfig.mission,
    vision: siteConfig.vision,
    phone: siteConfig.phone,
    location: siteConfig.location,
    emailSenderName: siteConfig.emailSenderName,
    copyrightName: siteConfig.copyrightName,
    logoPath: null,
    logoLightPath: null,
    logoDarkPath: null,
    monogramPath: null,
    authorPhotoPath: null,
    ogImagePath: null,
    faviconPath: null,
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
    headline: "Building the leaders, institutions and ideas that move nations forward.",
    subheading:
      "An internationally recognised leadership thinker, keynote speaker, author and strategist — working across governance, regulation, organisational culture, strategy and transformation to help institutions execute with clarity and lead with conviction.",
  } satisfies HeroSettings,
  speaking: {
    introduction:
      "Courage Atsu Sewonyadzi speaks to leaders who are done with inspiration that doesn't survive the drive home. His sessions are built around one idea: that leadership, governance and transformation are practical disciplines, not personality traits — and that any room, given the right framework, can leave with a plan it can start using immediately.",
    biography:
      "Courage Atsu Sewonyadzi is an internationally recognised leadership thinker, keynote speaker, author and entrepreneur. He speaks on leadership, governance, organisational culture, strategy, execution and transformation to audiences across business, public service, education and beyond — bringing frameworks tested in real institutions, not slides built for effect.",
    philosophy:
      "A talk is only as good as what a leader does with it on Monday morning. Every keynote and workshop is built around practical frameworks — for governance, culture, execution and change — that a room can start applying before the applause has finished, because inspiration that doesn't survive the drive home was never the point.",
    audienceOutcomes: [
      "Leave with a practical framework, not just inspiration",
      "See a clear first step they can take within a week",
      "Understand how to apply the ideas within their own team, institution or organisation",
      "Gain a shared language for governance, culture and execution across their leadership team",
    ],
    industries: [
      "Business and entrepreneurship",
      "Government and public institutions",
      "Governance, regulatory and compliance-led organisations",
      "Education",
      "Healthcare and adult social care",
      "Non-profit and community organisations",
      "Technology and AI-driven organisations",
    ],
  } satisfies SpeakingSettings,
  about: {
    heroIntro:
      "I did not arrive at leadership through theory. I arrived at it through rooms where the stakes were real — where regulatory scrutiny, organisational strain and the expectations of the people we served left no space for ideas that only sounded good. This is the work that shaped how I think about leadership, governance and change: practical first, provable always.",
    professionalJourney:
      "My path into leadership was not planned as a straight line from certainty to certainty. It was built sector by sector — each one testing a different part of what leadership actually requires: the discipline of governance and regulation, the patience of culture change, the nerve of strategic execution, and the humility to keep learning what leading people, under pressure, really demands.\n\n" +
      "[Placeholder — outline the specific roles, sectors and turning points in your professional path. Content pending your review and confirmation.]",
    leadershipExperience:
      "Across every organisation I have led or advised, the pattern has been the same: the leaders who succeed are not the ones with the most confident plan, but the ones who build the systems, culture and governance to see that plan through when circumstances change. That is the leadership I practise, and the leadership I teach.\n\n" +
      "[Placeholder — summarise the specific organisations, teams and scale of leadership roles held. Content pending your review and confirmation.]",
    lessonsLearned:
      "The most expensive lessons in leadership are rarely about strategy. They are about people, timing, and the discipline to keep governance and culture strong when performance is under pressure — because that is exactly when both are tested hardest. Trust, once spent, is the most expensive thing an institution can try to rebuild, and the leaders who protect it deliberately are the ones whose organisations outlast them.",
    motivationForWriting:
      "I write because the leaders I meet in boardrooms and public institutions are asking the same questions I once had to answer without a map: how do you govern well under pressure, build a culture that holds, and execute a strategy that survives contact with reality? My books exist to give those leaders the frameworks I had to build the hard way — tested in practice, not just in theory.",
    speakingMission:
      "When I take a stage, my aim is simple: every audience should leave with something they can use before they've even left the building — not just a feeling, but a framework. Leadership, governance and transformation are not abstract subjects to me; they are working disciplines, and I speak about them the way a practitioner does, not the way a theorist does.",
    expertiseAreas: [
      "Leadership and organisational strategy",
      "Governance, regulation and institutional integrity",
      "Organisational culture and change management",
      "Strategic execution and delivery",
      "Innovation and transformation",
      "Entrepreneurship and business growth",
      "Adult social care and public service leadership",
      "Community and economic development across Africa",
    ],
    values: [
      "Governance and integrity before growth for its own sake",
      "Execution as the true test of strategy",
      "Culture as a system to be built, not a slogan to be repeated",
      "Leadership that transfers — building people and institutions that outlast any one leader",
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
    awards: [],
    mediaBiography:
      "Courage Atsu Sewonyadzi is an internationally recognised leadership thinker, keynote speaker, author and entrepreneur, working across governance, regulation, organisational culture, strategy and transformation. He speaks and writes on what it takes to lead institutions that execute under pressure and outlast the people who built them.\n\n" +
      "[Placeholder — add specific credentials, notable engagements or affiliations once confirmed.] For interview requests and full media assets, see the Media page.",
  } satisfies AboutSettings,
  newsletter: {
    headline: "Get the free guide: 5 Systems Every Leader Needs",
    description:
      "Join the mailing list for occasional insights on leadership, strategy and building organisations that last — plus the free guide as a welcome gift.",
    consentText:
      "I agree to receive emails and understand I can unsubscribe at any time.",
  } satisfies NewsletterSettings,
  cta: {
    headline: "Ready to move your organisation forward?",
    description:
      "Whether you're looking for a keynote speaker, a leadership strategist, or your next read on governance and transformation, it starts here.",
    primaryLabel: "Buy a Book",
    secondaryLabel: "Book a Speaking Engagement",
  } satisfies CtaSettings,
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
