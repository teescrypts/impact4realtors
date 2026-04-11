"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  TextField,
  InputAdornment,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
  useTheme,
  Paper,
  SvgIcon,
  Chip,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useRouter } from "nextjs-toploader/app";
import Locations from "@/app/icons/untitled-ui/duocolor/location";
import Search from "@/app/icons/untitled-ui/duocolor/search";
import Home from "@/app/icons/untitled-ui/duocolor/home";
import TrendingUp from "@/app/icons/untitled-ui/duocolor/trending-up";
import Apartment from "@/app/icons/untitled-ui/duocolor/apartment";


const HeroSection = ({ adminId }: { adminId: string | undefined }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"For Sale" | "For Rent">(
    "For Sale",
  );
  const [message, setMessage] = useState("");
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Theme-driven colors
  const primary = theme.palette.primary.main;
  const onPrimary = theme.palette.primary.contrastText;
  const white100 = theme.palette.common.white;
  const white95 = alpha(white100, 0.95);
  const white88 = alpha(white100, 0.88);
  const white60 = alpha(white100, 0.6);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(
        `/demo/listings?category=${encodeURIComponent(
          searchType,
        )}&location=${encodeURIComponent(searchQuery)}&admin=${adminId}`,
      );
    } else {
      setMessage("Please enter a location to search");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleSearchTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: "For Sale" | "For Rent" | null,
  ) => {
    if (newType !== null) {
      setSearchType(newType);
      setMessage(""); // Clear any error message
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    if (adminId) {
      localStorage.setItem("adminId", adminId);
    }
  }, [adminId]);

  // Quick stats for visual interest
  const stats = [
    { icon: <Home />, value: "10K+", label: "Properties" },
    { icon: <TrendingUp />, value: "98%", label: "Success Rate" },
    { icon: <Apartment />, value: "50+", label: "Cities" },
  ];

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: { xs: "90vh", md: "100vh" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: `linear-gradient(135deg, 
          ${alpha(theme.palette.primary.dark, 0.65)} 0%, 
          ${alpha(theme.palette.primary.main, 0.45)} 50%,
          ${alpha(theme.palette.secondary.dark ?? primary, 0.35)} 100%)`,
      }}
    >
      {/* Animated Background Image */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url('/images/agent-bg-aerial.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          animation: "slowZoom 30s ease-in-out infinite alternate",
          "@keyframes slowZoom": {
            "0%": { transform: "scale(1)" },
            "100%": { transform: "scale(1.05)" },
          },
        }}
      />

      {/* Gradient Overlay with better contrast */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, 
            ${alpha(theme.palette.common.black, 0.35)} 0%, 
            ${alpha(theme.palette.common.black, 0.55)} 100%)`,
          pointerEvents: "none",
        }}
      />

      {/* Floating shapes for visual interest */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {[...Array(3)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              width: { xs: 200, md: 400 },
              height: { xs: 200, md: 400 },
              borderRadius: "50%",
              background: `radial-gradient(circle, ${alpha(
                primary,
                0.08,
              )}, transparent)`,
              top: `${20 + i * 30}%`,
              left: `${10 + i * 25}%`,
              animation: `float${i} ${15 + i * 5}s ease-in-out infinite`,
              "@keyframes float0": {
                "0%, 100%": { transform: "translate(0, 0) scale(1)" },
                "50%": { transform: "translate(30px, -30px) scale(1.1)" },
              },
              "@keyframes float1": {
                "0%, 100%": { transform: "translate(0, 0) scale(1)" },
                "50%": { transform: "translate(-20px, 40px) scale(0.9)" },
              },
              "@keyframes float2": {
                "0%, 100%": { transform: "translate(0, 0) scale(1)" },
                "50%": { transform: "translate(40px, 20px) scale(1.05)" },
              },
            }}
          />
        ))}
      </Box>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, py: 4 }}>
        <Stack spacing={{ xs: 4, md: 6 }} alignItems="center">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: "100%", textAlign: "center" }}
          >
            <Stack spacing={3} alignItems="center">
              {/* Premium Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Chip
                  label="The right Real Estate agent for you"
                  sx={{
                    bgcolor: alpha(primary, 0.15),
                    color: white95,
                    backdropFilter: "blur(8px)",
                    border: `1px solid ${alpha(white100, 0.2)}`,
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    px: 1,
                  }}
                />
              </motion.div>

              {/* Headline */}
              <Typography
                variant={isMobile ? "h3" : isTablet ? "h2" : "h1"}
                component="h1"
                sx={{
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: white100,
                  textShadow: `0 4px 24px ${alpha(
                    theme.palette.common.black,
                    0.5,
                  )}`,
                  lineHeight: 1.15,
                  maxWidth: 900,
                  background: `linear-gradient(135deg, ${white100}, ${white88})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Find Your Dream Property{" "}
                <Box
                  component="span"
                  sx={{
                    background: `linear-gradient(135deg, ${primary}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  With Ease
                </Box>
              </Typography>

              {/* Subtitle */}
              <Typography
                variant={isMobile ? "body1" : "h6"}
                sx={{
                  maxWidth: 700,
                  color: white88,
                  fontWeight: 400,
                  lineHeight: 1.6,
                  textShadow: `0 2px 8px ${alpha(
                    theme.palette.common.black,
                    0.3,
                  )}`,
                }}
              >
                Buy, sell, or rent commercial and residential properties
                seamlessly. Your journey to the perfect home starts here.
              </Typography>
            </Stack>
          </motion.div>

          {/* Enhanced Search Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: "100%", maxWidth: 800 }}
          >
            <Paper
              elevation={0}
              sx={{
                px: { xs: 2.5, sm: 4 },
                py: { xs: 3, sm: 4 },
                width: "100%",
                borderRadius: { xs: 3, sm: 4 },
                backdropFilter: "blur(20px)",
                background: `linear-gradient(135deg, 
                  ${alpha(white100, 0.12)} 0%, 
                  ${alpha(white100, 0.08)} 100%)`,
                border: `1px solid ${alpha(white100, 0.18)}`,
                boxShadow: `0 8px 32px ${alpha(
                  theme.palette.common.black,
                  0.4,
                )}, 
                  inset 0 1px 0 ${alpha(white100, 0.2)}`,
              }}
            >
              <Stack spacing={3}>
                {/* Property Type Toggle */}
                <ToggleButtonGroup
                  value={searchType}
                  exclusive
                  onChange={handleSearchTypeChange}
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    background: alpha(theme.palette.common.black, 0.15),
                    p: 0.75,
                    "& .MuiToggleButton-root": {
                      px: { xs: 2, sm: 4 },
                      py: 1.25,
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      borderRadius: 1.5,
                      border: "none",
                      color: white88,
                      transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                      "&.Mui-selected": {
                        backgroundColor: primary,
                        color: onPrimary,
                        boxShadow: `0 4px 12px ${alpha(primary, 0.4)}`,
                        "&:hover": {
                          backgroundColor: primary,
                        },
                      },
                      "&:hover": {
                        backgroundColor: alpha(white100, 0.08),
                      },
                    },
                  }}
                >
                  <ToggleButton value="For Sale">
                    <SvgIcon sx={{ mr: 1, fontSize: 20 }}>
                      <Home />
                    </SvgIcon>
                    For Sale
                  </ToggleButton>
                  <ToggleButton value="For Rent">
                    <SvgIcon sx={{ mr: 1, fontSize: 20 }}>
                      <Apartment />
                    </SvgIcon>
                    For Rent
                  </ToggleButton>
                </ToggleButtonGroup>

                {/* Search Input */}
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems="stretch"
                >
                  <TextField
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter city, state, or zip code"
                    variant="outlined"
                    fullWidth
                    error={!!message}
                    helperText={message || "Try: Texas, Houston, or 10001"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SvgIcon sx={{ color: white88, fontSize: 24 }}>
                            <Locations />
                          </SvgIcon>
                        </InputAdornment>
                      ),
                      sx: {
                        bgcolor: alpha(white100, 0.08),
                        backdropFilter: "blur(8px)",
                        borderRadius: 2,
                        color: white100,
                        fontSize: { xs: "0.95rem", sm: "1.05rem" },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: alpha(white100, 0.15),
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: alpha(white100, 0.25),
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: primary,
                          borderWidth: 2,
                        },
                        "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.palette.error.main,
                        },
                        input: {
                          color: white100,
                          "&::placeholder": {
                            color: white60,
                            opacity: 1,
                          },
                        },
                      },
                    }}
                    FormHelperTextProps={{
                      sx: {
                        color: message ? theme.palette.error.light : white60,
                        fontSize: "0.85rem",
                        mt: 1,
                      },
                    }}
                  />

                  <Button
                    variant="contained"
                    // size="medium"
                    onClick={handleSearch}
                    sx={{
                      borderRadius: 2,
                      px: { xs: 4, sm: 5 },
                      py: { xs: 1.5, sm: 1.75 },
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: { xs: "1rem", sm: "1.1rem" },
                      minWidth: { xs: "100%", sm: 160 },
                      background: `linear-gradient(135deg, ${primary}, ${theme.palette.primary.dark})`,
                      boxShadow: `0 8px 24px ${alpha(primary, 0.35)}`,
                      transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: `0 12px 32px ${alpha(primary, 0.45)}`,
                      },
                      "&:active": {
                        transform: "translateY(0)",
                      },
                    }}
                    startIcon={
                      <SvgIcon>
                        <Search />
                      </SvgIcon>
                    }
                  >
                    Search
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            style={{ width: "100%" }}
          >
            <Stack
              direction="row"
              spacing={{ xs: 2, sm: 4, md: 6 }}
              justifyContent="center"
              flexWrap="wrap"
              sx={{ mt: { xs: 2, md: 4 } }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                >
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{
                      px: { xs: 2, sm: 3 },
                      py: 1.5,
                      borderRadius: 2,
                      bgcolor: alpha(white100, 0.08),
                      backdropFilter: "blur(8px)",
                      border: `1px solid ${alpha(white100, 0.12)}`,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 40,
                        height: 40,
                        borderRadius: 1.5,
                        bgcolor: alpha(primary, 0.2),
                        color: white95,
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Stack spacing={0.25}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: white100,
                          lineHeight: 1,
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: white60,
                          fontSize: "0.75rem",
                          fontWeight: 500,
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </Stack>
                  </Stack>
                </motion.div>
              ))}
            </Stack>
          </motion.div>
        </Stack>
      </Container>
    </Box>
  );
};

export default HeroSection;
