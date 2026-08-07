"use client";

import Add from "@/app/icons/untitled-ui/duocolor/add";
import Delete from "@/app/icons/untitled-ui/duocolor/delete";
import DownArrow from "@/app/icons/untitled-ui/duocolor/down-arrow";
import {
  blockLabels,
  createBlock,
  EmailBlock,
  EmailBlockType,
} from "@/app/lib/email/blocks";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  SvgIcon,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

const ADDABLE: EmailBlockType[] = [
  "paragraph",
  "heading",
  "bullets",
  "button",
  "divider",
];

/** One editable block. Which fields show depends on the block type. */
function BlockFields({
  block,
  onChange,
}: {
  block: EmailBlock;
  onChange: (block: EmailBlock) => void;
}) {
  switch (block.type) {
    case "heading":
      return (
        <TextField
          label="Heading"
          value={block.text}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
          placeholder="Hi {{firstName}},"
          fullWidth
          size="small"
        />
      );

    case "paragraph":
      return (
        <TextField
          label="Paragraph"
          value={block.text}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
          placeholder="Thanks for getting in touch…"
          multiline
          minRows={3}
          fullWidth
          size="small"
          helperText="Wrap words in **stars** to make them bold."
        />
      );

    case "bullets":
      return (
        <Stack spacing={1}>
          <Typography variant="caption" color="text.secondary">
            Bullet points
          </Typography>

          {block.items.map((item, index) => (
            <Stack key={index} direction="row" spacing={1} alignItems="center">
              <TextField
                value={item}
                onChange={(e) => {
                  const items = [...block.items];
                  items[index] = e.target.value;
                  onChange({ ...block, items });
                }}
                placeholder="Something you help with"
                fullWidth
                size="small"
              />
              <Tooltip title="Remove this point">
                <span>
                  <IconButton
                    size="small"
                    disabled={block.items.length === 1}
                    onClick={() =>
                      onChange({
                        ...block,
                        items: block.items.filter((_, i) => i !== index),
                      })
                    }
                  >
                    <SvgIcon sx={{ fontSize: 16 }}>
                      <Delete />
                    </SvgIcon>
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          ))}

          <Box>
            <Button
              size="small"
              onClick={() => onChange({ ...block, items: [...block.items, ""] })}
              sx={{ textTransform: "none" }}
            >
              + Add point
            </Button>
          </Box>
        </Stack>
      );

    case "button":
      return (
        <Stack spacing={2}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Button text"
              value={block.label}
              onChange={(e) => onChange({ ...block, label: e.target.value })}
              placeholder="Book a call"
              fullWidth
              size="small"
            />
            <TextField
              label="Where it goes"
              value={block.url}
              onChange={(e) => onChange({ ...block, url: e.target.value })}
              placeholder="https://… or mailto:{{agentEmail}}"
              fullWidth
              size="small"
            />
          </Stack>
          <TextField
            label="Small text under the button (optional)"
            value={block.note ?? ""}
            onChange={(e) => onChange({ ...block, note: e.target.value })}
            placeholder="Or simply reply to this email"
            fullWidth
            size="small"
          />
        </Stack>
      );

    case "divider":
      return (
        <Typography variant="body2" color="text.secondary">
          A thin line across the email, to separate sections.
        </Typography>
      );
  }
}

export function EmailBlockEditor({
  blocks,
  onChange,
}: {
  blocks: EmailBlock[];
  onChange: (blocks: EmailBlock[]) => void;
}) {
  const update = (index: number, block: EmailBlock) => {
    const next = [...blocks];
    next[index] = block;
    onChange(next);
  };

  const remove = (index: number) =>
    onChange(blocks.filter((_, i) => i !== index));

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;

    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <Stack spacing={2}>
      {blocks.length === 0 && (
        <Paper
          variant="outlined"
          sx={{ p: 3, textAlign: "center", bgcolor: "background.default" }}
        >
          <Typography variant="body2" color="text.secondary">
            This email is empty. Add a paragraph below to get started.
          </Typography>
        </Paper>
      )}

      {blocks.map((block, index) => (
        <Paper
          key={block.id}
          variant="outlined"
          sx={{ p: 2, borderRadius: 2, bgcolor: "background.paper" }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 1.5 }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "text.disabled",
              }}
            >
              {blockLabels[block.type]}
            </Typography>

            <Stack direction="row" spacing={0.5}>
              <Tooltip title="Move up">
                <span>
                  <IconButton
                    size="small"
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                  >
                    <SvgIcon
                      sx={{ fontSize: 18, transform: "rotate(180deg)" }}
                    >
                      <DownArrow />
                    </SvgIcon>
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip title="Move down">
                <span>
                  <IconButton
                    size="small"
                    disabled={index === blocks.length - 1}
                    onClick={() => move(index, 1)}
                  >
                    <SvgIcon sx={{ fontSize: 18 }}>
                      <DownArrow />
                    </SvgIcon>
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip title="Remove">
                <IconButton size="small" onClick={() => remove(index)}>
                  <SvgIcon sx={{ fontSize: 17, color: "error.main" }}>
                    <Delete />
                  </SvgIcon>
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          <BlockFields
            block={block}
            onChange={(next) => update(index, next)}
          />
        </Paper>
      ))}

      {/* Add buttons */}
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {ADDABLE.map((type) => (
          <Button
            key={type}
            size="small"
            variant="outlined"
            startIcon={
              <SvgIcon sx={{ fontSize: 16 }}>
                <Add />
              </SvgIcon>
            }
            onClick={() => onChange([...blocks, createBlock(type)])}
            sx={{ textTransform: "none", borderRadius: 1.5 }}
          >
            {blockLabels[type]}
          </Button>
        ))}
      </Stack>
    </Stack>
  );
}

export default EmailBlockEditor;
