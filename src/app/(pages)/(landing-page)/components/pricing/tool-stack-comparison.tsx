"use client";

import CheckCircle from "@/app/icons/untitled-ui/duocolor/checked-circle";
import Close from "@/app/icons/untitled-ui/duocolor/close";
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
import {
  currentStack,
  included,
  MONTHLY_PRICE,
  STACK_TOTAL,
} from "./pricing-data";

export default function ToolStackComparison() {
  const theme = useTheme();

  return (
    <Box
      id="what-it-replaces"
      sx={{
        position: "relative",
        bgcolor: "background.paper",
        py: { xs: 10, md: 14 },
        scrollMarginTop: { xs: 64, md: 76 },
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ maxWidth: 640, mb: { xs: 6, md: 9 } }}>
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
            What it replaces
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.875rem", md: "2.5rem" },
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              color: "text.primary",
              mb: 2,
            }}
          >
            You&apos;re already paying for all of this
          </Typography>

          <Typography
            sx={{
              fontSize: "1.0625rem",
              color: "text.secondary",
              lineHeight: 1.7,
            }}
          >
            Just spread across half a dozen invoices, with none of the pieces
            aware the others exist. A lead that fills in your valuation form
            doesn&apos;t show up in your inbox tool. A booked tour doesn&apos;t
            show up in your CRM.
          </Typography>
        </Box>

        <Grid2 container spacing={{ xs: 3, md: 4 }} alignItems="stretch">
          {/* ── The usual stack ── */}
          <Grid2 size={{ xs: 12, md: 7 }}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              sx={{
                height: "100%",
                p: { xs: 2.5, md: 3.5 },
                borderRadius: "16px",
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.default",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "text.disabled",
                  mb: 2.5,
                }}
              >
                The usual stack
              </Typography>

              <Stack
                divider={
                  <Box sx={{ height: "1px", bgcolor: "divider", my: 1.5 }} />
                }
              >
                {currentStack.map(({ job, tools, price }) => (
                  <Stack
                    key={job}
                    direction="row"
                    alignItems="center"
                    spacing={2}
                  >
                    <SvgIcon
                      sx={{ fontSize: 16, color: "error.main", flexShrink: 0 }}
                    >
                      <Close />
                    </SvgIcon>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: "0.9375rem",
                          fontWeight: 600,
                          color: "text.primary",
                          lineHeight: 1.4,
                        }}
                      >
                        {job}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.8125rem",
                          color: "text.secondary",
                          lineHeight: 1.5,
                        }}
                      >
                        {tools}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "text.secondary",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {price}
                      <Box
                        component="span"
                        sx={{ color: "text.disabled", fontWeight: 500 }}
                      >
                        /mo
                      </Box>
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              {/* Total */}
              <Stack
                direction="row"
                alignItems="baseline"
                justifyContent="space-between"
                sx={{
                  mt: 3,
                  pt: 2.5,
                  borderTop: "2px solid",
                  borderColor: "divider",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.9375rem",
                    fontWeight: 700,
                    color: "text.primary",
                  }}
                >
                  Roughly what it adds up to
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "1.25rem", md: "1.5rem" },
                    fontWeight: 800,
                    color: "error.main",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {STACK_TOTAL}
                  <Box
                    component="span"
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "text.disabled",
                    }}
                  >
                    /mo
                  </Box>
                </Typography>
              </Stack>
            </Box>
          </Grid2>

          {/* ── Ours ── */}
          <Grid2 size={{ xs: 12, md: 5 }}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              sx={{
                position: "relative",
                height: "100%",
                p: { xs: 2.5, md: 3.5 },
                borderRadius: "16px",
                border: "1.5px solid",
                borderColor: "primary.main",
                bgcolor: theme.palette.primary.alpha8,
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: -80,
                  right: -80,
                  width: 200,
                  height: 200,
                  bgcolor: "primary.main",
                  opacity: 0.12,
                  filter: "blur(60px)",
                  borderRadius: "50%",
                  pointerEvents: "none",
                },
              }}
            >
              <Box sx={{ position: "relative" }}>
                <Typography
                  sx={{
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "primary.main",
                    mb: 2.5,
                  }}
                >
                  RealtyIllustrations
                </Typography>

                <Stack direction="row" alignItems="baseline" spacing={0.5}>
                  <Typography
                    sx={{
                      fontSize: { xs: "2.75rem", md: "3.25rem" },
                      fontWeight: 800,
                      color: "text.primary",
                      lineHeight: 1,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {MONTHLY_PRICE}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "text.secondary",
                    }}
                  >
                    /month
                  </Typography>
                </Stack>

                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    color: "text.secondary",
                    mt: 1.5,
                    mb: 3,
                    lineHeight: 1.6,
                  }}
                >
                  One custom-built website. One login. Everything below
                  included — no add-ons, no per-feature upsells.
                </Typography>

                <Stack spacing={1.25}>
                  {included.map(({ label, slug }) => (
                    <Stack
                      key={label}
                      direction="row"
                      alignItems="center"
                      spacing={1.25}
                    >
                      <SvgIcon
                        sx={{
                          fontSize: 17,
                          color: "success.main",
                          flexShrink: 0,
                        }}
                      >
                        <CheckCircle />
                      </SvgIcon>
                      <Typography
                        {...(slug
                          ? { component: Link, href: `/features/${slug}` }
                          : {})}
                        sx={{
                          fontSize: "0.875rem",
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
                </Stack>
              </Box>
            </Box>
          </Grid2>
        </Grid2>

        <Typography
          sx={{
            mt: 3,
            fontSize: "0.75rem",
            color: "text.disabled",
            lineHeight: 1.6,
          }}
        >
          Comparison figures are typical published starting prices for each
          category and are shown for illustration. Product names belong to their
          respective owners.
        </Typography>
      </Container>
    </Box>
  );
}
