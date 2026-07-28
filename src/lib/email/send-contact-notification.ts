import "server-only";

import { getResendClient } from "./resend-client";
import { siteConfig } from "@/lib/content/site-config";
import { getSettingGroup } from "@/lib/settings/queries";
import { logger } from "@/lib/logger";

interface ContactNotificationInput {
  to: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
}

export async function sendContactNotification(input: ContactNotificationInput): Promise<void> {
  const fromEmail = process.env.FROM_EMAIL;
  if (!fromEmail) return;

  try {
    const brand = await getSettingGroup("brand");
    const senderName = brand.emailSenderName || siteConfig.emailSenderName;

    const resend = getResendClient();
    const html = `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
        <p style="font-size:13px;font-weight:700;letter-spacing:0.04em;color:#131f35;margin:0 0 20px;border-bottom:2px solid #dbb155;padding-bottom:10px;">${brand.displayName}</p>
        <h1 style="font-size:18px;color:#131f35;">New contact form message</h1>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:4px 12px 4px 0;color:#6b7280;white-space:nowrap;">Name</td><td style="padding:4px 0;color:#131f35;">${input.name}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#6b7280;white-space:nowrap;">Email</td><td style="padding:4px 0;color:#131f35;">${input.email}</td></tr>
          ${input.subject ? `<tr><td style="padding:4px 12px 4px 0;color:#6b7280;white-space:nowrap;">Subject</td><td style="padding:4px 0;color:#131f35;">${input.subject}</td></tr>` : ""}
        </table>
        <p style="font-size:14px;color:#131f35;"><strong>Message:</strong><br/>${input.message.replace(/\n/g, "<br/>")}</p>
      </div>
    `;

    await resend.emails.send({
      from: `${senderName} <${fromEmail}>`,
      to: input.to,
      replyTo: input.email,
      subject: `New contact message — ${input.subject || input.name}`,
      html,
    });
  } catch (error) {
    logger.error("sendContactNotification failed", { error });
  }
}
