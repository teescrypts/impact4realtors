"use client";

import { Box, Container, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import Image from "next/image";
import CtaButtons from "../cta-buttons";

const facts = [
  { value: "2018", label: "working with SMEs" },
  { value: "USA", label: "where our clients build" },
  { value: "$30", label: "per month, flat" },
];

export default function AboutHero() {
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
        <Box sx={{ maxWidth: 820, mx: "auto", textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Parent company badge */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.25}
              sx={{
                display: "inline-flex",
                mb: 3,
                pl: 0.75,
                pr: 1.75,
                py: 0.75,
                borderRadius: "999px",
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
              }}
            >
              <Image
                src="/images/logo.png"
                alt="Impact Illustration"
                width={22}
                height={22}
                style={{ objectFit: "contain", borderRadius: 6 }}
              />
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "text.secondary",
                }}
              >
                A project by{" "}
                <Box
                  component="span"
                  sx={{ color: "text.primary", fontWeight: 700 }}
                >
                  Impact Illustration
                </Box>
              </Typography>
            </Stack>

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
              We help small businesses grow{" "}
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
                within their capacity
              </Box>
              .
            </Typography>

            {/* Sub-copy */}
            <Typography
              sx={{
                fontSize: { xs: "1rem", md: "1.125rem" },
                color: "text.secondary",
                lineHeight: 1.75,
                maxWidth: 640,
                mx: "auto",
              }}
            >
              Impact Illustration has been building digital technology for small
              and medium businesses across America since 2018.
              RealtyIllustrations is what came out of that work when we turned
              our attention to real estate agents.
            </Typography>

            <Box sx={{ mt: 4.5 }}>
              <CtaButtons align="center" />
            </Box>
          </motion.div>

          {/* Fact strip */}
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
            {facts.map(({ value, label }) => (
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
