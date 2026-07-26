import type { SpeakingEnquiryStatus } from "@/lib/supabase/database.types";

/**
 * Client-safe constant — kept separate from queries.ts (which is
 * "server-only") so client components like enquiry-actions.tsx can import
 * it without pulling server-only code into the client bundle.
 */
export const ENQUIRY_STATUSES: SpeakingEnquiryStatus[] = [
  "new",
  "contacted",
  "discovery",
  "proposal_sent",
  "negotiating",
  "confirmed",
  "delivered",
  "closed",
];
