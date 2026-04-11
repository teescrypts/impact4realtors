"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Container,
  Stack,
  Chip,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import ChevronRight from "@/app/icons/untitled-ui/duocolor/chevron-right";
import ChevronLeft from "@/app/icons/untitled-ui/duocolor/chevron-left";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Home Seller",
    image: "/images/user1.jpg",
    review:
      "Emperia Realty made selling my home completely stress-free. The team was transparent, responsive, and strategic from day one.",
  },
  {
    id: 2,
    name: "Michael Lee",
    role: "First-Time Buyer",
    image: "/images/user2.jpg",
    review:
      "Their digital tools made it easy to stay updated and understand market insights — I always felt in control of the process.",
  },
  {
    id: 3,
    name: "Jessica Brown",
    role: "Property Investor",
    image: "/images/user3.jpg",
    review:
      "From staging advice to closing, the experience was flawless. I couldn't have asked for a better team to guide me.",
  },
];

const StarRating = ({ count = 5 }: { count?: number }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" spacing={0.5}>
      {Array.from({ length: count }).map((_, i) => (
        <Box
          key={i}
          component="span"
          sx={{
            color: theme.palette.warning.main,
            fontSize: "1rem",
            lineHeight: 1,
          }}
        >
          ★
        </Box>
      ))}
    </Stack>
  );
};

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((i) => (i + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        py: { xs: 9, md: 13 },
        bgcolor: isDark ? "grey.950" : "grey.50",
      }}
    >
      {/* Background orbs */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "-20%",
            left: "-10%",
            width: { xs: 280, md: 500 },
            height: { xs: 280, md: 500 },
            borderRadius: "50%",
            background: `radial-gradient(circle, ${alpha(primary, 0.08)} 0%, transparent 70%)`,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "-15%",
            right: "-8%",
            width: { xs: 220, md: 400 },
            height: { xs: 220, md: 400 },
            borderRadius: "50%",
            background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.07)} 0%, transparent 70%)`,
          }}
        />
      </Box>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          display="grid"
          gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
          alignItems="center"
          gap={{ xs: 7, md: 10 }}
        >
          {/* ── Left: Copy ── */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Stack spacing={3}>
              <Chip
                label="Client Stories"
                size="small"
                sx={{
                  alignSelf: "flex-start",
                  bgcolor: alpha(primary, 0.08),
                  color: "primary.main",
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  border: `1px solid ${alpha(primary, 0.18)}`,
                  borderRadius: 1,
                  height: 26,
                }}
              />

              <Box>
                <Typography
                  variant="h3"
                  fontWeight={900}
                  letterSpacing="-0.03em"
                  lineHeight={1.1}
                  sx={{
                    fontSize: { xs: "1.85rem", sm: "2.4rem", md: "2.75rem" },
                  }}
                >
                  Stories that inspire
                  <Box component="span" sx={{ color: "primary.main" }}>
                    {" "}
                    confidence
                  </Box>
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  lineHeight={1.75}
                  sx={{ mt: 2, maxWidth: 420 }}
                >
                  Every home we list and every client we serve tells a story.
                  Hear from real people who trusted Emperia Realty to guide
                  their property journey — and how we helped them move forward.
                </Typography>
              </Box>

              {/* Social proof numbers */}
              <Stack direction="row" spacing={4} sx={{ pt: 1 }}>
                {[
                  { value: "500+", label: "Happy Clients" },
                  { value: "4.9", label: "Average Rating" },
                  { value: "12 yrs", label: "In Business" },
                ].map(({ value, label }) => (
                  <Box key={label}>
                    <Typography
                      fontWeight={800}
                      sx={{
                        fontSize: "1.4rem",
                        color: "primary.main",
                        lineHeight: 1,
                      }}
                    >
                      {value}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      mt={0.5}
                    >
                      {label}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Stack>
          </Box>

          {/* ── Right: Testimonial card ── */}
          <Stack spacing={3} alignItems="center">
            <Box sx={{ width: "100%", maxWidth: 460, position: "relative" }}>
              {/* Quote mark */}
              <Typography
                aria-hidden
                sx={{
                  position: "absolute",
                  top: -20,
                  left: 24,
                  fontSize: "7rem",
                  lineHeight: 1,
                  color: alpha(primary, 0.12),
                  fontFamily: "Georgia, serif",
                  pointerEvents: "none",
                  userSelect: "none",
                  zIndex: 0,
                }}
              >
                &quot;
              </Typography>

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current.id}
                  custom={direction}
                  variants={{
                    enter: (d: number) => ({ opacity: 0, x: d * 48 }),
                    center: { opacity: 1, x: 0 },
                    exit: (d: number) => ({ opacity: 0, x: d * -48 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.38, ease: "easeInOut" }}
                >
                  <Box
                    sx={{
                      p: { xs: 3, sm: 4 },
                      borderRadius: 4,
                      border: "1px solid",
                      borderColor: isDark
                        ? alpha("#fff", 0.08)
                        : alpha("#000", 0.07),
                      bgcolor: isDark ? alpha("#fff", 0.03) : "white",
                      boxShadow: isDark
                        ? "none"
                        : `0 4px 32px ${alpha("#000", 0.08)}`,
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <Stack spacing={2.5}>
                      {/* Avatar + name */}
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          src={current.image}
                          alt={current.name}
                          sx={{
                            width: 56,
                            height: 56,
                            border: `2px solid ${alpha(primary, 0.3)}`,
                            boxShadow: `0 0 0 3px ${alpha(primary, 0.1)}`,
                          }}
                        />
                        <Box>
                          <Typography fontWeight={700} lineHeight={1.2}>
                            {current.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {current.role}
                          </Typography>
                        </Box>
                        <Box sx={{ ml: "auto" }}>
                          <StarRating />
                        </Box>
                      </Stack>

                      <Typography
                        variant="body1"
                        color="text.secondary"
                        lineHeight={1.75}
                        fontStyle="italic"
                      >
                        &quot;{current.review}&quot;
                      </Typography>
                    </Stack>
                  </Box>
                </motion.div>
              </AnimatePresence>
            </Box>

            {/* Controls */}
            <Stack direction="row" alignItems="center" spacing={2}>
              <IconButton
                onClick={handlePrev}
                size="small"
                sx={{
                  bgcolor: isDark ? alpha("#fff", 0.06) : alpha("#000", 0.05),
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1.5,
                  "&:hover": {
                    bgcolor: "primary.main",
                    borderColor: "primary.main",
                    color: "white",
                    "& svg": { color: "white" },
                  },
                  transition: "all 0.18s ease",
                  p: 1,
                }}
              >
                <ChevronLeft />
              </IconButton>

              {/* Dot indicators */}
              <Stack direction="row" spacing={0.75}>
                {testimonials.map((_, i) => (
                  <Box
                    key={i}
                    onClick={() => {
                      setDirection(i > currentIndex ? 1 : -1);
                      setCurrentIndex(i);
                    }}
                    sx={{
                      width: i === currentIndex ? 24 : 8,
                      height: 8,
                      borderRadius: 4,
                      bgcolor:
                        i === currentIndex
                          ? "primary.main"
                          : alpha(primary, 0.2),
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                  />
                ))}
              </Stack>

              <IconButton
                onClick={handleNext}
                size="small"
                sx={{
                  bgcolor: isDark ? alpha("#fff", 0.06) : alpha("#000", 0.05),
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1.5,
                  "&:hover": {
                    bgcolor: "primary.main",
                    borderColor: "primary.main",
                    "& svg": { color: "white" },
                  },
                  transition: "all 0.18s ease",
                  p: 1,
                }}
              >
                <ChevronRight />
              </IconButton>
            </Stack>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
