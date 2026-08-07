/**
 * Email Layout Renderer
 *
 * Composes content blocks into the table-based HTML that email clients need.
 * This is the only place that markup lives — change the design here and every
 * email in every journey updates with it.
 *
 * The output intentionally matches the design the built-in templates already
 * used, so converting them to blocks does not change how they look.
 */

import {
  DEFAULT_BRAND_COLOR,
  DEFAULT_FOOTER_NOTE,
  EmailBlock,
  EmailBrand,
} from "./blocks";

const FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

/**
 * Brand whose values are the template placeholders themselves.
 *
 * Used when rendering outside a send — the resulting HTML still carries
 * {{agentName}} etc. and is filled in later by replaceTemplateVariables.
 */
export const TEMPLATE_BRAND: EmailBrand = {
  agentName: "{{agentName}}",
  agentEmail: "{{agentEmail}}",
  agentPhone: "{{agentPhone}}",
};

/**
 * Escape user text before it becomes HTML.
 *
 * `{{placeholders}}` pass through untouched — they are substituted later by
 * replaceTemplateVariables, after this markup is built.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Escape, then allow the two bits of markup agents actually need:
 * **bold** and [link text](url).
 */
function formatText(value: string): string {
  return escapeHtml(value)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      (_match, label, url) =>
        `<a href="${safeUrl(url)}" style="color:#3b82f6;text-decoration:none;">${label}</a>`,
    )
    .replace(/\n/g, "<br />");
}

/** A URL is only safe to put in href if it is http(s), mailto or tel. */
function safeUrl(url: string): string {
  const trimmed = (url || "").trim();
  return /^(https?:|mailto:|tel:|\{\{)/i.test(trimmed)
    ? escapeHtml(trimmed)
    : "#";
}

function renderBlock(block: EmailBlock, brandColor: string): string {
  switch (block.type) {
    case "heading":
      return `<h2 style="margin:0 0 16px;font-size:20px;font-weight:600;color:#111827;">${formatText(
        block.text,
      )}</h2>`;

    case "paragraph":
      return `<p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">${formatText(
        block.text,
      )}</p>`;

    case "bullets": {
      const items = block.items
        .filter((item) => item.trim())
        .map(
          (item) =>
            `<li style="margin-bottom:8px;">${formatText(item)}</li>`,
        )
        .join("");

      if (!items) return "";

      return `<ul style="margin:0 0 16px;padding-left:20px;color:#374151;font-size:15px;line-height:1.6;">${items}</ul>`;
    }

    case "button": {
      const note = block.note
        ? `<p style="text-align:center;margin:16px 0 0;color:#6b7280;font-size:13px;">${formatText(
            block.note,
          )}</p>`
        : "";

      return `<table role="presentation" style="margin:8px auto 0;border-collapse:collapse;">
  <tr>
    <td style="background-color:${brandColor};border-radius:6px;text-align:center;">
      <a href="${safeUrl(block.url)}" style="display:inline-block;padding:14px 32px;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;">${formatText(
        block.label,
      )}</a>
    </td>
  </tr>
</table>${note}`;
    }

    case "callout": {
      const tones = {
        info: { bg: "#eff6ff", border: "#3b82f6" },
        warning: { bg: "#fef3c7", border: "#f59e0b" },
        success: { bg: "#f0fdf4", border: "#10b981" },
      };
      const tone = tones[block.tone] ?? tones.info;

      return `<div style="background-color:${tone.bg};border-left:4px solid ${tone.border};padding:16px;margin:0 0 16px;border-radius:4px;color:#374151;font-size:15px;line-height:1.6;">${formatText(
        block.text,
      )}</div>`;
    }

    case "divider":
      return `<hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />`;
  }
}

/**
 * Compose blocks into a complete email document.
 *
 * @param blocks - The editable content
 * @param brand - Account-level branding, applied to every email
 */
export function renderEmail(blocks: EmailBlock[], brand: EmailBrand): string {
  const brandColor = brand.brandColor || DEFAULT_BRAND_COLOR;
  const footerNote = brand.footerNote || DEFAULT_FOOTER_NOTE;

  const body = blocks
    .map((block) => renderBlock(block, brandColor))
    .filter(Boolean)
    .join("\n              ");

  const header = brand.logoUrl
    ? `<tr>
            <td style="padding:24px 32px;text-align:center;border-bottom:1px solid #e5e7eb;">
              <img src="${escapeHtml(brand.logoUrl)}" alt="${escapeHtml(
                brand.companyName || brand.agentName,
              )}" style="max-height:44px;max-width:200px;display:inline-block;" />
            </td>
          </tr>`
    : "";

  const phoneLine = brand.agentPhone
    ? `<p style="margin:0 0 2px;color:#6b7280;font-size:14px;">${escapeHtml(
        brand.agentPhone,
      )}</p>`
    : "";

  const companyLine = brand.companyName
    ? `<p style="margin:4px 0 0;color:#6b7280;font-size:14px;">${escapeHtml(
        brand.companyName,
      )}</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:${FONT_STACK};background-color:#f5f7fa;">
  <table role="presentation" style="width:100%;border-collapse:collapse;">
    <tr>
      <td style="padding:40px 20px;">
        <table role="presentation" style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
          ${header}
          <tr>
            <td style="padding:32px;">
              ${body}
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 32px;border-top:1px solid #e5e7eb;">
              <p style="margin:0 0 8px;color:#111827;font-weight:600;font-size:15px;">Best regards,</p>
              <p style="margin:0 0 4px;color:#111827;font-weight:600;font-size:15px;">${escapeHtml(
                brand.agentName,
              )}</p>
              ${phoneLine}
              <p style="margin:0;color:#6b7280;font-size:14px;">${escapeHtml(
                brand.agentEmail,
              )}</p>
              ${companyLine}
            </td>
          </tr>
          <tr>
            <td style="padding:24px;background-color:#f9fafb;border-radius:0 0 8px 8px;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">${escapeHtml(
                footerNote,
              )}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
