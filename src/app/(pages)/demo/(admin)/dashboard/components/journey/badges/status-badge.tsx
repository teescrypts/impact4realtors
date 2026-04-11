import { Box, Typography } from "@mui/material";

interface StatusBadgeProps {
  isActive: boolean;
  className?: string;
}

export function StatusBadge({ isActive, className }: StatusBadgeProps) {
  const bgColor = isActive ? "success.light" : "grey.300";
  const textColor = isActive ? "success.darkest" : "text.secondary";
  const dotColor = isActive ? "success.darkest" : "text.secondary";

  return (
    <Box
      component="span"
      display="inline-flex"
      alignItems="center"
      gap={0.5}
      px={1.5}
      py={0.5}
      borderRadius={1}
      bgcolor={bgColor}
      className={className}
    >
      <Box width={6} height={6} borderRadius="50%" bgcolor={dotColor} />
      <Typography variant="caption" color={textColor} fontWeight={500}>
        {isActive ? "Active" : "Inactive"}
      </Typography>
    </Box>
  );
}
