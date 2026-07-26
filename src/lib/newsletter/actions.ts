"use server";

import { z } from "zod";

import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";
import { logger } from "@/lib/logger";

const schema = z.object({
  email: z.string().trim().email(),
  firstName: z.string().trim().optional(),
  consent: z.literal(true),
});

export interface NewsletterSignupState {
  success?: boolean;
  error?: string;
}

export async function subscribeToNewsletterAction(
  _prevState: NewsletterSignupState,
  formData: FormData
): Promise<NewsletterSignupState> {
  if (!isSupabaseConfigured()) {
    return { error: "Newsletter sign-up isn't available yet." };
  }

  const parsed = schema.safeParse({
    email: formData.get("email"),
    firstName: formData.get("firstName")?.toString() || undefined,
    consent: formData.get("consent") === "on",
  });

  if (!parsed.success) {
    return { error: "Enter a valid email and confirm consent to continue." };
  }

  try {
    const admin = createAdminClient();
    const { error } = await admin.from("newsletter_subscribers").upsert(
      {
        email: parsed.data.email.toLowerCase(),
        first_name: parsed.data.firstName ?? null,
        consent: true,
        source: "website",
        unsubscribed_at: null,
      },
      { onConflict: "email" }
    );
    if (error) throw error;
    return { success: true };
  } catch (error) {
    logger.error("subscribeToNewsletterAction failed", { error });
    return { error: "Something went wrong — please try again." };
  }
}
