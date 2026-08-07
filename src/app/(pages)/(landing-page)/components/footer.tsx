"use client";

import {
  Box,
  Container,
  Divider,
  Grid2,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { EXPLORE_DEMO_HREF, GET_STARTED_HREF } from "./cta-buttons";
import { features } from "./features/feature-data";

const companyLinks = [
  { label: "About us", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "All features", href: "/features" },
  { label: "Privacy policy", href: "/privacy-policy" },
];

const startLinks = [
  { label: "Explore demo", href: EXPLORE_DEMO_HREF },
  { label: "See a live site", href: "/demo" },
];

const linkSx = {
  fontSize: "0.875rem",
  color: "text.secondary",
  textDecoration: "none",
  lineHeight: 1.6,
  transition: "color 0.15s ease",
  "&:hover": { color: "primary.main" },
};

const headingSx = {
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "text.primary",
  mb: 2,
};

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        position: "relative",
        borderTop: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <Box
        sx={{
          position: "absolute",
          top: "-40%",
          left: "-6%",
          width: { xs: 260, md: 420 },
          height: { xs: 260, md: 420 },
          bgcolor: "primary.main",
          opacity: 0.07,
          filter: "blur(110px)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* ── Link columns ── */}
        <Grid2 container spacing={{ xs: 4, md: 5 }} sx={{ pt: { xs: 6, md: 8 }, pb: { xs: 4, md: 6 } }}>
          {/* Brand */}
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Stack
              component={Link}
              href="/"
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{ textDecoration: "none", mb: 2 }}
            >
              <Image
                src="/images/logo.png"
                alt="RealtyIllustrations"
                width={36}
                height={36}
                style={{ objectFit: "contain", borderRadius: 8 }}
              />
              <Typography
                sx={{
                  fontSize: "1.0625rem",
                  fontWeight: 700,
                  color: "text.primary",
                }}
              >
                RealtyIllustrations
              </Typography>
            </Stack>

            <Typography
              sx={{
                fontSize: "0.875rem",
                color: "text.secondary",
                lineHeight: 1.7,
                maxWidth: 320,
                mb: 2.5,
              }}
            >
              Custom-built websites for real estate agents — lead capture,
              follow-up, listings, appointments and content in one place, for
              $30 a month.
            </Typography>

            {/* Parent company */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                display: "inline-flex",
                px: 1.5,
                py: 0.75,
                borderRadius: "999px",
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.default",
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: "success.main",
                  animation: "pulse 2s ease-in-out infinite",
                  "@keyframes pulse": {
                    "0%, 100%": { opacity: 1, transform: "scale(1)" },
                    "50%": { opacity: 0.4, transform: "scale(0.7)" },
                  },
                }}
              />
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: "text.secondary",
                }}
              >
                A project by{" "}
                <Box
                  component="span"
                  sx={{ fontWeight: 700, color: "primary.main" }}
                >
                  Impact Illustration
                </Box>
              </Typography>
            </Stack>
          </Grid2>

          {/* Features */}
          <Grid2 size={{ xs: 6, md: 3 }}>
            <Typography sx={headingSx}>Features</Typography>
            <Stack spacing={1.25}>
              {features.map(({ slug, shortTitle }) => (
                <Box
                  key={slug}
                  component={Link}
                  href={`/features/${slug}`}
                  sx={linkSx}
                >
                  {shortTitle}
                </Box>
              ))}
            </Stack>
          </Grid2>

          {/* Company */}
          <Grid2 size={{ xs: 6, md: 2.5 }}>
            <Typography sx={headingSx}>Company</Typography>
            <Stack spacing={1.25}>
              {companyLinks.map(({ label, href }) => (
                <Box key={label} component={Link} href={href} sx={linkSx}>
                  {label}
                </Box>
              ))}
            </Stack>
          </Grid2>

          {/* Get started */}
          <Grid2 size={{ xs: 12, md: 2.5 }}>
            <Typography sx={headingSx}>Get started</Typography>
            <Stack spacing={1.25} alignItems="flex-start">
              {startLinks.map(({ label, href }) => (
                <Box key={label} component={Link} href={href} sx={linkSx}>
                  {label}
                </Box>
              ))}

              <Box
                component={Link}
                href={GET_STARTED_HREF}
                sx={{
                  mt: 1,
                  px: 2,
                  py: 1,
                  borderRadius: "8px",
                  border: "1.5px solid",
                  borderColor: "primary.main",
                  color: "primary.main",
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  transition: "background-color 0.15s ease",
                  "&:hover": { bgcolor: theme.palette.primary.alpha8 },
                }}
              >
                Get started →
              </Box>
            </Stack>
          </Grid2>
        </Grid2>

        <Divider />

        {/* ── Bottom bar ── */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems="center"
          justifyContent="space-between"
          spacing={1.5}
          sx={{ py: 3 }}
        >
          <Typography sx={{ fontSize: "0.8rem", color: "text.disabled" }}>
            © {new Date().getFullYear()} Impact Illustration. All rights
            reserved.
          </Typography>

          <Stack direction="row" alignItems="center" spacing={2.5}>
            <Box
              component={Link}
              href="/privacy-policy"
              sx={{ ...linkSx, fontSize: "0.8rem" }}
            >
              Privacy policy
            </Box>
            <Box
              component={Link}
              href="/pricing"
              sx={{ ...linkSx, fontSize: "0.8rem" }}
            >
              Pricing
            </Box>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
