import "server-only";

import { getResendClient } from "./resend-client";
import { logger } from "@/lib/logger";

interface SpeakingEnquiryNotificationInput {
  to: string;
  organisation: string;
  contactName: string;
  email: string;
  phone: string | null;
  eventType: string;
  venue: string | null;
  country: string | null;
  audienceSize: number | null;
  eventDate: string | null;
  budgetRange: string | null;
  preferredTopic: string | null;
  notes: string | null;
}

function row(label: string, value: string | number | null) {
  if (value === null || value === "") return "";
  return `<tr><td style="padding:4px 12px 4px 0;color:#6b7280;white-space:nowrap;">${label}</td><td style="padding:4px 0;color:#1c2333;">${value}</td></tr>`;
}

export async function sendSpeakingEnquiryNotification(
  input: SpeakingEnquiryNotificationInput
): Promise<void> {
  const fromEmail = process.env.FROM_EMAIL;
  if (!fromEmail) return;

  try {
    const resend = getResendClient();
    const html = `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
        <h1 style="font-size:18px;color:#1c2333;">New speaking enquiry</h1>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          ${row("Organisation", input.organisation)}
          ${row("Contact", input.contactName)}
          ${row("Email", input.email)}
          ${row("Phone", input.phone)}
          ${row("Event type", input.eventType)}
          ${row("Venue", input.venue)}
          ${row("Country", input.country)}
          ${row("Audience size", input.audienceSize)}
          ${row("Event date", input.eventDate)}
          ${row("Budget", input.budgetRange)}
          ${row("Preferred topic", input.preferredTopic)}
        </table>
        ${input.notes ? `<p style="font-size:14px;color:#1c2333;"><strong>Notes:</strong><br/>${input.notes}</p>` : ""}
      </div>
    `;

    await resend.emails.send({
      from: fromEmail,
      to: input.to,
      replyTo: input.email,
      subject: `New speaking enquiry — ${input.organisation}`,
      html,
    });
  } catch (error) {
    logger.error("sendSpeakingEnquiryNotification failed", { error });
  }
}
