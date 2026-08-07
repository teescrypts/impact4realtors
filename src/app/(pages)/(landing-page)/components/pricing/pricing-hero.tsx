"use client";

import { Box, Container, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import CtaButtons from "../cta-buttons";

const stats = [
  { value: "6+", label: "tools replaced" },
  { value: "1", label: "login to remember" },
  { value: "$30", label: "per month, flat" },
];

export default function PricingHero() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "relative",
        bgcolor: "background.default",
        py: { xs: 10, md: 15 },
        overflow: "hidden",
      }}
    >
      {/* Ambient glow — primary */}
      <Box
        sx={{
          position: "absolute",
          top: "-14%",
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
          bottom: "-18%",
          right: "-8%",
          width: { xs: 300, md: 480 },
          height: { xs: 300, md: 480 },
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
        <Box sx={{ maxWidth: 780, mx: "auto", textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Eyebrow label */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                mb: 3,
                px: 1.5,
                py: 0.6,
                borderRadius: "8px",
                border: "1px solid",
                borderColor: "primary.main",
                bgcolor: theme.palette.primary.alpha12,
              }}
            >
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  animation: "pulse 2s ease-in-out infinite",
                  "@keyframes pulse": {
                    "0%, 100%": { opacity: 1, transform: "scale(1)" },
                    "50%": { opacity: 0.4, transform: "scale(0.7)" },
                  },
                }}
              />
              <Typography
                sx={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "primary.main",
                }}
              >
                One plan, everything included
              </Typography>
            </Box>

            {/* Headline */}
            <Typography
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "2.25rem", sm: "2.75rem", md: "3.5rem" },
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                color: "text.primary",
                mb: 3,
              }}
            >
              Five subscriptions.{" "}
              <Box component="span" sx={{ color: "text.disabled" }}>
                Five logins.
              </Box>
              <br />
              Replaced by{" "}
              <Box
                component="span"
                sx={{
                  color: "primary.main",
                  position: "relative",
                  display: "inline-block",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 2,
                    left: 0,
                    width: "100%",
                    height: "3px",
                    bgcolor: "primary.main",
                    opacity: 0.3,
                    borderRadius: "2px",
                  },
                }}
              >
                $30 a month
              </Box>
              .
            </Typography>

            {/* Sub-copy */}
            <Typography
              sx={{
                fontSize: { xs: "1rem", md: "1.125rem" },
                color: "text.secondary",
                lineHeight: 1.75,
                mb: 5,
                maxWidth: 620,
                mx: "auto",
              }}
            >
              Most agents pay one company for follow-up, another for their
              WordPress site, another for an IDX listing feed, and a few more
              for scheduling and email. We build all of it into a single custom
              website — on one flat monthly bill, with nothing held back for a
              higher tier.
            </Typography>

            {/* CTAs */}
            <CtaButtons align="center" />

            <Box
              component="a"
              href="#what-it-replaces"
              sx={{
                display: "inline-block",
                mt: 3,
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "text.secondary",
                textDecoration: "none",
                "&:hover": { color: "primary.main" },
              }}
            >
              See the full breakdown ↓
            </Box>
          </motion.div>

          {/* Stat strip */}
          <Stack
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            direction="row"
            justifyContent="center"
            divider={
              <Box
                sx={{ width: "1px", alignSelf: "stretch", bgcolor: "divider" }}
              />
            }
            spacing={{ xs: 3, sm: 5 }}
            sx={{ mt: 7 }}
          >
            {stats.map(({ value, label }) => (
              <Box key={label} sx={{ textAlign: "center" }}>
                <Typography
                  sx={{
                    fontSize: { xs: "1.5rem", md: "1.875rem" },
                    fontWeight: 800,
                    color: "primary.main",
                    lineHeight: 1.2,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {value}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.8125rem",
                    color: "text.secondary",
                    fontWeight: 500,
                  }}
                >
                  {label}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
