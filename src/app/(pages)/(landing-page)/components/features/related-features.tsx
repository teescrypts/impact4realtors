"use client";

import { Box, Container, Grid2, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import FeatureCard from "./feature-card";
import { getRelatedFeatures } from "./feature-data";

export default function RelatedFeatures({ slug }: { slug: string }) {
  const related = getRelatedFeatures(slug);

  if (related.length === 0) return null;

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
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "flex-end" }}
          spacing={2}
          sx={{ mb: { xs: 4, md: 5 } }}
        >
          <Box>
            <Typography
              component="span"
              sx={{
                display: "block",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "text.disabled",
                mb: 1.5,
              }}
            >
              Works with
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "1.5rem", md: "2rem" },
                lineHeight: 1.25,
                letterSpacing: "-0.02em",
                color: "text.primary",
              }}
            >
              Related features
            </Typography>
          </Box>

          <Box
            component={Link}
            href="/features"
            sx={{
              fontSize: "0.875rem",
              fontWeight: 700,
              color: "primary.main",
              textDecoration: "none",
              whiteSpace: "nowrap",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            View all features →
          </Box>
        </Stack>

        <Grid2 container spacing={2.5}>
          {related.map((feature, index) => (
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={feature.slug}>
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
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
