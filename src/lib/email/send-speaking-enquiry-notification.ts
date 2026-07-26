import "server-only";

import { getResendClient } from "./resend-client";
import { siteConfig } from "@/lib/content/site-config";
import { getSettingGroup } from "@/lib/settings/queries";
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
  return `<tr><td style="padding:4px 12px 4px 0;color:#6b7280;white-space:nowrap;">${label}</td><td style="padding:4px 0;color:#131f35;">${value}</td></tr>`;
}

export async function sendSpeakingEnquiryNotification(
  input: SpeakingEnquiryNotificationInput
): Promise<void> {
  const fromEmail = process.env.FROM_EMAIL;
  if (!fromEmail) return;

  try {
    const brand = await getSettingGroup("brand");
    const senderName = brand.emailSenderName || siteConfig.emailSenderName;

    const resend = getResendClient();
    const html = `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
        <p style="font-size:13px;font-weight:700;letter-spacing:0.04em;color:#131f35;margin:0 0 20px;border-bottom:2px solid #dbb155;padding-bottom:10px;">${brand.displayName}</p>
        <h1 style="font-size:18px;color:#131f35;">New speaking enquiry</h1>
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
        ${input.notes ? `<p style="font-size:14px;color:#131f35;"><strong>Notes:</strong><br/>${input.notes}</p>` : ""}
      </div>
    `;

    await resend.emails.send({
      from: `${senderName} <${fromEmail}>`,
      to: input.to,
      replyTo: input.email,
      subject: `New speaking enquiry — ${input.organisation}`,
      html,
    });
  } catch (error) {
    logger.error("sendSpeakingEnquiryNotification failed", { error });
  }
}
