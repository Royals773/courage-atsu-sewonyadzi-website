import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { SpeakingEnquiryStatus } from "@/lib/supabase/database.types";
import { logger } from "@/lib/logger";

export interface AdminEnquiryFilters {
  status?: SpeakingEnquiryStatus;
  search?: string;
}

export async function getAdminSpeakingEnquiries(filters: AdminEnquiryFilters = {}) {
  const admin = createAdminClient();
  let query = admin
    .from("speaking_enquiries")
    .select("*, speaking_topics(title)")
    .order("created_at", { ascending: false });

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.search) {
    query = query.or(
      `organisation.ilike.%${filters.search}%,contact_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
    );
  }

  const { data, error } = await query;
  if (error || !data) {
    logger.error("getAdminSpeakingEnquiries failed", { error });
    return [];
  }
  return data;
}

export async function getAdminSpeakingEnquiryById(id: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("speaking_enquiries")
    .select("*, speaking_topics(title)")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    logger.error("getAdminSpeakingEnquiryById failed", { error });
    return null;
  }
  return data;
}
