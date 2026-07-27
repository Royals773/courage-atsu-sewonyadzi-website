"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdminAction } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SettingsKey } from "@/lib/settings/keys";
import type { Json } from "@/lib/supabase/database.types";

async function saveSettingGroup(key: SettingsKey, value: Record<string, unknown>): Promise<void> {
  const session = await requireAdminAction("administrator");
  const admin = createAdminClient();
  const { error } = await admin
    .from("site_settings")
    .upsert({ key, value: value as Json, updated_by: session.userId }, { onConflict: "key" });
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}

/** Accepts empty, a hex colour (#rgb/#rrggbb), or an oklch()/rgb()/hsl() CSS colour function. */
const colorSchema = z
  .string()
  .trim()
  .refine(
    (value) =>
      value === "" ||
      /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value) ||
      /^(oklch|rgb|rgba|hsl|hsla)\([^)]+\)$/i.test(value),
    { message: "Enter a hex colour (#rrggbb) or a CSS colour function like oklch(...)." }
  );

/** Accepts empty or a well-formed absolute URL. */
const urlSchema = z
  .string()
  .trim()
  .refine((value) => value === "" || z.string().url().safeParse(value).success, {
    message: "Enter a full URL, e.g. https://example.com/you",
  });

function parseColor(formData: FormData, field: string): string | null {
  const raw = String(formData.get(field) ?? "").trim();
  const result = colorSchema.safeParse(raw);
  if (!result.success) throw new Error(`${field}: ${result.error.issues[0]?.message}`);
  return result.data || null;
}

function parseUrl(formData: FormData, field: string): string {
  const raw = String(formData.get(field) ?? "").trim();
  const result = urlSchema.safeParse(raw);
  if (!result.success) throw new Error(`${field}: ${result.error.issues[0]?.message}`);
  return result.data;
}

const HEADING_FONTS = ["fraunces", "playfair-display"] as const;
const BODY_FONTS = ["inter", "source-sans-3"] as const;

export async function saveBrandSettingsAction(formData: FormData): Promise<void> {
  const headingFont = z.enum(HEADING_FONTS).safeParse(formData.get("headingFont")).data ?? "fraunces";
  const bodyFont = z.enum(BODY_FONTS).safeParse(formData.get("bodyFont")).data ?? "inter";

  await saveSettingGroup("brand", {
    fullName: String(formData.get("fullName") ?? ""),
    displayName: String(formData.get("displayName") ?? ""),
    initials: String(formData.get("initials") ?? ""),
    positioningStatement: String(formData.get("positioningStatement") ?? ""),
    tagline: String(formData.get("tagline") ?? ""),
    taglineAlternatives: linesOf(formData, "taglineAlternatives"),
    shortBio: String(formData.get("shortBio") ?? ""),
    longBiography: String(formData.get("longBiography") ?? ""),
    mission: String(formData.get("mission") ?? ""),
    vision: String(formData.get("vision") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    location: String(formData.get("location") ?? ""),
    emailSenderName: String(formData.get("emailSenderName") ?? ""),
    copyrightName: String(formData.get("copyrightName") ?? ""),
    logoPath: formData.get("logoPath")?.toString() || null,
    logoLightPath: formData.get("logoLightPath")?.toString() || null,
    logoDarkPath: formData.get("logoDarkPath")?.toString() || null,
    monogramPath: formData.get("monogramPath")?.toString() || null,
    authorPhotoPath: formData.get("authorPhotoPath")?.toString() || null,
    ogImagePath: formData.get("ogImagePath")?.toString() || null,
    faviconPath: formData.get("faviconPath")?.toString() || null,
    primaryColor: parseColor(formData, "primaryColor"),
    accentColor: parseColor(formData, "accentColor"),
    secondaryColor: parseColor(formData, "secondaryColor"),
    headingFont,
    bodyFont,
  });
}

export async function saveContactSettingsAction(formData: FormData): Promise<void> {
  const emailSchema = z.string().trim().refine((v) => v === "" || z.string().email().safeParse(v).success, {
    message: "Enter a valid email address.",
  });
  function parseEmail(field: string): string {
    const raw = String(formData.get(field) ?? "").trim();
    const result = emailSchema.safeParse(raw);
    if (!result.success) throw new Error(`${field}: ${result.error.issues[0]?.message}`);
    return result.data;
  }

  await saveSettingGroup("contact", {
    email: parseEmail("email"),
    speakingEmail: parseEmail("speakingEmail"),
    mediaEmail: parseEmail("mediaEmail"),
  });
}

export async function saveSocialSettingsAction(formData: FormData): Promise<void> {
  await saveSettingGroup("social", {
    linkedin: parseUrl(formData, "linkedin"),
    instagram: parseUrl(formData, "instagram"),
    youtube: parseUrl(formData, "youtube"),
    x: parseUrl(formData, "x"),
  });
}

export async function saveSeoSettingsAction(formData: FormData): Promise<void> {
  await saveSettingGroup("seo", {
    defaultTitle: String(formData.get("defaultTitle") ?? ""),
    defaultDescription: String(formData.get("defaultDescription") ?? ""),
  });
}

export async function saveHeroSettingsAction(formData: FormData): Promise<void> {
  await saveSettingGroup("hero", {
    headline: String(formData.get("headline") ?? ""),
    subheading: String(formData.get("subheading") ?? ""),
  });
}

/** Splits a textarea's value into one trimmed, non-empty entry per line. */
function linesOf(formData: FormData, field: string): string[] {
  return String(formData.get(field) ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function saveAboutSettingsAction(formData: FormData): Promise<void> {
  const timeline = linesOf(formData, "timeline").map((line) => {
    const [year, ...rest] = line.split(" — ");
    return { year: year?.trim() ?? "", label: rest.join(" — ").trim() };
  });

  await saveSettingGroup("about", {
    heroIntro: String(formData.get("heroIntro") ?? ""),
    professionalJourney: String(formData.get("professionalJourney") ?? ""),
    leadershipExperience: String(formData.get("leadershipExperience") ?? ""),
    lessonsLearned: String(formData.get("lessonsLearned") ?? ""),
    motivationForWriting: String(formData.get("motivationForWriting") ?? ""),
    speakingMission: String(formData.get("speakingMission") ?? ""),
    expertiseAreas: linesOf(formData, "expertiseAreas"),
    values: linesOf(formData, "values"),
    timeline,
    achievements: linesOf(formData, "achievements"),
    awards: linesOf(formData, "awards"),
    mediaBiography: String(formData.get("mediaBiography") ?? ""),
  });
}

export async function saveNewsletterSettingsAction(formData: FormData): Promise<void> {
  await saveSettingGroup("newsletter", {
    headline: String(formData.get("headline") ?? ""),
    description: String(formData.get("description") ?? ""),
    consentText: String(formData.get("consentText") ?? ""),
  });
}

export async function saveCtaSettingsAction(formData: FormData): Promise<void> {
  await saveSettingGroup("cta", {
    headline: String(formData.get("headline") ?? ""),
    description: String(formData.get("description") ?? ""),
    primaryLabel: String(formData.get("primaryLabel") ?? ""),
    secondaryLabel: String(formData.get("secondaryLabel") ?? ""),
  });
}

export async function saveCredibilitySettingsAction(formData: FormData): Promise<void> {
  await saveSettingGroup("credibility", {
    yearsExperience: String(formData.get("yearsExperience") ?? ""),
    peopleReached: String(formData.get("peopleReached") ?? ""),
    organisationsSupported: String(formData.get("organisationsSupported") ?? ""),
    booksPublished: String(formData.get("booksPublished") ?? ""),
    speakingEngagements: String(formData.get("speakingEngagements") ?? ""),
    countriesReached: String(formData.get("countriesReached") ?? ""),
    eventsDelivered: String(formData.get("eventsDelivered") ?? ""),
    countriesSpokenIn: String(formData.get("countriesSpokenIn") ?? ""),
    audienceReached: String(formData.get("audienceReached") ?? ""),
    clientSatisfaction: String(formData.get("clientSatisfaction") ?? ""),
  });
}

const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/svg+xml"]);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

async function uploadBrandImage(
  formData: FormData,
  field:
    | "logoPath"
    | "logoLightPath"
    | "logoDarkPath"
    | "authorPhotoPath"
    | "monogramPath"
    | "ogImagePath"
    | "faviconPath",
  prefix: string
) {
  const session = await requireAdminAction("administrator");
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) throw new Error("Choose an image file to upload.");
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Unsupported file type. Use PNG, JPEG, WebP or SVG.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("File is too large. Maximum size is 5MB.");
  }

  const admin = createAdminClient();
  const path = `${prefix}-${Date.now()}-${file.name}`;
  const { error: uploadError } = await admin.storage.from("media").upload(path, file, {
    contentType: file.type,
    upsert: true,
  });
  if (uploadError) throw new Error(uploadError.message);

  const { data: existing } = await admin.from("site_settings").select("value").eq("key", "brand").maybeSingle();
  const nextValue = { ...(existing?.value as Record<string, unknown>), [field]: path };

  const { error } = await admin
    .from("site_settings")
    .upsert({ key: "brand", value: nextValue as Json, updated_by: session.userId }, { onConflict: "key" });
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}

export async function uploadLogoAction(formData: FormData): Promise<void> {
  await uploadBrandImage(formData, "logoPath", "logo");
}

export async function uploadLogoLightAction(formData: FormData): Promise<void> {
  await uploadBrandImage(formData, "logoLightPath", "logo-light");
}

export async function uploadLogoDarkAction(formData: FormData): Promise<void> {
  await uploadBrandImage(formData, "logoDarkPath", "logo-dark");
}

export async function uploadFaviconAction(formData: FormData): Promise<void> {
  await uploadBrandImage(formData, "faviconPath", "favicon");
}

export async function uploadAuthorPhotoAction(formData: FormData): Promise<void> {
  await uploadBrandImage(formData, "authorPhotoPath", "author-photo");
}

export async function uploadMonogramAction(formData: FormData): Promise<void> {
  await uploadBrandImage(formData, "monogramPath", "monogram");
}

export async function uploadOgImageAction(formData: FormData): Promise<void> {
  await uploadBrandImage(formData, "ogImagePath", "og-image");
}
