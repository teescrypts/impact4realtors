"use client";

import CheckCircle from "@/app/icons/untitled-ui/duocolor/checked-circle";
import DownArrow from "@/app/icons/untitled-ui/duocolor/down-arrow";
import {
  Box,
  Container,
  Grid2,
  Stack,
  SvgIcon,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import Link from "next/link";
import { getFeature } from "./feature-data";

export default function FeatureDetail({ slug }: { slug: string }) {
  const theme = useTheme();
  const feature = getFeature(slug);

  if (!feature) return null;

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        py: { xs: 8, md: 12 },
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Grid2 container spacing={{ xs: 5, md: 8 }} alignItems="flex-start">
          {/* ── What's included ── */}
          <Grid2 size={{ xs: 12, md: 7 }}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Typography
                component="h2"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "1.5rem", md: "1.875rem" },
                  lineHeight: 1.25,
                  letterSpacing: "-0.02em",
                  color: "text.primary",
                  mb: 3,
                }}
              >
                What you get
              </Typography>

              <Stack spacing={2}>
                {feature.bullets.map((bullet) => (
                  <Stack
                    key={bullet}
                    direction="row"
                    alignItems="flex-start"
                    spacing={1.75}
                    sx={{
                      p: 2,
                      borderRadius: "12px",
                      border: "1px solid",
                      borderColor: "divider",
                      bgcolor: "background.default",
                      transition: "border-color 0.2s ease, transform 0.2s ease",
                      "&:hover": {
                        borderColor: "primary.main",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    <SvgIcon
                      sx={{
                        fontSize: 19,
                        color: "success.main",
                        flexShrink: 0,
                        mt: "1px",
                      }}
                    >
                      <CheckCircle />
                    </SvgIcon>
                    <Typography
                      sx={{
                        fontSize: "0.9375rem",
                        color: "text.primary",
                        lineHeight: 1.6,
                        fontWeight: 500,
                      }}
                    >
                      {bullet}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Grid2>

          {/* ── What it replaces ── */}
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
                p: { xs: 2.5, md: 3 },
                borderRadius: "16px",
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.default",
                boxShadow: `0 12px 40px ${alpha("#000", 0.06)}`,
                overflow: "hidden",
              }}
            >
              {/* Watermark glow */}
              <Box
                sx={{
                  position: "absolute",
                  top: -60,
                  right: -60,
                  width: 180,
                  height: 180,
                  bgcolor: "primary.main",
                  opacity: 0.1,
                  filter: "blur(60px)",
                  borderRadius: "50%",
                  pointerEvents: "none",
                }}
              />

              <Box sx={{ position: "relative" }}>
                <Typography
                  sx={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "text.disabled",
                    mb: 1.75,
                  }}
                >
                  Instead of paying for
                </Typography>

                <Stack spacing={1}>
                  {feature.replaces.map((name) => (
                    <Stack
                      key={name}
                      direction="row"
                      alignItems="center"
                      spacing={1.5}
                      sx={{
                        px: 1.75,
                        py: 1.25,
                        borderRadius: "10px",
                        border: "1px dashed",
                        borderColor: "divider",
                        bgcolor: alpha(theme.palette.text.primary, 0.02),
                      }}
                    >
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          bgcolor: "text.disabled",
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          color: "text.disabled",
                          textDecoration: "line-through",
                        }}
                      >
                        {name}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>

                <Box
                  sx={{ display: "flex", justifyContent: "center", py: 1.5 }}
                >
                  <SvgIcon sx={{ fontSize: 22, color: "primary.main" }}>
                    <DownArrow />
                  </SvgIcon>
                </Box>

                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1.75}
                  sx={{
                    px: 2,
                    py: 2,
                    borderRadius: "12px",
                    border: "1.5px solid",
                    borderColor: "primary.main",
                    bgcolor: theme.palette.primary.alpha8,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: theme.palette.primary.alpha12,
                    }}
                  >
                    <SvgIcon sx={{ fontSize: 20, color: "primary.main" }}>
                      {feature.icon}
                    </SvgIcon>
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: "0.9375rem",
                        fontWeight: 700,
                        color: "text.primary",
                        lineHeight: 1.35,
                      }}
                    >
                      {feature.shortTitle}
                    </Typography>
                    <Typography
                      sx={{ fontSize: "0.8125rem", color: "text.secondary" }}
                    >
                      Included in your $30/month
                    </Typography>
                  </Box>
                  <SvgIcon
                    sx={{ fontSize: 20, color: "success.main", flexShrink: 0 }}
                  >
                    <CheckCircle />
                  </SvgIcon>
                </Stack>

                <Box
                  component={Link}
                  href="/pricing"
                  sx={{
                    display: "block",
                    mt: 2,
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "primary.main",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  See the full cost comparison →
                </Box>
              </Box>
            </Box>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
}
