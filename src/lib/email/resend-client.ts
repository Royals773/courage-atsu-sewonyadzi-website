import "server-only";

import { Resend } from "resend";

/**
 * Instantiated lazily so importing this file never throws at build time —
 * only when an email actually needs to be sent without RESEND_API_KEY set.
 */
export function getResendClient() {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("RESEND_API_KEY is not set.");
  }
  return new Resend(key);
}
