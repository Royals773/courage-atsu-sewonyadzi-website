"use server";

import { z } from "zod";

import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";
import { getSettingGroup } from "@/lib/settings/queries";
import { sendSpeakingEnquiryNotification } from "@/lib/email/send-speaking-enquiry-notification";
import { logger } from "@/lib/logger";

const schema = z.object({
  organisation: z.string().trim().min(1),
  contactName: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().optional(),
  eventType: z.string().trim().min(1),
  venue: z.string().trim().optional(),
  country: z.string().trim().optional(),
  audienceSize: z.coerce.number().int().positive().optional(),
  eventDate: z.string().trim().optional(),
  budgetRange: z.string().trim().optional(),
  preferredTopicId: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export interface SpeakingEnquiryState {
  success?: boolean;
  error?: string;
}

export async function submitSpeakingEnquiryAction(
  _prevState: SpeakingEnquiryState,
  formData: FormData
): Promise<SpeakingEnquiryState> {
  if (!isSupabaseConfigured()) {
    return { error: "Speaking enquiries aren't available yet — please email us directly." };
  }

  const parsed = schema.safeParse({
    organisation: formData.get("organisation"),
    contactName: formData.get("contactName"),
    email: formData.get("email"),
    phone: formData.get("phone")?.toString() || undefined,
    eventType: formData.get("eventType"),
    venue: formData.get("venue")?.toString() || undefined,
    country: formData.get("country")?.toString() || undefined,
    audienceSize: formData.get("audienceSize")?.toString() || undefined,
    eventDate: formData.get("eventDate")?.toString() || undefined,
    budgetRange: formData.get("budgetRange")?.toString() || undefined,
    preferredTopicId: formData.get("preferredTopicId")?.toString() || undefined,
    notes: formData.get("notes")?.toString() || undefined,
  });

  if (!parsed.success) {
    return { error: "Please fill in the required fields and try again." };
  }

  try {
    const admin = createAdminClient();
    const { error } = await admin.from("speaking_enquiries").insert({
      organisation: parsed.data.organisation,
      contact_name: parsed.data.contactName,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      event_type: parsed.data.eventType,
      venue: parsed.data.venue ?? null,
      country: parsed.data.country ?? null,
      audience_size: parsed.data.audienceSize ?? null,
      event_date: parsed.data.eventDate ?? null,
      budget_range: parsed.data.budgetRange ?? null,
      preferred_topic_id: parsed.data.preferredTopicId || null,
      notes: parsed.data.notes ?? null,
    });
    if (error) throw error;

    let preferredTopic: string | null = null;
    if (parsed.data.preferredTopicId) {
      const { data: topic } = await admin
        .from("speaking_topics")
        .select("title")
        .eq("id", parsed.data.preferredTopicId)
        .maybeSingle();
      preferredTopic = topic?.title ?? null;
    }

    const contact = await getSettingGroup("contact");
    await sendSpeakingEnquiryNotification({
      to: contact.speakingEmail,
      organisation: parsed.data.organisation,
      contactName: parsed.data.contactName,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      eventType: parsed.data.eventType,
      venue: parsed.data.venue ?? null,
      country: parsed.data.country ?? null,
      audienceSize: parsed.data.audienceSize ?? null,
      eventDate: parsed.data.eventDate ?? null,
      budgetRange: parsed.data.budgetRange ?? null,
      preferredTopic: preferredTopic ?? null,
      notes: parsed.data.notes ?? null,
    });

    return { success: true };
  } catch (error) {
    logger.error("submitSpeakingEnquiryAction failed", { error });
    return { error: "Something went wrong — please try again or email us directly." };
  }
}
