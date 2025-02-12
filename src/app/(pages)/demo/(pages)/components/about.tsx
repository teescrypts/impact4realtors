"use client";

import React from "react";
import { Box, Container, Typography, Grid, Button } from "@mui/material";
import { motion } from "framer-motion";

const AboutUs = () => {
  return (
    <Container maxWidth="md" sx={{ my: 6, fontFamily: "Poppins, sans-serif" }}>
      <Grid container spacing={4} alignItems="center">
        {/* Text Section */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              About Me
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
              Hi, I&apos;m Alex Johnson, an independent realtor passionate about
              helping clients find their perfect home. With over a decade of
              experience in the real estate industry, I specialize in connecting
              buyers, sellers, and renters with the best properties available.
            </Typography>
            <Typography variant="body1" paragraph>
              My approach is personal and hands-on—tailoring strategies to fit
              your unique needs. Whether you&apos;re buying, selling, or renting, I
              provide expert guidance, innovative marketing, and a seamless
              transaction experience.
            </Typography>
            <Button variant="contained" color="primary" size="large">
              Contact Me
            </Button>
          </motion.div>
        </Grid>

        {/* Image Section */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box
              component="img"
              src="/images/agent.jpeg"
              alt="Real Estate Agent"
              sx={{ width: "100%", borderRadius: 3, boxShadow: 3 }}
            />
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AboutUs;
