"use server";

import { revalidatePath } from "next/cache";

import { requireAdminAction } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { siteConfig } from "@/lib/content/site-config";

export async function setCustomerBannedAction(userId: string, banned: boolean): Promise<void> {
  await requireAdminAction("administrator");
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(userId, {
    ban_duration: banned ? "876000h" : "none",
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/customers");
}

export async function sendCustomerPasswordResetAction(email: string): Promise<void> {
  await requireAdminAction("administrator");
  const admin = createAdminClient();
  const { error } = await admin.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteConfig.siteUrl}/account/sign-in`,
  });
  if (error) throw new Error(error.message);
}
