"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Container,
  useTheme,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import ChevronRight from "@/app/icons/untitled-ui/duocolor/chevron-right";
import ChevronLeft from "@/app/icons/untitled-ui/duocolor/chevron-left";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    image: "/images/user1.jpg",
    review:
      "Emperia Realty made selling my home completely stress-free. The team was transparent, responsive, and strategic from day one.",
  },
  {
    id: 2,
    name: "Michael Lee",
    image: "/images/user2.jpg",
    review:
      "Their digital tools made it easy to stay updated and understand market insights — I always felt in control.",
  },
  {
    id: 3,
    name: "Jessica Brown",
    image: "/images/user3.jpg",
    review:
      "From staging advice to closing, the experience was flawless. I couldn’t have asked for a better realtor.",
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        py: { xs: 10, md: 14 },
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* Polygon background outlines */}
      <Box
        component="svg"
        viewBox="0 0 800 600"
        sx={{
          position: "absolute",
          top: "-80px",
          left: "-100px",
          width: { xs: "300px", md: "500px" },
          opacity: 0.08,
          stroke: theme.palette.primary.main,
          strokeWidth: 1.2,
          fill: "none",
        }}
      >
        <polygon points="100,10 190,80 160,180 40,180 10,80" />
      </Box>

      <Box
        component="svg"
        viewBox="0 0 800 600"
        sx={{
          position: "absolute",
          bottom: "-80px",
          right: "-120px",
          width: { xs: "320px", md: "600px" },
          opacity: 0.07,
          stroke: theme.palette.secondary.main,
          strokeWidth: 1.2,
          fill: "none",
        }}
      >
        <polygon points="200,10 350,80 300,200 100,200 50,80" />
      </Box>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Box
          display="grid"
          gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
          alignItems="center"
          gap={8}
        >
          {/* Left Text Content */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h3"
              fontWeight="bold"
              gutterBottom
              sx={{
                color: theme.palette.text.primary,
              }}
            >
              Stories That Inspire Confidence
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: "1.1rem",
                maxWidth: 450,
              }}
            >
              Every home we list and every client we serve tells a story. Hear
              from real people who trusted Emperia Realty to guide their
              property journey — and how we helped them move forward with
              confidence.
            </Typography>
          </Box>

          {/* Right Testimonial Card */}
          <Box textAlign="center">
            <Box display="flex" justifyContent="center" alignItems="center">
              <IconButton onClick={handlePrev}>
                <ChevronLeft />
              </IconButton>

              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonials[currentIndex].id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <Card
                    sx={{
                      maxWidth: 440,
                      mx: "auto",
                      py: 4,
                      px: 4,
                      borderRadius: 4,
                      boxShadow:
                        "0px 10px 40px rgba(0,0,0,0.08), 0px 4px 12px rgba(0,0,0,0.06)",
                      border: `1px solid ${theme.palette.divider}`,
                      backgroundColor: theme.palette.background.paper,
                    }}
                  >
                    <CardContent>
                      <Avatar
                        src={testimonials[currentIndex].image}
                        sx={{
                          width: 80,
                          height: 80,
                          mx: "auto",
                          mb: 2,
                          border: `2px solid ${theme.palette.primary.main}`,
                        }}
                      />
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        gutterBottom
                        color="text.primary"
                      >
                        {testimonials[currentIndex].name}
                      </Typography>
                      <Typography
                        variant="body1"
                        fontStyle="italic"
                        color="text.secondary"
                      >
                        “{testimonials[currentIndex].review}”
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>

              <IconButton onClick={handleNext}>
                <ChevronRight />
              </IconButton>
            </Box>

            {/* Indicators */}
            <Box display="flex" justifyContent="center" mt={3}>
              {testimonials.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    mx: 0.7,
                    background:
                      index === currentIndex
                        ? theme.palette.primary.main
                        : theme.palette.grey[400],
                    transition: "background 0.3s ease-in-out",
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
