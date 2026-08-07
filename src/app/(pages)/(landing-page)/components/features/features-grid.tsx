"use client";

import { Box, Container, Grid2 } from "@mui/material";
import { motion } from "framer-motion";
import FeatureCard from "./feature-card";
import { features } from "./feature-data";

export default function FeaturesGrid() {
  return (
    <Box
      sx={{
        bgcolor: "background.default",
        py: { xs: 8, md: 11 },
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Grid2 container spacing={2.5}>
          {features.map((feature, index) => (
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={feature.slug}>
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.5,
                  delay: (index % 3) * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                sx={{ height: "100%" }}
              >
                <FeatureCard feature={feature} />
              </Box>
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </Box>
  );
}
