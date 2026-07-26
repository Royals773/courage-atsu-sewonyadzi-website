"use server";

import { redirect } from "next/navigation";
import { flattenError } from "zod";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { mergeGuestBasketIntoUser } from "@/lib/basket/actions";
import { signInSchema, signUpSchema } from "./schemas";
import type { AuthActionState } from "./action-state";

const NOT_CONFIGURED_ERROR: AuthActionState = {
  error: "Accounts aren't available yet — the store isn't connected to Supabase.",
};

function firstFieldErrors(fieldErrors: Record<string, string[] | undefined>) {
  const result: Record<string, string> = {};
  for (const [key, messages] of Object.entries(fieldErrors)) {
    if (messages && messages.length > 0) result[key] = messages[0];
  }
  return result;
}

export async function signInAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED_ERROR;

  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: firstFieldErrors(flattenError(parsed.error).fieldErrors) };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    await mergeGuestBasketIntoUser(data.user.id);
  }

  redirect("/account/orders");
}

export async function signUpAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED_ERROR;

  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { fieldErrors: firstFieldErrors(flattenError(parsed.error).fieldErrors) };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user && data.session) {
    // Email confirmation is disabled on the Supabase project — session is
    // available immediately.
    await mergeGuestBasketIntoUser(data.user.id);
    redirect("/account/orders");
  }

  return {
    info: "Check your email to confirm your account before signing in.",
  };
}

export async function signOutAction(): Promise<void> {
  if (!isSupabaseConfigured()) {
    redirect("/");
  }
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
