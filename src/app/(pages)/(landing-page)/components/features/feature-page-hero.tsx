"use client";

import {
  Box,
  Container,
  Stack,
  SvgIcon,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import Link from "next/link";
import CtaButtons from "../cta-buttons";
import { features, getFeature } from "./feature-data";

export default function FeaturePageHero({ slug }: { slug: string }) {
  const theme = useTheme();
  const feature = getFeature(slug);

  if (!feature) return null;

  return (
    <Box
      sx={{
        position: "relative",
        bgcolor: "background.default",
        py: { xs: 8, md: 12 },
        overflow: "hidden",
      }}
    >
      {/* Ambient glow — primary */}
      <Box
        sx={{
          position: "absolute",
          top: "-16%",
          left: "-8%",
          width: { xs: 280, md: 440 },
          height: { xs: 280, md: 440 },
          bgcolor: "primary.main",
          opacity: 0.12,
          filter: "blur(90px)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      {/* Ambient glow — secondary */}
      <Box
        sx={{
          position: "absolute",
          bottom: "-20%",
          right: "-8%",
          width: { xs: 300, md: 460 },
          height: { xs: 300, md: 460 },
          bgcolor: "secondary.main",
          opacity: 0.1,
          filter: "blur(110px)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      {/* Subtle grid pattern */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, ${alpha(
              theme.palette.text.primary,
              0.03,
            )} 1px, transparent 1px),
            linear-gradient(to bottom, ${alpha(
              theme.palette.text.primary,
              0.03,
            )} 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          sx={{ maxWidth: 760 }}
        >
          {/* Breadcrumb */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ mb: 3, fontSize: "0.8125rem" }}
          >
            <Box
              component={Link}
              href="/features"
              sx={{
                color: "text.secondary",
                textDecoration: "none",
                fontWeight: 500,
                "&:hover": { color: "primary.main" },
              }}
            >
              Features
            </Box>
            <Box component="span" sx={{ color: "text.disabled" }}>
              /
            </Box>
            <Box component="span" sx={{ color: "text.primary", fontWeight: 600 }}>
              {feature.shortTitle}
            </Box>
          </Stack>

          {/* Icon + counter */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ mb: 2.5 }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: theme.palette.primary.alpha12,
                border: "1px solid",
                borderColor: "primary.main",
              }}
            >
              <SvgIcon sx={{ fontSize: 26, color: "primary.main" }}>
                {feature.icon}
              </SvgIcon>
            </Box>
            <Typography
              sx={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "text.disabled",
              }}
            >
              Feature {feature.number} of{" "}
              {String(features.length).padStart(2, "0")}
            </Typography>
          </Stack>

          {/* Headline */}
          <Typography
            component="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2.125rem", sm: "2.5rem", md: "3.25rem" },
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "text.primary",
              mb: 2,
            }}
          >
            {feature.title}
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "1.0625rem", md: "1.25rem" },
              fontWeight: 600,
              color: "primary.main",
              mb: 2.5,
            }}
          >
            {feature.tagline}
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "1rem", md: "1.0625rem" },
              color: "text.secondary",
              lineHeight: 1.75,
              mb: 4.5,
              maxWidth: 620,
            }}
          >
            {feature.description}
          </Typography>

          <CtaButtons />

          <Box
            component={Link}
            href="/pricing"
            sx={{
              display: "inline-block",
              mt: 2.5,
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "primary.main",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            It&apos;s all included for $30/month →
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
