"use client";

import Building from "@/app/icons/untitled-ui/duocolor/building-04";
import DesignServices from "@/app/icons/untitled-ui/duocolor/design-services";
import LayoutAlt from "@/app/icons/untitled-ui/duocolor/layout-alt-02";
import Paid from "@/app/icons/untitled-ui/duocolor/paid";
import {
  Box,
  Container,
  Grid2,
  Stack,
  SvgIcon,
  Typography,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";

const reasons = [
  {
    title: "Custom-built, not a template",
    body: "Your site is designed around your brand and the way you actually work — not picked from a gallery that thousands of other agents are picking from too.",
    icon: <DesignServices />,
  },
  {
    title: "Everything included, one flat price",
    body: "Every feature is in the base price. Nothing is held back for a higher tier, and there are no per-feature add-ons waiting for you later.",
    icon: <Paid />,
  },
  {
    title: "The pieces actually talk to each other",
    body: "A booked tour is attached to the lead that booked it. A downloaded guide starts a follow-up sequence. No Zapier glue, no copying between dashboards.",
    icon: <LayoutAlt />,
  },
  {
    title: "Small-business specialists since 2018",
    body: "We are Impact Illustration, and we have spent years building for SMEs across America. We size what we build to what your business can carry.",
    icon: <Building />,
  },
];

export default function WhyUs() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        py: { xs: 10, md: 14 },
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Grid2 container spacing={{ xs: 5, md: 8 }}>
          {/* ── Header ── */}
          <Grid2 size={{ xs: 12, md: 5 }}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              sx={{ position: { md: "sticky" }, top: { md: 110 } }}
            >
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
                Why us
              </Typography>

              <Typography
                component="h2"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "1.875rem", md: "2.5rem" },
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                  color: "text.primary",
                  mb: 2.5,
                }}
              >
                Built for agents who want{" "}
                <Box component="span" sx={{ color: "primary.main" }}>
                  more than a template
                </Box>
              </Typography>

              <Typography
                sx={{
                  fontSize: "1.0625rem",
                  color: "text.secondary",
                  lineHeight: 1.75,
                  mb: 3,
                }}
              >
                Your brokerage hands you a generic profile page. The platforms
                sell you a theme thousands of others are already using. We build
                you the third option.
              </Typography>

              <Box
                component={Link}
                href="/about"
                sx={{
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  color: "primary.main",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Read our story →
              </Box>
            </Box>
          </Grid2>

          {/* ── Reasons ── */}
          <Grid2 size={{ xs: 12, md: 7 }}>
            <Stack spacing={2.5}>
              {reasons.map(({ title, body, icon }, index) => (
                <Stack
                  key={title}
                  component={motion.div}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  direction="row"
                  spacing={2.5}
                  sx={{
                    p: { xs: 2.5, md: 3 },
                    borderRadius: "16px",
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.default",
                    transition: "border-color 0.3s ease, transform 0.3s ease",
                    "&:hover": {
                      borderColor: "primary.main",
                      transform: "translateX(6px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "12px",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: theme.palette.primary.alpha12,
                    }}
                  >
                    <SvgIcon sx={{ fontSize: 22, color: "primary.main" }}>
                      {icon}
                    </SvgIcon>
                  </Box>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: "1.0625rem",
                        fontWeight: 700,
                        color: "text.primary",
                        lineHeight: 1.35,
                        mb: 0.75,
                      }}
                    >
                      {title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.9375rem",
                        color: "text.secondary",
                        lineHeight: 1.7,
                      }}
                    >
                      {body}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
}
