"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Grid2,
  Container,
  Stack,
  Chip,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@mui/x-date-pickers";
import CheckCircle from "@/app/icons/untitled-ui/duocolor/checked-circle";
import Percentage from "@/app/icons/untitled-ui/duocolor/percentage";
import User01 from "@/app/icons/untitled-ui/duocolor/user01";
import EvaluationDialogue from "../evaluation-dialogue";

const features = [
  {
    title: "Fast & Free",
    desc: "Get your home value report in minutes — no cost, no strings attached.",
    icon: CheckCircle,
  },
  {
    title: "Accurate Data",
    desc: "Powered by real market data and recent comparable sales in your area.",
    icon: Percentage,
  },
  {
    title: "Expert Support",
    desc: "Our team is ready to walk you through every number, anytime.",
    icon: User01,
  },
];

export default function HomeEvaluation({ adminId }: { adminId?: string }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const secondary = theme.palette.secondary.main;
  const contrastText = theme.palette.primary.contrastText;

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        py: { xs: 9, md: 13 },
        background: `linear-gradient(140deg, ${theme.palette.primary.darkest ?? theme.palette.primary.dark} 0%, ${theme.palette.primary.dark} 60%, ${alpha(secondary, 0.25)} 100%)`,
        color: contrastText,
      }}
    >
      {/* Background texture layers */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        {/* Noise grain overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
          }}
        />
        {/* Glow orbs */}
        <Box
          sx={{
            position: "absolute",
            top: "-20%",
            left: "60%",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${alpha(secondary, 0.2)} 0%, transparent 65%)`,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "-25%",
            left: "-10%",
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${alpha(contrastText, 0.05)} 0%, transparent 65%)`,
          }}
        />
        {/* Thin diagonal lines */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.06,
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 40px,
              ${contrastText} 40px,
              ${contrastText} 41px
            )`,
          }}
        />
      </Box>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Stack spacing={10}>
          {/* ── HERO TEXT + CTA ── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Stack alignItems="center" spacing={4} textAlign="center">
              {/* Eyebrow badge */}
              <Chip
                label="Instant Home Valuation"
                size="small"
                sx={{
                  bgcolor: alpha(contrastText, 0.12),
                  color: contrastText,
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  border: `1px solid ${alpha(contrastText, 0.2)}`,
                  borderRadius: 1,
                  height: 26,
                }}
              />

              <Box>
                <Typography
                  variant="h2"
                  fontWeight={900}
                  lineHeight={1.08}
                  letterSpacing="-0.035em"
                  sx={{
                    fontSize: { xs: "2.2rem", sm: "3rem", md: "3.75rem" },
                    color: contrastText,
                    mb: 2.5,
                  }}
                >
                  What&apos;s your home
                  <Box
                    component="span"
                    sx={{
                      display: "block",
                      color: secondary,
                      // subtle text shadow for legibility on gradient
                      textShadow: `0 0 40px ${alpha(secondary, 0.4)}`,
                    }}
                  >
                    worth today?
                  </Box>
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    opacity: 0.8,
                    maxWidth: 520,
                    mx: "auto",
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    lineHeight: 1.7,
                    color: contrastText,
                  }}
                >
                  Get a free, no-obligation home value report based on live
                  market data and recent comparable sales in your neighborhood.
                </Typography>
              </Box>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems="center"
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => setOpen(true)}
                  endIcon={<ArrowRightIcon />}
                  sx={{
                    px: 5,
                    py: 1.625,
                    fontSize: "1rem",
                    fontWeight: 700,
                    borderRadius: 2,
                    bgcolor: secondary,
                    color: theme.palette.secondary.contrastText,
                    boxShadow: `0 8px 28px ${alpha(secondary, 0.4)}`,
                    "&:hover": {
                      bgcolor: theme.palette.secondary.dark,
                      boxShadow: `0 10px 36px ${alpha(secondary, 0.5)}`,
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  Get My Free Report
                </Button>

                <Typography
                  variant="caption"
                  sx={{
                    opacity: 0.55,
                    color: contrastText,
                    fontSize: "0.78rem",
                  }}
                >
                  No sign-up required · Takes 60 seconds
                </Typography>
              </Stack>
            </Stack>
          </motion.div>

          {/* ── FEATURE CARDS ── */}
          <Grid2 container spacing={2.5}>
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <Grid2 size={{ xs: 12, md: 4 }} key={i}>
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      duration: 0.55,
                      delay: i * 0.12,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{ height: "100%" }}
                  >
                    <Box
                      sx={{
                        p: { xs: 3, md: 3.5 },
                        height: "100%",
                        borderRadius: 3.5,
                        border: `1px solid ${alpha(contrastText, 0.1)}`,
                        bgcolor: alpha(contrastText, 0.05),
                        backdropFilter: "blur(12px)",
                        transition:
                          "background-color 0.2s ease, transform 0.2s ease",
                        "&:hover": {
                          bgcolor: alpha(contrastText, 0.09),
                          transform: "translateY(-3px)",
                        },
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      {/* Icon container */}
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          bgcolor: alpha(secondary, 0.18),
                          border: `1px solid ${alpha(secondary, 0.3)}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon color="secondary" />
                      </Box>

                      <Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight={700}
                          color={contrastText}
                          gutterBottom
                          letterSpacing="-0.01em"
                        >
                          {f.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            opacity: 0.65,
                            color: contrastText,
                            lineHeight: 1.65,
                          }}
                        >
                          {f.desc}
                        </Typography>
                      </Box>

                      {/* Bottom accent line */}
                      <Box
                        sx={{
                          mt: "auto",
                          pt: 2,
                          borderTop: `1px solid ${alpha(contrastText, 0.08)}`,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: secondary,
                            fontWeight: 700,
                            fontSize: "0.72rem",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                          }}
                        >
                          {i === 0
                            ? "Instant results"
                            : i === 1
                              ? "Live MLS data"
                              : "Real agents"}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                </Grid2>
              );
            })}
          </Grid2>
        </Stack>
      </Container>

      <EvaluationDialogue
        adminId={adminId}
        open={open}
        onClose={() => setOpen(false)}
      />
    </Box>
  );
}
