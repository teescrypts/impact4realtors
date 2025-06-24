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
    <Container maxWidth={hompage ? "xl" : "lg"} sx={{ py: { xs: 8, md: 12 } }}>
      <Grid2 container spacing={10} alignItems="center">
        {/* Text Section */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h3"
              component="h2"
              fontWeight={700}
              gutterBottom
              sx={{ lineHeight: 1.3 }}
            >
              Meet Alex Johnson
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ my: 2, maxWidth: 600 }}
            >
              I’m a realtor with a passion for connecting people
              with homes that truly match their dreams. With over a decade of
              experience, I’ve helped buyers, sellers, and renters navigate the
              market with confidence.
            </Typography>

            <Typography
              variant="body1"
              sx={{ my: 2, color: "text.secondary", maxWidth: 600 }}
            >
              I believe real estate is about more than property — it’s about
              relationships. I offer tailored strategies, innovative marketing,
              and transparent guidance to make every step simple and rewarding.
            </Typography>

            <Link
              href={
                adminId
                  ? `/demo/contact/general?admin=${adminId}`
                  : "/demo/contact/general"
              }
              passHref
            >
              <Button
                variant="contained"
                size="large"
                sx={{
                  mt: 3,
                  px: 4,
                  borderRadius: "999px",
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                Contact Me
              </Button>
            </Link>
          </motion.div>
        </Grid2>

        {/* Image Section */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: { xs: 300, sm: 400, md: 450 },
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              }}
            >
              <Image
                src="/images/agent.jpeg"
                alt="Real Estate Agent"
                fill
                style={{ objectFit: "cover" }}
              />
            </Box>
          </motion.div>
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default AboutUs;
