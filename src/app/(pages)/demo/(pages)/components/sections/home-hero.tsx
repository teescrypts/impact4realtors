"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  TextField,
  InputAdornment,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
  useTheme,
  Paper,
  SvgIcon,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useRouter } from "nextjs-toploader/app";
import Locations from "@/app/icons/untitled-ui/duocolor/location";
import Search from "@/app/icons/untitled-ui/duocolor/search";

const HeroSection = ({ adminId }: { adminId: string | undefined }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"For Sale" | "For Rent">(
    "For Sale"
  );
  const [message, setMessage] = useState("");
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // theme-driven colors
  const primary = theme.palette.primary.main;
  const onPrimary = theme.palette.primary.contrastText;
  const white88 = alpha(theme.palette.common.white, 0.88);
  const white60 = alpha(theme.palette.common.white, 0.6);
  const cardBg = alpha(theme.palette.background.paper, 0.08);

  const handleSearch = () => {
    if (searchQuery) {
      router.push(
        `/demo/listings?category=${encodeURIComponent(
          searchType
        )}&location=${encodeURIComponent(searchQuery)}&admin=${adminId}`
      );
    } else {
      setMessage("Enter a city, state, or country");
    }
  };

  const handleSearchTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: "For Sale" | "For Rent" | null
  ) => {
    if (newType !== null) {
      setSearchType(newType);
    }
  };

  useEffect(() => {
    if (adminId) {
      localStorage.setItem("adminId", adminId);
    }
  }, [adminId]);

  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: "86vh", md: "100vh" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: white88,
        px: 3,
        backgroundImage: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.dark,
          0.54
        )}, ${alpha(
          theme.palette.secondary.dark ?? primary,
          0.26
        )}), url('/images/agent-bg-aerial.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* subtle overlay to improve contrast */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, ${alpha(
            theme.palette.common.black,
            0.28
          )}, ${alpha(theme.palette.common.black, 0.48)})`,
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Stack
            direction="column"
            spacing={2}
            justifyContent="center"
            alignItems="center"
            mb={4}
          >
            <Typography
              variant={isMobile ? "h4" : "h2"}
              component="h1"
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: white88,
                textTransform: "capitalize",
                textShadow: `0 6px 18px ${alpha(
                  theme.palette.common.black,
                  0.45
                )}`,
              }}
            >
              Find your dream property with ease
            </Typography>

            <Typography
              variant="subtitle1"
              sx={{
                maxWidth: 780,
                color: white60,
                fontWeight: 500,
              }}
            >
              Buy, sell, or rent commercial and residential properties
              seamlessly. Your journey to the perfect home starts here.
            </Typography>
          </Stack>

          {/* Search Card */}
          <Paper
            elevation={6}
            sx={{
              px: { xs: 2, sm: 3 },
              py: { xs: 2, sm: 2.5 },
              width: "100%",
              borderRadius: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backdropFilter: "blur(6px)",
              background: cardBg,
              border: `1px solid ${alpha(theme.palette.common.white, 0.06)}`,
            }}
          >
            <ToggleButtonGroup
              value={searchType}
              exclusive
              onChange={handleSearchTypeChange}
              sx={{
                borderRadius: 999,
                background: alpha(theme.palette.common.white, 0.04),
                px: 0.5,
                mb: 1.5,
                display: "inline-flex",
                "& .MuiToggleButton-root": {
                  px: 3,
                  py: 0.6,
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 999,
                  color: white88,
                  "&.Mui-selected": {
                    backgroundColor: primary,
                    color: onPrimary,
                  },
                },
              }}
            >
              <ToggleButton value="For Sale">For Sale</ToggleButton>
              <ToggleButton value="For Rent">For Rent</ToggleButton>
            </ToggleButtonGroup>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ width: "100%", alignItems: "center" }}
            >
              <TextField
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by state, city or zip code"
                variant="outlined"
                fullWidth
                size={isMobile ? "small" : "medium"}
                helperText={message || "Try: Texas, Houston, or 10001"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon sx={{ color: white60 }}>
                        <Locations />
                      </SvgIcon>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleSearch}
                        aria-label="search"
                        sx={{
                          bgcolor: alpha(primary, 0.12),
                          "&:hover": { bgcolor: alpha(primary, 0.18) },
                        }}
                      >
                        <SvgIcon sx={{ color: primary }}>
                          <Search />
                        </SvgIcon>
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    color: white88,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: alpha(theme.palette.common.white, 0.08),
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: alpha(theme.palette.common.white, 0.12),
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: alpha(primary, 0.85),
                    },
                    input: {
                      color: white88,
                    },
                    "& .MuiFormHelperText-root": {
                      color: white60,
                    },
                  },
                }}
              />

              <Button
                variant="contained"
                size={isMobile ? "medium" : "large"}
                onClick={handleSearch}
                sx={{
                  borderRadius: 999,
                  px: 4,
                  textTransform: "none",
                  fontWeight: 700,
                  boxShadow: `0 6px 18px ${alpha(primary, 0.16)}`,
                }}
              >
                Search
              </Button>
            </Stack>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default HeroSection;
