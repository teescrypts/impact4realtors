"use client";

import { QuillEditor } from "@/app/component/quil-editor";
import { EmailBlock } from "@/app/lib/email/blocks";
import { renderEmail, TEMPLATE_BRAND } from "@/app/lib/email/render";
import {
  Box,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import EmailBlockEditor from "./email-block-editor";

/**
 * Sample values used only to make the preview readable. The real values are
 * substituted at send time by replaceTemplateVariables.
 */
const PREVIEW_SAMPLES: Record<string, string> = {
  firstName: "Sarah",
  lastName: "Mitchell",
  email: "sarah.mitchell@example.com",
  phone: "(555) 014-2288",
  agentName: "Your Name",
  agentEmail: "you@yourdomain.com",
  agentPhone: "(555) 555-0100",
  companyName: "Your Company",
  appointmentDate: "Friday, 14 March",
  appointmentTime: "2:00 PM",
  propertyAddress: "1240 Oak Ridge Drive",
};

/**
 * Does this content carry its own layout?
 *
 * Only relevant for legacy emails that were stored as raw HTML. Quill has no
 * table support and a fixed format whitelist, so it silently discards that
 * structure — and can write the flattened version back over the original.
 * Anything matching here must never reach Quill.
 */
export function isDesignedTemplate(html: string): boolean {
  if (!html) return false;
  return /<!DOCTYPE|<html|<table|<body|<style/i.test(html);
}

/** Swap placeholders for sample values so the preview reads like a real email. */
function fillPlaceholders(html: string): string {
  return html.replace(/\{\{\s*([a-zA-Z_]+)\s*\}\}/g, (match, key) =>
    PREVIEW_SAMPLES[key] !== undefined ? PREVIEW_SAMPLES[key] : match,
  );
}

/** Wrap bare content so simple (non-document) emails preview sensibly too. */
function buildPreviewDocument(html: string): string {
  const filled = fillPlaceholders(html || "");

  if (isDesignedTemplate(filled)) return filled;

  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:15px;line-height:1.6;color:#111;background:#ffffff;">
    ${filled || "<p style='color:#999'>Nothing to preview yet.</p>"}
  </body>
</html>`;
}

export function EmailContentEditor({
  value,
  blocks,
  onChange,
  onBlocksChange,
}: {
  value: string;
  blocks?: EmailBlock[];
  onChange: (value: string) => void;
  onBlocksChange: (blocks: EmailBlock[]) => void;
}) {
  const [tab, setTab] = useState<"edit" | "preview">("edit");

  const usesBlocks = !!blocks;
  const previewHtml = usesBlocks
    ? renderEmail(blocks!, TEMPLATE_BRAND)
    : value;

  return (
    <Stack spacing={2}>
      <Tabs
        value={tab}
        onChange={(_, next) => setTab(next)}
        sx={{ minHeight: 40, "& .MuiTab-root": { minHeight: 40 } }}
      >
        <Tab label="Edit" value="edit" sx={{ textTransform: "none" }} />
        <Tab label="Preview" value="preview" sx={{ textTransform: "none" }} />
      </Tabs>

      {tab === "preview" ? (
        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            overflow: "hidden",
            bgcolor: "#f5f7fa",
          }}
        >
          {/* sandbox="" keeps the email inert and stops it inheriting or
              leaking dashboard styles */}
          <Box
            component="iframe"
            title="Email preview"
            srcDoc={buildPreviewDocument(previewHtml)}
            sandbox=""
            sx={{ width: "100%", height: 460, border: "none", display: "block" }}
          />
        </Box>
      ) : usesBlocks ? (
        <EmailBlockEditor blocks={blocks!} onChange={onBlocksChange} />
      ) : isDesignedTemplate(value) ? (
        // Legacy raw-HTML email. Quill would destroy it, so edit the source.
        <Stack spacing={1.5}>
          <Paper
            variant="outlined"
            sx={{ p: 2, bgcolor: "warning.50", borderColor: "warning.main" }}
          >
            <Typography variant="body2">
              This email was built before the new editor. You can change the
              wording here, but keep the surrounding tags as they are — they
              are what makes it look right in your client&apos;s inbox. Check
              the Preview tab after any change.
            </Typography>
          </Paper>

          <TextField
            value={value}
            onChange={(e) => onChange(e.target.value)}
            multiline
            minRows={14}
            fullWidth
            spellCheck={false}
            slotProps={{
              htmlInput: {
                style: {
                  fontFamily:
                    "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
                  fontSize: "0.8125rem",
                  lineHeight: 1.6,
                  whiteSpace: "pre",
                },
              },
            }}
          />
        </Stack>
      ) : (
        <Box>
          <QuillEditor
            value={value}
            onChange={onChange}
            placeholder={`Hi {{firstName}},\n\nI wanted to reach out about...`}
            sx={{ height: 350 }}
          />
        </Box>
      )}
    </Stack>
  );
}

export default EmailContentEditor;
