/**
 * Landing page enquiry action
 *
 * Handles the "Get started" / "Explore demo" forms on the marketing site and
 * notifies the RealtyIllustrations team by email. These are our own prospects,
 * not a realtor's leads, so nothing is written to the Lead collection.
 */

"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/** Where enquiry notifications land. */
const NOTIFY_TO = "impactillustration1@gmail.com";

/** Verified Resend sender used across the app. */
const FROM = "RealtyIllustrations <support@realtyillustration.com>";

export type EnquiryIntent = "demo" | "start";

export type EnquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
  /** Field-level errors keyed by input name. */
  errors?: Record<string, string>;
};

const INTENT_LABEL: Record<EnquiryIntent, string> = {
  demo: "Explore the demo",
  start: "Get started",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (value: FormDataEntryValue | null, max = 500) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

/** Escape user input before it goes into the notification HTML. */
const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const row = (label: string, value: string) => `
  <tr>
    <td style="padding:10px 16px;border-bottom:1px solid #eee;color:#666;font-size:13px;white-space:nowrap;vertical-align:top;">${label}</td>
    <td style="padding:10px 16px;border-bottom:1px solid #eee;color:#111;font-size:14px;font-weight:600;">${escapeHtml(value)}</td>
  </tr>`;

export async function submitEnquiry(
  _prevState: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const firstName = clean(formData.get("firstName"), 80);
  const lastName = clean(formData.get("lastName"), 80);
  const email = clean(formData.get("email"), 160);
  const phone = clean(formData.get("phone"), 40);
  const brokerage = clean(formData.get("brokerage"), 120);
  const message = clean(formData.get("message"), 2000);
  const rawIntent = clean(formData.get("intent"), 20);

  const intent: EnquiryIntent = rawIntent === "demo" ? "demo" : "start";

  // Honeypot — bots fill hidden fields, humans do not.
  if (clean(formData.get("company"))) {
    return { status: "success", message: "Thanks — we'll be in touch shortly." };
  }

  const errors: Record<string, string> = {};
  if (!firstName) errors.firstName = "First name is required";
  if (!lastName) errors.lastName = "Last name is required";
  if (!email) errors.email = "Email is required";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email";

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      errors,
    };
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("submitEnquiry: RESEND_API_KEY is not set");
    return {
      status: "error",
      message:
        "We couldn't send your details just now. Please try again shortly.",
    };
  }

  const label = INTENT_LABEL[intent];
  const fullName = `${firstName} ${lastName}`;

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: NOTIFY_TO,
      replyTo: email,
      subject: `${label} — ${fullName}`,
      html: `
        <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;">
          <p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#888;">
            New website enquiry
          </p>
          <h2 style="margin:0 0 20px;font-size:20px;color:#111;">
            ${escapeHtml(fullName)} wants to <strong>${escapeHtml(label.toLowerCase())}</strong>
          </h2>

          <table style="width:100%;border-collapse:collapse;border:1px solid #eee;border-radius:8px;overflow:hidden;">
            ${row("Name", fullName)}
            ${row("Email", email)}
            ${phone ? row("Phone", phone) : ""}
            ${brokerage ? row("Brokerage", brokerage) : ""}
            ${row("Interested in", label)}
          </table>

          ${
            message
              ? `<div style="margin-top:20px;padding:16px;background:#f7f7f7;border-radius:8px;">
                   <p style="margin:0 0 6px;font-size:12px;color:#888;">Message</p>
                   <p style="margin:0;font-size:14px;color:#111;line-height:1.6;white-space:pre-wrap;">${escapeHtml(message)}</p>
                 </div>`
              : ""
          }

          <p style="margin-top:24px;font-size:12px;color:#999;">
            Reply directly to this email to reach ${escapeHtml(firstName)}.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("submitEnquiry: Resend error", error);
      return {
        status: "error",
        message:
          "We couldn't send your details just now. Please try again shortly.",
      };
    }

    return {
      status: "success",
      message:
        intent === "demo"
          ? "Thanks — we'll send over your demo access shortly."
          : "Thanks — we'll be in touch within one business day.",
    };
  } catch (err) {
    console.error("submitEnquiry: unexpected error", err);
    return {
      status: "error",
      message:
        "We couldn't send your details just now. Please try again shortly.",
    };
  }
}
