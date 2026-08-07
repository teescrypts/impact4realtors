"use client";

import ChevronRight from "@/app/icons/untitled-ui/duocolor/chevron-right";
import { Box, Stack, SvgIcon, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Link from "next/link";
import { Feature } from "./feature-data";

export default function FeatureCard({ feature }: { feature: Feature }) {
  const theme = useTheme();

  return (
    <Box
      component={Link}
      href={`/features/${feature.slug}`}
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        p: 3,
        borderRadius: "16px",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        textDecoration: "none",
        overflow: "hidden",
        transition:
          "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          borderColor: "primary.main",
          boxShadow: `0 16px 40px ${alpha("#000", 0.1)}`,
          "& .feature-card-arrow": { transform: "translateX(4px)" },
          "& .feature-card-title": { color: "primary.main" },
        },
      }}
    >
      {/* Corner number */}
      <Typography
        sx={{
          position: "absolute",
          top: 18,
          right: 20,
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.08em",
          color: "text.disabled",
        }}
      >
        {feature.number}
      </Typography>

      {/* Icon */}
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: theme.palette.primary.alpha12,
          mb: 2.5,
          flexShrink: 0,
        }}
      >
        <SvgIcon sx={{ fontSize: 22, color: "primary.main" }}>
          {feature.icon}
        </SvgIcon>
      </Box>

      <Typography
        className="feature-card-title"
        sx={{
          fontSize: "1.0625rem",
          fontWeight: 700,
          color: "text.primary",
          lineHeight: 1.3,
          mb: 1,
          transition: "color 0.2s ease",
        }}
      >
        {feature.title}
      </Typography>

      <Typography
        sx={{
          fontSize: "0.875rem",
          color: "text.secondary",
          lineHeight: 1.65,
          mb: 2.5,
          flexGrow: 1,
        }}
      >
        {feature.summary}
      </Typography>

      {/* Replaces chips */}
      <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mb: 2.5 }}>
        {feature.replaces.map((name) => (
          <Typography
            key={name}
            sx={{
              px: 1,
              py: 0.375,
              borderRadius: "6px",
              border: "1px dashed",
              borderColor: "divider",
              fontSize: "0.7rem",
              fontWeight: 500,
              color: "text.disabled",
              textDecoration: "line-through",
            }}
          >
            {name}
          </Typography>
        ))}
      </Stack>

      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Typography
          sx={{
            fontSize: "0.8125rem",
            fontWeight: 700,
            color: "primary.main",
          }}
        >
          Learn more
        </Typography>
        <SvgIcon
          className="feature-card-arrow"
          sx={{
            fontSize: 16,
            color: "primary.main",
            transition: "transform 0.2s ease",
          }}
        >
          <ChevronRight />
        </SvgIcon>
      </Stack>
    </Box>
  );
}
