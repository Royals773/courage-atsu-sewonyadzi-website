"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export interface DiscountValidationResult {
  valid: boolean;
  reason?: string;
  code?: string;
  description?: string | null;
  /** In pounds, capped at the basket subtotal. */
  discountAmount?: number;
}

/**
 * Validates a discount code against discount_codes (active window,
 * redemption limit) and computes the discount for the given subtotal.
 * Does NOT increment times_redeemed — that only happens once a payment
 * actually succeeds, in the Stripe webhook handler.
 *
 * discount_codes has no public RLS SELECT policy at all (see the Step 1
 * report — a public policy would let anyone enumerate every valid code),
 * so this runs through the service-role client behind a server action
 * instead, only ever revealing whether the one submitted code is valid.
 */
export async function validateDiscountCodeAction(
  rawCode: string,
  subtotal: number
): Promise<DiscountValidationResult> {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { valid: false, reason: "Enter a discount code." };

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("discount_codes")
    .select("*")
    .eq("code", code)
    .maybeSingle();

  if (error || !data) {
    return { valid: false, reason: "That code isn't valid." };
  }

  if (!data.is_active) {
    return { valid: false, reason: "That code is no longer active." };
  }

  const now = new Date();
  if (data.starts_at && new Date(data.starts_at) > now) {
    return { valid: false, reason: "That code isn't active yet." };
  }
  if (data.expires_at && new Date(data.expires_at) < now) {
    return { valid: false, reason: "That code has expired." };
  }
  if (data.max_redemptions !== null && data.times_redeemed >= data.max_redemptions) {
    return { valid: false, reason: "That code has reached its usage limit." };
  }

  const subtotalPence = Math.round(subtotal * 100);
  const discountPence =
    data.discount_type === "percentage"
      ? Math.round((subtotalPence * data.discount_value) / 100)
      : data.discount_value;

  const cappedDiscountPence = Math.min(discountPence, subtotalPence);

  return {
    valid: true,
    code: data.code,
    description: data.description,
    discountAmount: cappedDiscountPence / 100,
  };
}
