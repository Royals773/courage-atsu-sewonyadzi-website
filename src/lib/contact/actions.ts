"use server";

import { z } from "zod";

import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";
import { getSettingGroup } from "@/lib/settings/queries";
import { sendContactNotification } from "@/lib/email/send-contact-notification";
import { logger } from "@/lib/logger";

const schema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  subject: z.string().trim().optional(),
  message: z.string().trim().min(1),
});

export interface ContactFormState {
  success?: boolean;
  error?: string;
}

export async function submitContactFormAction(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  if (!isSupabaseConfigured()) {
    return { error: "The contact form isn't available yet — please email us directly." };
  }

  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject")?.toString() || undefined,
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { error: "Please fill in the required fields and try again." };
  }

  try {
    const admin = createAdminClient();
    const { error } = await admin.from("contact_submissions").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject ?? null,
      message: parsed.data.message,
    });
    if (error) throw error;

    const contact = await getSettingGroup("contact");
    await sendContactNotification({
      to: contact.email,
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject ?? null,
      message: parsed.data.message,
    });

    return { success: true };
  } catch (error) {
    logger.error("submitContactFormAction failed", { error });
    return { error: "Something went wrong — please try again or email us directly." };
  }
}
