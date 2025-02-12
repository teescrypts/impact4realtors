"use client"

import React from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Grid2,
} from "@mui/material";
import { motion } from "framer-motion";

const PricingSection: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6, textAlign: "center" }}>
      {/* Section Heading */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Flexible Pricing, Built for Growth
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          We believe in growing with realtors. Whether you&apos;re just starting or
          already successful, we have a plan that fits your needs.
        </Typography>
      </motion.div>

      {/* Pricing Cards */}
      <Grid2 container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
        {/* Customization Fee */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Card
              elevation={3}
              sx={{
                borderRadius: 4,
                p: 3,
                textAlign: "center",
                background: "linear-gradient(135deg, #ff7eb3, #ff758c)",
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color="white"
                  gutterBottom
                >
                  Customization Package
                </Typography>
                <Typography variant="h3" fontWeight="bold" color="white">
                  $150
                </Typography>
                <Typography variant="body2" color="white" paragraph>
                  (50% Discount Applied)
                </Typography>
                <Typography variant="body2" color="white" paragraph>
                  Includes domain & hosting for 1 year + 6 months of free
                  support.
                </Typography>
                <Button variant="contained" color="secondary" sx={{ mt: 2 }}>
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </Grid2>

        {/* Hosting Fee */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card
              elevation={3}
              sx={{
                borderRadius: 4,
                p: 3,
                textAlign: "center",
                background: "linear-gradient(135deg, #7ed957, #2ebf91)",
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color="white"
                  gutterBottom
                >
                  Hosting Plan
                </Typography>
                <Typography variant="h3" fontWeight="bold" color="white">
                  $0 - $50
                </Typography>
                <Typography variant="body2" color="white" paragraph>
                  Hosting fees vary based on business size.
                </Typography>
                <Typography variant="body2" color="white" paragraph>
                  We grow with you! Start for free and scale as your business
                  expands.
                </Typography>
                <Button variant="contained" color="secondary" sx={{ mt: 2 }}>
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </Grid2>
      </Grid2>

      {/* Call to Action */}
      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Already Established? We Customize for You!
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          If you&apos;re a big player in the market, we can tailor every feature to
          match your business needs. Let&apos;s build something great together!
        </Typography>
        <Button variant="contained" color="primary" size="large">
          Contact Us
        </Button>
      </Box>
    </Container>
  );
};

export default PricingSection;
