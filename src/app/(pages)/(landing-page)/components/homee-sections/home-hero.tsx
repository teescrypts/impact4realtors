"use client";

import { Box, Button, Container, Stack, Typography, useTheme } from "@mui/material";
import { motion, useCycle } from "framer-motion";
import Image from "next/image";
import { useRouter } from "nextjs-toploader/app";
import { useEffect } from "react";

export default function HomeHero() {
  const [current, cycle] = useCycle("first", "second");
  const router = useRouter();
  const theme = useTheme()

  useEffect(() => {
    const interval = setInterval(() => cycle(), 4000);
    return () => clearInterval(interval);
  }, [cycle]);

  const images = [
    { src: "/images/image-1.jpg", alt: "Dashboard Design" },
    { src: "/images/image-2.png", alt: "Homepage Design" },
  ];

  return (
    <Box
      sx={{
        position: "relative",
        bgcolor: "background.default",
        py: { xs: 10, md: 16 },
        overflow: "hidden",
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Ambient glow — primary */}
      <Box
        sx={{
          position: "absolute",
          top: "-10%",
          left: "-8%",
          width: { xs: 280, md: 420 },
          height: { xs: 280, md: 420 },
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
          bottom: "-12%",
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
            linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          alignItems="center"
          justifyContent="space-between"
          gap={{ xs: 8, md: 12 }}
        >
          {/* ── Left: Text ── */}
          <Box flex={1} maxWidth={{ md: 560 }}>
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Eyebrow label */}
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
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
                  // Use alpha via sx opacity trick
                  "& span": { opacity: 1 },
                }}
              >
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    bgcolor: theme.palette.secondary.alpha12,
                    // Pulse dot
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
                    color: theme.palette.primary.main,
                  }}
                >
                  Real Estate Website
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
                  mb: 2.5,
                }}
              >
                Empower Your{" "}
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
                  Real Estate
                </Box>{" "}
                Brand
              </Typography>

              {/* Sub-copy */}
              <Typography
                sx={{
                  fontSize: { xs: "1rem", md: "1.125rem" },
                  color: "text.secondary",
                  lineHeight: 1.75,
                  mb: 5,
                  maxWidth: 480,
                }}
              >
                Capture leads, Automate follow-ups, Schedule appointments, and
                showcase stunning listings — all through a professional,
                custom-built website.
              </Typography>

              {/* CTAs */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() =>
                    router.push(
                      "https://calendly.com/impactillustration1/30min",
                    )
                  }
                  sx={{
                    fontWeight: 700,
                    borderRadius: "10px",
                    px: 4,
                    py: 1.6,
                    textTransform: "none",
                    fontSize: "1rem",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                    },
                  }}
                >
                  Book a demo →
                </Button>

                {/* <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  sx={{
                    fontWeight: 600,
                    borderRadius: "10px",
                    px: 4,
                    py: 1.6,
                    textTransform: "none",
                    fontSize: "1rem",
                    borderWidth: "1.5px",
                    transition: "transform 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      borderWidth: "1.5px",
                    },
                  }}
                >
                  See features
                </Button> */}
              </Stack>

              {/* Trust signal */}
              <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mt: 4,
                }}
              >
                {["success", "primary", "secondary"].map((color, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      bgcolor: `${color}.main`,
                      opacity: 0.85,
                      border: "2px solid",
                      borderColor: "background.default",
                      ml: i > 0 ? -1.5 : 0,
                    }}
                  />
                ))}
                <Typography
                  sx={{
                    fontSize: "0.8125rem",
                    color: "text.secondary",
                    fontWeight: 500,
                  }}
                >
                  Book a live demo to see it in action
                </Typography>
              </Box>
            </motion.div>
          </Box>

          {/* ── Right: Animated image stack ── */}
          <Box
            flex={1}
            sx={{
              width: "100%",
              maxWidth: { xs: "100%", md: 520 },
              mx: "auto",
              position: "relative",
              height: { xs: 280, sm: 360, md: 460 },
            }}
          >
            {/* Decorative ring behind images */}
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "80%",
                height: "80%",
                border: "1.5px dashed",
                borderColor: "primary.main",
                opacity: 0.12,
                borderRadius: "24px",
                pointerEvents: "none",
              }}
            />

            {images.map((img, i) => {
              const isActive =
                (i === 0 && current === "first") ||
                (i === 1 && current === "second");
              return (
                <motion.div
                  key={i}
                  animate={{
                    zIndex: isActive ? 2 : 1,
                    scale: isActive ? 1 : 0.88,
                    x: isActive ? 0 : -24,
                    y: isActive ? 0 : 24,
                    rotate: isActive ? 0 : -4,
                    opacity: isActive ? 1 : 0.6,
                  }}
                  transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: 20,
                    overflow: "hidden",
                    boxShadow: isActive
                      ? "0 24px 60px rgba(0,0,0,0.2)"
                      : "0 6px 20px rgba(0,0,0,0.1)",
                  }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    layout="fill"
                    objectFit="cover"
                    priority
                  />
                </motion.div>
              );
            })}

            {/* Slide indicator dots */}
            <Box
              sx={{
                position: "absolute",
                bottom: -28,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 1,
              }}
            >
              {images.map((_, i) => {
                const isActive =
                  (i === 0 && current === "first") ||
                  (i === 1 && current === "second");
                return (
                  <Box
                    key={i}
                    sx={{
                      height: 6,
                      width: isActive ? 24 : 6,
                      borderRadius: "4px",
                      bgcolor: isActive ? "primary.main" : "text.disabled",
                      transition: "all 0.4s ease",
                    }}
                  />
                );
              })}
            </Box>
          </Box>
        </Box>
      </Container>

      {/* <div id="features"></div> */}
    </Box>
  );
}
