import { Box, useTheme } from "@mui/material";

interface BranchConnectorProps {
  className?: string;
}

export function BranchConnector({ className }: BranchConnectorProps) {
  const theme = useTheme();
  const lineColor = theme.palette.divider;

  return (
    <Box
      position="relative"
      display="flex"
      justifyContent="center"
      className={className}
    >
      {/* Vertical line from parent */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 2,
          height: 16,
          bgcolor: lineColor,
        }}
      />

      {/* Horizontal line */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          left: "25%",
          right: "25%",
          height: 2,
          bgcolor: lineColor,
        }}
      />

      {/* Left vertical */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          left: "25%",
          width: 2,
          height: 16,
          bgcolor: lineColor,
        }}
      />

      {/* Right vertical */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: "25%",
          width: 2,
          height: 16,
          bgcolor: lineColor,
        }}
      />

      {/* Spacer */}
      <Box height={32} />
    </Box>
  );
}
