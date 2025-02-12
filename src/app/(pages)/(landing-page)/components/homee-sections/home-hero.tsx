"use client";

import React from "react";
import { Box, Typography, Button, Container, useTheme } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const HomeHeroSection: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      {/* Background Image */}
      <Image
        src="/images/background-image.jpg" // Replace with your image path
        alt="Realtor Hero Background"
        layout="fill"
        objectFit="cover"
        quality={100}
        style={{ zIndex: -1 }}
      />

      {/* Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: `rgba(0, ${theme.palette.primary.main}, ${theme.palette.primary.light}, 0.5)`,
          zIndex: 0,
        }}
      />

      {/* Content with Framer Motion Animations */}
      <Container maxWidth="md" sx={{ zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography
            variant="h2"
            sx={{
              mb: 2,
            }}
          >
            Transform Your Real Estate Business
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Typography
            variant="h5"
            sx={{ mb: 4, fontSize: { xs: "1.2rem", md: "1.5rem" } }}
          >
            Explore our live demo and see how we can help you stand out in the
            market.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link href="/demo">
            <Button variant="contained" size="large">
              Explore Demo
            </Button>
          </Link>
        </motion.div>
      </Container>

      {/* Animated Scrolling Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        style={{
          position: "absolute",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1,
        }}
      >
        <Typography variant="body2" sx={{ mb: 1 }}>
          Scroll Down
        </Typography>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <Box
            sx={{
              width: "24px",
              height: "24px",
              borderBottom: `2px solid ${theme.palette.common.white}`,
              borderRight: `2px solid ${theme.palette.common.white}`,
              transform: "rotate(45deg)",
            }}
          />
        </motion.div>
      </motion.div>
    </Box>
  );
};

export default HomeHeroSection;
