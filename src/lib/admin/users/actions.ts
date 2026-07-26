"use server";

import { revalidatePath } from "next/cache";

import { requireAdminAction } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { AdminRole } from "@/lib/supabase/database.types";

export async function grantAdminRoleAction(formData: FormData): Promise<void> {
  await requireAdminAction("super_admin");
  const email = String(formData.get("email") ?? "").trim();
  const role = formData.get("role")?.toString() as AdminRole;
  if (!email) throw new Error("Enter an email address.");

  const admin = createAdminClient();
  const { data: usersResult, error: listError } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (listError) throw new Error(listError.message);

  const user = usersResult.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  if (!user) {
    throw new Error("No registered account found with that email. They must sign up first.");
  }

  const { error } = await admin
    .from("user_roles")
    .upsert({ user_id: user.id, role }, { onConflict: "user_id" });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/users");
}

export async function revokeAdminRoleAction(userId: string): Promise<void> {
  await requireAdminAction("super_admin");
  const admin = createAdminClient();
  const { error } = await admin.from("user_roles").delete().eq("user_id", userId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/users");
}
