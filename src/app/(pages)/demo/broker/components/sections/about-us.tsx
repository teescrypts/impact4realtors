"use client";

import {
  Box,
  Container,
  Stack,
  Typography,
  Grid2,
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
      {/* Decorative SVG Backgrounds */}
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

          {/* Polygon Image with Overflow */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: { xs: 300, md: 420 },
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  backgroundColor: "#f9fafb",
                  clipPath: {
                    xs: "none",
                    md: "polygon(18% 0%, 100% 0%, 100% 100%, 0% 100%)",
                  },
                  borderRadius: { xs: 4, md: 0 },
                  overflow: "visible",
                  boxShadow: "0 10px 28px rgba(0,0,0,0.05)",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: { xs: "100%", md: "105%" },
                    height: "100%",
                    overflow: "hidden",
                    borderRadius: { xs: 4, md: "0 24px 24px 0" },
                    clipPath: {
                      xs: "none",
                      md: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)",
                    },
                    transform: { xs: "none", md: "translateX(3%)" },
                    boxShadow: {
                      xs: "none",
                      md: "0 12px 32px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <Image
                    src="/images/team.jpeg"
                    alt="Our Real Estate Team"
                    fill
                    priority
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </Box>
              </Box>
            </motion.div>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
}
