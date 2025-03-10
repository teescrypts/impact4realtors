"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  IconButton,
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
      "This platform made finding my dream home so easy! The process was smooth, and the realtor was super helpful.",
  },
  {
    id: 2,
    name: "Michael Lee",
    image: "/images/user2.jpg",
    review:
      "I loved how intuitive and user-friendly the interface is. Booking a call with an agent was seamless.",
  },
  {
    id: 3,
    name: "Jessica Brown",
    image: "/images/user3.jpg",
    review:
      "A fantastic experience! The realtor was professional, and the house listing details were well-organized.",
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
      sx={{
        textAlign: "center",
        py: 10,
        px: 3,
        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.dark})`,
        color: "white",
      }}
    >
      <Typography variant="h4" fontWeight="bold" mb={5}>
        What Our Customers Say
      </Typography>

      <Box display="flex" justifyContent="center" alignItems="center">
        <IconButton onClick={handlePrev} sx={{ color: "white" }}>
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
                maxWidth: 500,
                mx: "auto",
                py: 5,
                px: 4,
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(12px)",
                borderRadius: 4,
                boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <CardContent>
                <Avatar
                  src={testimonials[currentIndex].image}
                  sx={{
                    width: 90,
                    height: 90,
                    mx: "auto",
                    mb: 2,
                    border: "3px solid white",
                  }}
                />
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {testimonials[currentIndex].name}
                </Typography>
                <Typography variant="body1" fontStyle="italic" color="white">
                  &quot;{testimonials[currentIndex].review}&quot;
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <IconButton onClick={handleNext} sx={{ color: "white" }}>
          <ChevronRight />
        </IconButton>
      </Box>

      {/* Indicators */}
      <Box display="flex" justifyContent="center" mt={3}>
        {testimonials.map((_, index) => (
          <Box
            key={index}
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              mx: 0.5,
              background:
                index === currentIndex ? "white" : "rgba(255, 255, 255, 0.5)",
              transition: "background 0.3s ease-in-out",
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
