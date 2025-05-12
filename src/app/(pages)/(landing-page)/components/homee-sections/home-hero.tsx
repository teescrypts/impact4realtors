"use client";

import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { motion, useCycle } from "framer-motion";
import Image from "next/image";
import { useRouter } from "nextjs-toploader/app";
import { useEffect } from "react";

export default function HomeHero() {
  const [current, cycle] = useCycle("first", "second");
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      cycle();
    }, 4000);
    return () => clearInterval(interval);
  }, [cycle]);

  const images = [
    {
      src: "/images/bg-demo.webp",
      alt: "Dashboard Design",
    },
    {
      src: "/images/bg-demo2.webp",
      alt: "Homepage Design",
    },
  ];

  return (
    <Box
      sx={{
        position: "relative",
        bgcolor: "background.default",
        py: { xs: 8, md: 12 },
        overflow: "hidden",
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Background Decorative Glows */}
      <Box
        sx={{
          position: "absolute",
          top: -80,
          left: -100,
          width: 300,
          height: 300,
          background: "linear-gradient(135deg, #90caf9 0%, #e3f2fd 100%)",
          opacity: 0.3,
          filter: "blur(80px)",
          borderRadius: "50%",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -100,
          right: -120,
          width: 400,
          height: 400,
          background: "linear-gradient(135deg, #f48fb1 0%, #fce4ec 100%)",
          opacity: 0.3,
          filter: "blur(100px)",
          borderRadius: "50%",
          zIndex: 0,
        }}
      />

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          alignItems="center"
          justifyContent="space-between"
          gap={{ xs: 6, md: 10 }}
        >
          {/* Left Side - Text */}
          <Box flex={1}>
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                }}
              >
                Empower Your Real Estate Brand
              </Typography>

              <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                Capture leads, manage agents seamlessly, book appointments, and
                showcase stunning listings — all through a professional,
                custom-built website.
              </Typography>

              {/* CTA Buttons */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  onClick={() =>
                    router.push(`/demo/auth/demo/login?type=agent`)
                  }
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Explore as Agent
                </Button>
                <Button
                  onClick={() =>
                    router.push(`/demo/auth/demo/login?type=broker`)
                  }
                  variant="outlined"
                  color="primary"
                  size="large"
                >
                  Explore as Broker
                </Button>
              </Stack>
            </motion.div>
          </Box>

          {/* Right Side - Animated Images */}
          <Box
            flex={1}
            sx={{
              width: "100%",
              maxWidth: 500,
              mx: "auto",
              position: "relative",
              height: { xs: 300, md: 400 },
            }}
          >
            {/* First Image */}
            <motion.div
              animate={{
                zIndex: current === "first" ? 2 : 1,
                scale: current === "first" ? 1 : 0.9,
                x: current === "first" ? 0 : -20,
                y: current === "first" ? 0 : 20,
                rotate: current === "first" ? 0 : -5,
                boxShadow:
                  current === "first"
                    ? "0 12px 32px rgba(0,0,0,0.3)"
                    : "0 4px 12px rgba(0,0,0,0.15)",
              }}
              transition={{ duration: 0.8 }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              <Image
                src={images[0].src}
                alt={images[0].alt}
                layout="fill"
                objectFit="cover"
                priority
              />
            </motion.div>

            {/* Second Image */}
            <motion.div
              animate={{
                zIndex: current === "second" ? 2 : 1,
                scale: current === "second" ? 1 : 0.9,
                x: current === "second" ? 0 : -20,
                y: current === "second" ? 0 : 20,
                rotate: current === "second" ? 0 : -5,
                boxShadow:
                  current === "second"
                    ? "0 12px 32px rgba(0,0,0,0.3)"
                    : "0 4px 12px rgba(0,0,0,0.15)",
              }}
              transition={{ duration: 0.8 }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              <Image
                src={images[1].src}
                alt={images[1].alt}
                layout="fill"
                objectFit="cover"
                priority
              />
            </motion.div>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
