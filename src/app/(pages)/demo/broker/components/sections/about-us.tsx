"use client";

import {
  Box,
  Container,
  Stack,
  Typography,
  Grid2,
  Card,
  Button,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "nextjs-toploader/app";

export default function AboutSection({ adminId }: { adminId?: string }) {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 10, md: 16 },
        position: "relative",
        overflow: "hidden",
        background: (theme) =>
          `linear-gradient(to bottom, ${theme.palette.background.paper}, ${theme.palette.primary.alpha30})`,
      }}
    >
      {/* Decorative SVG Background */}
      <Box
        component="svg"
        viewBox="0 0 800 600"
        sx={{
          position: "absolute",
          top: "-100px",
          left: "-100px",
          width: { xs: "400px", md: "800px" },
          opacity: 0.05,
          zIndex: 0,
        }}
      >
        <path
          d="M300,200 C400,100 600,300 500,400 C400,500 200,400 300,200 Z"
          fill="#000"
        />
      </Box>

      <Box
        component="svg"
        viewBox="0 0 800 600"
        sx={{
          position: "absolute",
          bottom: "-100px",
          right: "-100px",
          width: { xs: "400px", md: "700px" },
          opacity: 0.04,
          zIndex: 0,
        }}
      >
        <path
          d="M600,400 C500,500 300,300 400,200 C500,100 700,200 600,400 Z"
          fill="#000"
        />
      </Box>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Grid2 container spacing={6} alignItems="center">
          {/* Text Content */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Stack
              spacing={3}
              component={motion.div}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h3"
                fontWeight="bold"
                sx={{
                  background: `linear-gradient(to right, ${theme.palette.primary.dark}, ${theme.palette.primary.light})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Redefining Real Estate
              </Typography>

              <Typography variant="h6">
                At Emperia Realty, we’re not just selling homes — we’re crafting
                experiences. Our mission is to simplify your real estate journey
                with elegance, precision, and people-first service.
              </Typography>

              <Typography variant="body1">
                Our diverse team of real estate professionals brings years of
                experience across luxury homes, first-time buyers, commercial
                properties, and investment solutions. We are passionate,
                data-driven, and committed to helping you succeed.
              </Typography>

              <Typography variant="body1">
                Whether you’re settling into your first apartment or selling a
                multimillion-dollar estate, you deserve care, clarity, and a
                trusted partner. That’s what we deliver — every time.
              </Typography>

              <Stack direction="row" spacing={2} justifyContent="center" pt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  sx={{
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                  onClick={() =>
                    router.push(
                      adminId
                        ? `/demo/broker/sell?admin=${adminId}`
                        : `/demo/broker/sell`
                    )
                  }
                >
                  Start Your Selling Journey
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="medium"
                  sx={{
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                  onClick={() =>
                    router.push(
                      adminId
                        ? `/demo/broker/listings?category=${"For Sale"}&admin=${adminId}`
                        : `/demo/broker/listings?category=${"For Sale"}`
                    )
                  }
                >
                  Find Your Dream Home
                </Button>
              </Stack>
            </Stack>
          </Grid2>

          {/* Team Image with Next.js Optimization */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Card
              component={motion.div}
              elevation={4}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: { xs: 280, md: 400 },
                }}
              >
                <Image
                  src="/images/team.jpeg" // Replace with your image path
                  alt="Our Real Estate Team"
                  fill
                  priority
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Card>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
}
