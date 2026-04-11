import { Box, SvgIcon, Typography, useTheme } from "@mui/material";
import { EntryAction } from "../type";
import Loyalty from "@/app/icons/untitled-ui/duocolor/loyalty";
import ArrowRight from "@/app/icons/untitled-ui/duocolor/arrow-right";

interface EntryActionBadgeProps {
  entryAction: EntryAction;
  size?: "sm" | "md";
  sx?: object;
}

export function EntryActionBadge({
  entryAction,
  size = "sm",
  sx,
}: EntryActionBadgeProps) {
  const theme = useTheme();
  const { tagAction } = entryAction;
  const isAssign = tagAction.type === "assign";

  const label = isAssign
    ? `Assign tag: ${tagAction.tagName}`
    : `Change tag: ${tagAction.tagName} → ${tagAction.newTagName}`;

  const Icon = isAssign ? Loyalty : ArrowRight;
  const iconSize = size === "sm" ? "small" : "medium";
  const fontSize = size === "sm" ? "0.75rem" : "0.875rem";

  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        fontWeight: 500,
        color: theme.palette.primary.main,
        fontSize,
        ...sx,
      }}
    >
      <SvgIcon fontSize={iconSize}>
        <Icon />
      </SvgIcon>

      <Typography component="span" variant="body2">
        {label}
      </Typography>
    </Box>
  );
}
