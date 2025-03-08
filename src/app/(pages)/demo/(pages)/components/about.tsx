"use client";

import React from "react";
import { Box, Container, Typography, Grid2, Button } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";

const AboutUs = ({ adminId }: { adminId?: string }) => {
  return (
    <Container maxWidth="md" sx={{ my: 6, fontFamily: "Poppins, sans-serif" }}>
      <Grid2 container spacing={4} alignItems="center">
        {/* Text Section */}
        <Grid2 size={{ xs: 12, md: 6 }}>
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
              your unique needs. Whether you&apos;re buying, selling, or
              renting, I provide expert guidance, innovative marketing, and a
              seamless transaction experience.
            </Typography>
            <Link
              href={
                adminId
                  ? `/demo/contact/general?admin=${adminId}`
                  : "/demo/contact/general"
              }
            >
              <Button variant="contained" color="primary" size="large">
                Contact Me
              </Button>
            </Link>
          </motion.div>
        </Grid2>

        {/* Image Section */}
        <Grid2 size={{ xs: 12, md: 6 }}>
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
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default AboutUs;
