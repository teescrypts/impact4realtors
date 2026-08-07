"use client";

import Building from "@/app/icons/untitled-ui/duocolor/building-04";
import HomeSmile from "@/app/icons/untitled-ui/duocolor/home-smile";
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

const lineage = [
  {
    year: "Since 2018",
    title: "Impact Illustration",
    body: "Building digital technology for small and medium businesses across America — the software an SME actually needs, sized to what it can carry.",
    icon: <Building />,
  },
  {
    year: "Today",
    title: "RealtyIllustrations",
    body: "The same mission pointed at real estate: complete, custom-built websites for agents who want more than what their brokerage hands them.",
    icon: <HomeSmile />,
  },
];

export default function OurMission() {
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
        <Grid2 container spacing={{ xs: 5, md: 8 }} alignItems="center">
          {/* ── Mission statement ── */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
                Our mission
              </Typography>

              <Typography
                component="h2"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "1.75rem", md: "2.375rem" },
                  lineHeight: 1.25,
                  letterSpacing: "-0.02em",
                  color: "text.primary",
                  mb: 3,
                }}
              >
                Empower small businesses with the digital technology they need
                to grow —{" "}
                <Box component="span" sx={{ color: "primary.main" }}>
                  within their capacity
                </Box>
                .
              </Typography>

              <Stack spacing={2.5}>
                <Typography
                  sx={{
                    fontSize: "1.0625rem",
                    color: "text.secondary",
                    lineHeight: 1.8,
                  }}
                >
                  That last part is the part most software forgets. It is easy
                  to sell a small business a platform built for a company ten
                  times its size, then let the bill and the complexity do the
                  rest.
                </Typography>

                <Typography
                  sx={{
                    fontSize: "1.0625rem",
                    color: "text.secondary",
                    lineHeight: 1.8,
                  }}
                >
                  We have spent since 2018 doing the opposite: working out what
                  an SME genuinely needs to grow, building exactly that, and
                  pricing it so the tool never costs more than the growth it
                  enables. RealtyIllustrations is that approach applied to real
                  estate.
                </Typography>
              </Stack>
            </Box>
          </Grid2>

          {/* ── Lineage cards ── */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Stack spacing={2.5}>
              {lineage.map(({ year, title, body, icon }, index) => (
                <Box
                  key={title}
                  component={motion.div}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.15 + index * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  sx={{
                    position: "relative",
                    p: { xs: 2.5, md: 3 },
                    borderRadius: "16px",
                    border: index === 1 ? "1.5px solid" : "1px solid",
                    borderColor: index === 1 ? "primary.main" : "divider",
                    bgcolor:
                      index === 1
                        ? theme.palette.primary.alpha8
                        : "background.default",
                    overflow: "hidden",
                  }}
                >
                  {index === 1 && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: -70,
                        right: -70,
                        width: 190,
                        height: 190,
                        bgcolor: "primary.main",
                        opacity: 0.12,
                        filter: "blur(60px)",
                        borderRadius: "50%",
                        pointerEvents: "none",
                      }}
                    />
                  )}

                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ position: "relative" }}
                  >
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "12px",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: theme.palette.primary.alpha12,
                      }}
                    >
                      <SvgIcon sx={{ fontSize: 21, color: "primary.main" }}>
                        {icon}
                      </SvgIcon>
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "text.disabled",
                          mb: 0.5,
                        }}
                      >
                        {year}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "1.0625rem",
                          fontWeight: 700,
                          color: "text.primary",
                          lineHeight: 1.3,
                          mb: 1,
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
                </Box>
              ))}

              {/* Connector note */}
              <Typography
                sx={{
                  fontSize: "0.8125rem",
                  color: "text.disabled",
                  textAlign: "center",
                  lineHeight: 1.6,
                  px: 2,
                }}
              >
                Same team, same mission, narrower focus — built on{" "}
                {new Date().getFullYear() - 2018} years of work with small
                businesses.
              </Typography>
            </Stack>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
}
