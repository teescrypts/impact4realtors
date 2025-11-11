"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid2,
  Button,
  Stack,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const AboutUs = ({ adminId }: { adminId?: string }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        overflow: "hidden",
      }}
    >
      <Container
        maxWidth={"lg"}
        sx={{
          py: { xs: 8, md: 12 },
          position: "relative",
        }}
      >
        <Grid2
          container
          spacing={{ xs: 6, md: 10 }}
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Text Section */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h3"
                fontWeight={700}
                sx={{
                  mb: 2,
                  color: "text.primary",
                  lineHeight: 1.2,
                  fontSize: { xs: "2rem", md: "2.8rem" },
                }}
              >
                Turning Your Home Goals Into Reality
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 550, mb: 3, fontSize: "1.1rem" }}
              >
                From first-time buyers to seasoned investors, I help clients
                discover homes that reflect who they are and where they’re
                headed. With expert market insight and a personalized approach,
                I make your real estate journey seamless, strategic, and
                stress-free.
              </Typography>

              <Stack spacing={1.2} sx={{ mb: 4 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  🏡 Over 100 families guided to their dream homes
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  📈 Expert in buying, selling & property investment
                </Typography>
              </Stack>

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
                    px: 5,
                    py: 1.4,
                    borderRadius: "999px",
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Let’s Connect
                </Button>
              </Link>
            </motion.div>
          </Grid2>

          {/* Polygon Image Section with Overflow */}
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
                  height: { xs: 320, md: 460 },
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  backgroundColor: "#f9fafb",
                  clipPath: {
                    xs: "none",
                    md: "polygon(18% 0%, 100% 0%, 100% 100%, 0% 100%)",
                  },
                  borderRadius: { xs: 4, md: 0 },
                  boxShadow: "0 10px 32px rgba(0,0,0,0.05)",
                  overflow: "visible",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: { xs: "100%", md: "105%" }, // extends slightly out of container
                    height: "100%",
                    overflow: "hidden",
                    borderRadius: { xs: 4, md: "0 24px 24px 0" },
                    clipPath: {
                      xs: "none",
                      md: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)",
                    },
                    boxShadow: {
                      xs: "none",
                      md: "0 12px 32px rgba(0,0,0,0.1)",
                    },
                    transform: { xs: "none", md: "translateX(3%)" }, // overflow to the right
                  }}
                >
                  <Image
                    src="/images/agent.jpeg"
                    alt="Realtor helping family"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </Box>
              </Box>
            </motion.div>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
};

export default AboutUs;
