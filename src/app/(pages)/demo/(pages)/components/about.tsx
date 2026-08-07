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
  Paper,
  Chip,
  SvgIcon,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Users03 from "@/app/icons/untitled-ui/duocolor/users-03";
import Home from "@/app/icons/untitled-ui/duocolor/home";
import ArrowRight from "@/app/icons/untitled-ui/duocolor/arrow-right";
import Star from "@/app/icons/untitled-ui/duocolor/star";
import Verified from "@/app/icons/untitled-ui/duocolor/verified";

const AboutUs = ({ adminId }: { adminId?: string }) => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  // Achievement stats
  const achievements = [
    {
      icon: <Users03 />,
      value: "100+",
      label: "Happy Families",
      color: theme.palette.success.main,
    },
    {
      icon: <Home />,
      value: "$50M+",
      label: "Sales Closed",
      color: theme.palette.primary.main,
    },
    {
      icon: <Verified />,
      value: "15+",
      label: "Years Experience",
      color: theme.palette.warning.main,
    },
  ];

  // Key features
  const features = [
    {
      icon: "🏡",
      text: "Expert in residential & commercial properties",
    },
    {
      icon: "📈",
      text: "Strategic market insights & investment guidance",
    },
    {
      icon: "🤝",
      text: "Personalized service from start to finish",
    },
    {
      icon: "⚡",
      text: "Fast, transparent, and stress-free process",
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative background elements */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(primary, 0.06)}, transparent)`,
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -150,
          left: -150,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(primary, 0.04)}, transparent)`,
          pointerEvents: "none",
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 8, md: 14 },
          position: "relative",
        }}
      >
        <Grid2
          container
          spacing={{ xs: 6, md: 8 }}
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Text Section */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <Stack spacing={4}>
                {/* Badge */}
                <Box>
                  <Chip
                    icon={
                      <SvgIcon sx={{ fontSize: 18 }}>
                        <Verified />
                      </SvgIcon>
                    }
                    label="Trusted Real Estate Expert"
                    sx={{
                      bgcolor: alpha(primary, 0.1),
                      color: primary,
                      fontWeight: 600,
                      px: 1.5,
                      "& .MuiChip-icon": {
                        color: primary,
                      },
                    }}
                  />
                </Box>
                {/* Headline */}
                <Box>
                  <Typography
                    variant="h2"
                    fontWeight={800}
                    sx={{
                      mb: 2,
                      color: "text.primary",
                      lineHeight: 1.2,
                      fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Turning Your Home Goals{" "}
                    <Box
                      component="span"
                      sx={{
                        background: `linear-gradient(135deg, ${primary}, ${theme.palette.primary.dark})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        position: "relative",
                        display: "inline-block",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: 3,
                          background: `linear-gradient(90deg, ${primary}, ${theme.palette.primary.dark})`,
                          borderRadius: 2,
                        },
                      }}
                    >
                      Into Reality
                    </Box>
                  </Typography>

                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{
                      maxWidth: 550,
                      fontWeight: 400,
                      lineHeight: 1.7,
                    }}
                  >
                    From first-time buyers to seasoned investors, I help clients
                    discover homes that reflect who they are and where they&apos;re
                    headed.
                  </Typography>
                </Box>
                {/* Features Grid */}
                <Grid2 container spacing={2}>
                  {features.map((feature, index) => (
                    <Grid2 size={{ xs: 12, sm: 6 }} key={index}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            bgcolor: alpha(primary, 0.03),
                            border: `1px solid ${alpha(primary, 0.08)}`,
                            borderRadius: 2,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              bgcolor: alpha(primary, 0.06),
                              borderColor: alpha(primary, 0.15),
                              transform: "translateY(-2px)",
                            },
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="start"
                          >
                            <Typography variant="h5" sx={{ lineHeight: 1 }}>
                              {feature.icon}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontWeight: 500, lineHeight: 1.5 }}
                            >
                              {feature.text}
                            </Typography>
                          </Stack>
                        </Paper>
                      </motion.div>
                    </Grid2>
                  ))}
                </Grid2>
                {/* Stats */}
                <Box
                  sx={{
                    pt: 2,
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 1.5,
                  }}
                >
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                    >
                      <Box
                        sx={{
                          px: 2,
                          py: 1.75,
                          borderRadius: 2.5,
                          bgcolor: alpha(achievement.color, 0.07),
                          border: `1px solid ${alpha(achievement.color, 0.18)}`,
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          height: "100%",
                        }}
                      >
                        <Box
                          sx={{
                            width: 38,
                            height: 38,
                            borderRadius: 1.5,
                            bgcolor: alpha(achievement.color, 0.14),
                            color: achievement.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {achievement.icon}
                        </Box>
                        <Box>
                          <Typography
                            variant="h6"
                            fontWeight={800}
                            sx={{
                              lineHeight: 1,
                              color: achievement.color,
                              letterSpacing: "-0.02em",
                            }}
                          >
                            {achievement.value}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              fontWeight: 600,
                              fontSize: "0.68rem",
                              display: "block",
                              mt: 0.3,
                            }}
                          >
                            {achievement.label}
                          </Typography>
                        </Box>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
                {/* CTA Button */}
                <Box sx={{ pt: 2 }}>
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
                      endIcon={<ArrowRight />}
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "1.05rem",
                        background: `linear-gradient(135deg, ${primary}, ${theme.palette.primary.dark})`,
                        boxShadow: `0 8px 24px ${alpha(primary, 0.3)}`,
                        transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: `0 12px 32px ${alpha(primary, 0.4)}`,
                        },
                      }}
                    >
                      Let&apos;s Connect
                    </Button>
                  </Link>
                </Box>
              </Stack>
            </motion.div>
          </Grid2>

          {/* Enhanced Image Section */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                {/* Main Image Container */}
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: { xs: 400, md: 550 },
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: `0 20px 60px ${alpha(
                      theme.palette.common.black,
                      0.15,
                    )}`,
                    border: `8px solid ${theme.palette.background.paper}`,
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(135deg, ${alpha(
                        primary,
                        0.1,
                      )}, transparent)`,
                      zIndex: 1,
                      pointerEvents: "none",
                    },
                  }}
                >
                  <Image
                    src="/images/agent.jpeg"
                    alt="Realtor helping family"
                    fill
                    sizes="(max-width: 900px) 100vw, 50vw"
                    style={{ objectFit: "cover" }}
                    priority
                  />
                </Box>

                {/* Floating Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  style={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    zIndex: 10,
                  }}
                >
                  <Paper
                    elevation={8}
                    sx={{
                      px: 2.5,
                      py: 1.5,
                      borderRadius: 2,
                      bgcolor: theme.palette.background.paper,
                      backdropFilter: "blur(10px)",
                      border: `2px solid ${alpha(primary, 0.2)}`,
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <SvgIcon sx={{ color: theme.palette.warning.main }}>
                        <Star />
                      </SvgIcon>

                      <Stack spacing={0}>
                        <Typography
                          variant="caption"
                          fontWeight={700}
                          color="text.primary"
                        >
                          5.0 Rating
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: "0.65rem" }}
                        >
                          From 100+ Clients
                        </Typography>
                      </Stack>
                    </Stack>
                  </Paper>
                </motion.div>

                {/* Decorative Elements */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: -20,
                    left: -20,
                    width: 150,
                    height: 150,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${alpha(
                      primary,
                      0.15,
                    )}, transparent)`,
                    zIndex: -1,
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: -30,
                    right: { xs: -20, md: -40 },
                    width: 200,
                    height: 200,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${alpha(
                      theme.palette.secondary.main,
                      0.1,
                    )}, transparent)`,
                    zIndex: -1,
                  }}
                />
              </Box>
            </motion.div>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
};

export default AboutUs;
