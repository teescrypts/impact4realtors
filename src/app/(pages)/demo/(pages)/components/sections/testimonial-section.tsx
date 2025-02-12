"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
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
        py: 8,
        px: 3,
        background: "linear-gradient(135deg, #2C3E50, #4CA1AF)",
        color: "white",
      }}
    >
      <Typography variant="h4" fontWeight="bold" mb={4}>
        What Our Customers Say
      </Typography>

      <Box display="flex" justifyContent="center" alignItems="center">
        <IconButton onClick={handlePrev} sx={{ color: "white" }}>
          <ChevronLeft />
        </IconButton>

        <motion.div
          key={testimonials[currentIndex].id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            sx={{
              maxWidth: 500,
              mx: "auto",
              py: 4,
              px: 3,
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: 3,
              boxShadow: 3,
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <CardContent>
              <Avatar
                src={testimonials[currentIndex].image}
                sx={{ width: 80, height: 80, mx: "auto", mb: 2 }}
              />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {testimonials[currentIndex].name}
              </Typography>
              <Typography variant="body1" fontStyle="italic">
              &quot;{testimonials[currentIndex].review}&quot;
              </Typography>
            </CardContent>
          </Card>
        </motion.div>

        <IconButton onClick={handleNext} sx={{ color: "white" }}>
          <ChevronRight />
        </IconButton>
      </Box>
    </Box>
  );
}
