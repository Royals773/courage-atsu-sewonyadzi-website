"use server";

import { revalidatePath } from "next/cache";

import { requireAdminAction } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function unsubscribeNewsletterAction(subscriberId: string): Promise<void> {
  await requireAdminAction("administrator");
  const admin = createAdminClient();
  const { error } = await admin
    .from("newsletter_subscribers")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("id", subscriberId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/newsletter");
}
