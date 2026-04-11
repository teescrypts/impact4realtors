// BuyerTypeCard.tsx

import { Paper, Box, Typography, Button, useTheme } from "@mui/material";
import { JSX } from "react";

interface BuyerTypeCardProps {
  icon: (props: { [key: string]: string }) => JSX.Element;
  title: string;
  description: string;
  features: string[];
  onGetGuide: () => void;
}

export const BuyerTypeCard = ({
  icon: Icon,
  title,
  description,
  features,
  onGetGuide,
}: BuyerTypeCardProps) => {
  const theme = useTheme();

  return (
    <Paper
      onClick={onGetGuide}
      sx={{
        flex: "0 0 300px",
        scrollSnapAlign: "start",
        p: 4,
        borderRadius: 3,
        cursor: "pointer",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        minHeight: 400,
        border: `1px solid ${theme.palette.divider}`,
        transition: "all 0.3s",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: theme.shadows[6],
          borderColor: theme.palette.primary.main,
        },
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          mb: 3,
          width: 56,
          height: 56,
          borderRadius: 2,
          bgcolor: theme.palette.primary.light,
          color: theme.palette.primary.main,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s",
        }}
      >
        <Icon />
      </Box>

      {/* Content */}
      <Typography variant="h6" fontWeight={600} mb={2}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ flexGrow: 1, mb: 2, opacity: 0.85 }}>
        {description}
      </Typography>

      {/* Features */}
      <Box component="ul" sx={{ mb: 3, pl: 2 }}>
        {features.map((f, i) => (
          <Typography
            key={i}
            component="li"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontSize: 14,
              color: theme.palette.text.secondary,
              mb: 0.5,
              "&::before": {
                content: '""',
                display: "inline-block",
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: theme.palette.secondary.main,
                mr: 1,
              },
            }}
          >
            {f}
          </Typography>
        ))}
      </Box>

      {/* CTA Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={(e) => {
          e.stopPropagation();
          onGetGuide();
        }}
      >
        Get Free Guide
      </Button>
    </Paper>
  );
};
