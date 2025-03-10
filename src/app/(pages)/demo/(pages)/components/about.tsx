"use client";

import React from "react";
import { Box, Container, Typography, Grid2, Button } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const AboutUs = ({
  adminId,
  hompage,
}: {
  adminId?: string;
  hompage?: boolean;
}) => {
  return (
    <Container maxWidth={hompage ? "xl" : "lg"} sx={{ my: 8 }}>
      <Grid2 container spacing={12} alignItems="center">
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
            <Typography variant="h6" color="text.secondary" sx={{ my: 2 }}>
              Hi, I&apos;m Alex Johnson, an independent realtor passionate about
              helping clients find their perfect home. With over a decade of
              experience in the real estate industry, I specialize in connecting
              buyers, sellers, and renters with the best properties available.
            </Typography>
            <Typography variant="body1" sx={{ my: 2 }}>
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
            <Box sx={{ position: "relative", width: "100%", height: 400 }}>
              <Image
                src="/images/agent.jpeg"
                alt="Real Estate Agent"
                fill
                style={{ objectFit: "cover", borderRadius: 12 }}
              />
            </Box>
          </motion.div>
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default AboutUs;
