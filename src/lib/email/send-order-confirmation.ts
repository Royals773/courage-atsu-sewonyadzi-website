import "server-only";

import { getResendClient } from "./resend-client";
import { siteConfig } from "@/lib/content/site-config";
import { formatPrice } from "@/lib/format";
import { logger } from "@/lib/logger";

interface OrderConfirmationItem {
  title: string;
  format: string;
  quantity: number;
  lineTotal: number;
}

interface OrderConfirmationInput {
  to: string;
  orderNumber: string;
  items: OrderConfirmationItem[];
  totalAmount: number;
  downloadLinks: { title: string; url: string }[];
}

function renderOrderConfirmationHtml(input: OrderConfirmationInput): string {
  const rows = input.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #e5e1d8;">
            <div style="font-weight:600;color:#1c2333;">${item.title}</div>
            <div style="font-size:13px;color:#6b7280;">${item.format} × ${item.quantity}</div>
          </td>
          <td style="padding:8px 0;border-bottom:1px solid #e5e1d8;text-align:right;color:#1c2333;">
            ${formatPrice(item.lineTotal)}
          </td>
        </tr>`
    )
    .join("");

  const downloads = input.downloadLinks.length
    ? `
      <h2 style="font-size:16px;color:#1c2333;margin:24px 0 8px;">Your digital downloads</h2>
      <ul style="padding-left:18px;margin:0;">
        ${input.downloadLinks
          .map(
            (link) =>
              `<li style="margin-bottom:6px;"><a href="${link.url}" style="color:#b8862c;">${link.title}</a></li>`
          )
          .join("")}
      </ul>
      <p style="font-size:13px;color:#6b7280;">Download links expire after a limited time and number of uses.</p>
    `
    : "";

  return `
  <div style="font-family:Georgia,'Times New Roman',serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#1c2333;">
    <p style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#b8862c;margin:0 0 8px;">Order Confirmed</p>
    <h1 style="font-size:22px;margin:0 0 16px;">Thank you for your order</h1>
    <p style="font-size:14px;color:#374151;">Order <strong>${input.orderNumber}</strong> has been confirmed. Here's what you ordered:</p>
    <table style="width:100%;border-collapse:collapse;margin-top:16px;">
      ${rows}
      <tr>
        <td style="padding:12px 0 0;font-weight:700;">Total</td>
        <td style="padding:12px 0 0;font-weight:700;text-align:right;">${formatPrice(input.totalAmount)}</td>
      </tr>
    </table>
    ${downloads}
    <p style="font-size:13px;color:#6b7280;margin-top:32px;">
      Questions about your order? Reply to this email or contact
      <a href="mailto:${siteConfig.contactEmail}" style="color:#b8862c;">${siteConfig.contactEmail}</a>.
    </p>
    <p style="font-size:12px;color:#9ca3af;margin-top:24px;">${siteConfig.brandName}</p>
  </div>`;
}

export async function sendOrderConfirmationEmail(input: OrderConfirmationInput): Promise<void> {
  const fromEmail = process.env.FROM_EMAIL;
  if (!fromEmail) {
    logger.error("FROM_EMAIL is not set — skipping order confirmation email.");
    return;
  }

  try {
    const resend = getResendClient();
    await resend.emails.send({
      from: fromEmail,
      to: input.to,
      subject: `Order confirmed — ${input.orderNumber}`,
      html: renderOrderConfirmationHtml(input),
    });
  } catch (error) {
    // Never let an email failure fail the webhook / order creation.
    logger.error("sendOrderConfirmationEmail failed", { error });
  }
}
