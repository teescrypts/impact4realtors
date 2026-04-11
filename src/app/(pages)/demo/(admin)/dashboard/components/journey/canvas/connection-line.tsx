import { Box, Typography, useTheme } from "@mui/material";

interface ConnectionLineProps {
  className?: string;
  withBranch?: boolean;
  branchLabel?: "yes" | "no";
}

export function ConnectionLine({
  className,
  branchLabel,
}: ConnectionLineProps) {
  const theme = useTheme();

  const labelColor =
    branchLabel === "yes"
      ? theme.palette.success.main
      : theme.palette.error.main;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      className={className}
    >
      {branchLabel && (
        <Typography
          variant="caption"
          fontWeight={600}
          sx={{
            mb: 1,
            px: 1,
            py: 0.25,
            borderRadius: 1,
            bgcolor: `${labelColor}15`,
            color: labelColor,
            textTransform: "uppercase",
          }}
        >
          {branchLabel}
        </Typography>
      )}

      {/* Vertical line */}
      <Box
        sx={{
          width: 2,
          height: 32,
          bgcolor: theme.palette.divider,
          borderRadius: 1,
        }}
      />

      {/* Dot */}
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          bgcolor: theme.palette.divider,
          mt: "-2px",
        }}
      />
    </Box>
  );
}
