"use client";

import CheckCircle from "@/app/icons/untitled-ui/duocolor/checked-circle";
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  currentStack,
  included,
  MONTHLY_PRICE,
  STACK_TOTAL,
} from "../pricing/pricing-data";

export default function HomePricing() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "relative",
        bgcolor: "background.paper",
        py: { xs: 10, md: 14 },
        borderTop: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: { xs: 5, md: 7 } }}>
          <Typography
            component="span"
            sx={{
              display: "inline-block",
              mb: 2,
              px: 1.5,
              py: 0.5,
              borderRadius: "6px",
              bgcolor: theme.palette.primary.alpha12,
              color: "primary.main",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Pricing
          </Typography>

          <Typography
            component="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.875rem", md: "2.5rem" },
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              color: "text.primary",
              mb: 2,
            }}
          >
            One plan. Everything in it.
          </Typography>

          <Typography
            sx={{
              fontSize: "1.0625rem",
              color: "text.secondary",
              lineHeight: 1.7,
              maxWidth: 520,
              mx: "auto",
            }}
          >
            No tiers, no per-feature add-ons, no upgrade you&apos;ll need in six
            months.
          </Typography>
        </Box>

        {/* Price card */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          sx={{
            position: "relative",
            p: { xs: 3, md: 5 },
            borderRadius: "20px",
            border: "1.5px solid",
            borderColor: "primary.main",
            bgcolor: "background.default",
            boxShadow: `0 20px 60px ${alpha("#000", 0.08)}`,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -110,
              left: "50%",
              transform: "translateX(-50%)",
              width: 380,
              height: 300,
              bgcolor: "primary.main",
              opacity: 0.1,
              filter: "blur(90px)",
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />

          <Box sx={{ position: "relative" }}>
            {/* Price */}
            <Stack alignItems="center" sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="baseline" spacing={0.75}>
                <Typography
                  sx={{
                    fontSize: { xs: "3.25rem", md: "4rem" },
                    fontWeight: 800,
                    color: "text.primary",
                    lineHeight: 1,
                    letterSpacing: "-0.04em",
                  }}
                >
                  {MONTHLY_PRICE}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    color: "text.secondary",
                  }}
                >
                  /month
                </Typography>
              </Stack>

              {/* What it displaces */}
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                  mt: 2,
                  px: 2,
                  py: 0.75,
                  borderRadius: "999px",
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                }}
              >
                <Typography
                  sx={{ fontSize: "0.8125rem", color: "text.secondary" }}
                >
                  Replaces{" "}
                  <Box
                    component="span"
                    sx={{ fontWeight: 700, color: "text.primary" }}
                  >
                    {currentStack.length} subscriptions
                  </Box>{" "}
                  that typically run
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    color: "error.main",
                    textDecoration: "line-through",
                    whiteSpace: "nowrap",
                  }}
                >
                  {STACK_TOTAL}/mo
                </Typography>
              </Stack>
            </Stack>

            {/* Included */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                columnGap: 3,
                rowGap: 1.5,
                pt: 4,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              {included.map(({ label, slug }) => (
                <Stack
                  key={label}
                  direction="row"
                  alignItems="center"
                  spacing={1.25}
                >
                  <SvgIcon
                    sx={{ fontSize: 17, color: "success.main", flexShrink: 0 }}
                  >
                    <CheckCircle />
                  </SvgIcon>
                  <Typography
                    {...(slug
                      ? { component: Link, href: `/features/${slug}` }
                      : {})}
                    sx={{
                      fontSize: "0.9375rem",
                      fontWeight: 500,
                      color: "text.primary",
                      textDecoration: "none",
                      ...(slug && {
                        "&:hover": {
                          color: "primary.main",
                          textDecoration: "underline",
                        },
                      }),
                    }}
                  >
                    {label}
                  </Typography>
                </Stack>
              ))}
            </Box>

            {/* CTA */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
              sx={{ mt: 4.5 }}
            >
              <Button
                component={Link}
                href="/pricing"
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  fontWeight: 700,
                  borderRadius: "10px",
                  px: 4,
                  py: 1.5,
                  textTransform: "none",
                  fontSize: "0.9375rem",
                  boxShadow: "none",
                  "&:hover": { boxShadow: "none" },
                }}
              >
                See the full breakdown →
              </Button>
            </Stack>
          </Box>
        </Box>

        <Typography
          sx={{
            mt: 2.5,
            fontSize: "0.75rem",
            color: "text.disabled",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          Comparison figures are typical published starting prices for each
          category and are shown for illustration.
        </Typography>
      </Container>
    </Box>
  );
}
