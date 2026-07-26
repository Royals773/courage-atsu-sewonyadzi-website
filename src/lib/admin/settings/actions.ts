"use server";

import { revalidatePath } from "next/cache";

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

export async function saveGeneralSettingsAction(formData: FormData): Promise<void> {
  await saveSettingGroup("general", {
    brandName: String(formData.get("brandName") ?? ""),
    tagline: String(formData.get("tagline") ?? ""),
    shortBio: String(formData.get("shortBio") ?? ""),
    logoPath: formData.get("logoPath")?.toString() || null,
    primaryColor: formData.get("primaryColor")?.toString() || null,
    accentColor: formData.get("accentColor")?.toString() || null,
  });
}

export async function saveContactSettingsAction(formData: FormData): Promise<void> {
  await saveSettingGroup("contact", {
    email: String(formData.get("email") ?? ""),
    speakingEmail: String(formData.get("speakingEmail") ?? ""),
    mediaEmail: String(formData.get("mediaEmail") ?? ""),
  });
}

export async function saveSocialSettingsAction(formData: FormData): Promise<void> {
  await saveSettingGroup("social", {
    linkedin: String(formData.get("linkedin") ?? ""),
    instagram: String(formData.get("instagram") ?? ""),
    youtube: String(formData.get("youtube") ?? ""),
    x: String(formData.get("x") ?? ""),
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
    motivationForWriting: String(formData.get("motivationForWriting") ?? ""),
    speakingMission: String(formData.get("speakingMission") ?? ""),
    expertiseAreas: linesOf(formData, "expertiseAreas"),
    values: linesOf(formData, "values"),
    timeline,
    achievements: linesOf(formData, "achievements"),
    mediaBiography: String(formData.get("mediaBiography") ?? ""),
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

async function uploadGeneralImage(formData: FormData, field: "logoPath" | "authorPhotoPath", prefix: string) {
  const session = await requireAdminAction("administrator");
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) throw new Error(`Choose an image file to upload.`);

  const admin = createAdminClient();
  const path = `${prefix}-${Date.now()}-${file.name}`;
  const { error: uploadError } = await admin.storage.from("media").upload(path, file, {
    contentType: file.type,
    upsert: true,
  });
  if (uploadError) throw new Error(uploadError.message);

  const { data: existing } = await admin.from("site_settings").select("value").eq("key", "general").maybeSingle();
  const nextValue = { ...(existing?.value as Record<string, unknown>), [field]: path };

  const { error } = await admin
    .from("site_settings")
    .upsert({ key: "general", value: nextValue as Json, updated_by: session.userId }, { onConflict: "key" });
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}

export async function uploadLogoAction(formData: FormData): Promise<void> {
  await uploadGeneralImage(formData, "logoPath", "logo");
}

export async function uploadAuthorPhotoAction(formData: FormData): Promise<void> {
  await uploadGeneralImage(formData, "authorPhotoPath", "author-photo");
}
