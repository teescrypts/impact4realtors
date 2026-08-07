/**
 * Email Content Blocks
 *
 * An email's *content* is a short ordered list of typed blocks. Its *layout* —
 * the doctype, tables, card, signature and footer — lives in render.ts and is
 * never exposed to the person editing.
 *
 * This split is what lets a non-technical agent edit an email safely: they can
 * change words, add a paragraph or move a button, but they cannot reach the
 * markup that makes it render correctly in Outlook.
 */

export type EmailBlock =
  | { id: string; type: "heading"; text: string }
  | { id: string; type: "paragraph"; text: string }
  | { id: string; type: "bullets"; items: string[] }
  | { id: string; type: "button"; label: string; url: string; note?: string }
  | {
      id: string;
      type: "callout";
      text: string;
      tone: "info" | "warning" | "success";
    }
  | { id: string; type: "divider" };

export type CalloutTone = "info" | "warning" | "success";

export type EmailBlockType = EmailBlock["type"];

/** Branding applied to every email, set once in account settings. */
export interface EmailBrand {
  agentName: string;
  agentEmail: string;
  agentPhone?: string;
  companyName?: string;
  logoUrl?: string;
  /** Buttons and accents. */
  brandColor?: string;
  /** Small print under the signature. */
  footerNote?: string;
}

export const DEFAULT_BRAND_COLOR = "#2563eb";

export const DEFAULT_FOOTER_NOTE =
  "You're receiving this because you requested information from us.";

export function generateBlockId(): string {
  return `blk_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export const blockLabels: Record<EmailBlockType, string> = {
  heading: "Heading",
  paragraph: "Paragraph",
  bullets: "Bullet list",
  button: "Button",
  callout: "Highlighted note",
  divider: "Divider",
};

export const calloutToneLabels: Record<CalloutTone, string> = {
  info: "Blue (information)",
  warning: "Amber (attention)",
  success: "Green (good news)",
};

/** A sensible empty block of each type, for the "add" buttons. */
export function createBlock(type: EmailBlockType): EmailBlock {
  const id = generateBlockId();

  switch (type) {
    case "heading":
      return { id, type: "heading", text: "Hi {{firstName}}," };
    case "paragraph":
      return { id, type: "paragraph", text: "" };
    case "bullets":
      return { id, type: "bullets", items: [""] };
    case "button":
      return { id, type: "button", label: "Book a call", url: "" };
    case "callout":
      return { id, type: "callout", text: "", tone: "info" };
    case "divider":
      return { id, type: "divider" };
  }
}

/** Short summary of a block, for collapsed rows in the editor. */
export function summarizeBlock(block: EmailBlock): string {
  switch (block.type) {
    case "heading":
    case "paragraph":
    case "callout":
      return block.text || "Empty";
    case "bullets":
      return block.items.filter(Boolean).join(" · ") || "Empty";
    case "button":
      return block.label || "Untitled button";
    case "divider":
      return "Horizontal line";
  }
}
