"use client";

import Locations from "@/app/icons/untitled-ui/duocolor/location";
import Search from "@/app/icons/untitled-ui/duocolor/search";
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  SvgIcon,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";

export default function HeroSection({
  adminId,
}: {
  adminId: string | undefined;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"For Sale" | "For Rent">(
    "For Sale"
  );
  const [message, setMessage] = useState("");
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Theme-based colors
  const primary = theme.palette.primary.main;
  const onPrimary = theme.palette.primary.contrastText;
  const white80 = alpha(theme.palette.common.white, 0.88);
  const white60 = alpha(theme.palette.common.white, 0.6);

  const handleSearch = () => {
    if (searchQuery) {
      router.push(
        `/demo/broker/listings?category=${searchType}&location=${searchQuery}&admin=${adminId}`
      );
    } else {
      setMessage("Enter a city, state, or country");
    }
  };

  const handleSearchTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: "For Sale" | "For Rent" | null
  ) => {
    if (newType !== null) setSearchType(newType);
  };

  useEffect(() => {
    if (adminId) localStorage.setItem("adminId", adminId);
  }, [adminId]);

  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: "80vh", md: "100vh" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: white80,
        px: 3,
        // background image with theme-aware overlay
        backgroundImage: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.dark,
          0.55
        )}, ${alpha(
          theme.palette.secondary.dark ?? primary,
          0.3
        )}), url('/images/broker-bg.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* subtle dark overlay to improve contrast */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, ${alpha(
            theme.palette.common.black,
            0.35
          )}, ${alpha(theme.palette.common.black, 0.55)})`,
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <Stack
            direction="column"
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            <Typography
              variant={isMobile ? "h4" : "h2"}
              component="h1"
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: white80,
                textShadow: `0 6px 20px ${alpha(
                  theme.palette.common.black,
                  0.45
                )}`,
              }}
            >
              Your home journey starts here
            </Typography>

            <Typography
              variant="subtitle1"
              sx={{
                maxWidth: 880,
                color: white60,
                fontWeight: 500,
              }}
            >
              Buy, rent, or sell with local experts — discover curated listings
              and personalised guidance every step of the way.
            </Typography>

            {/* Card-style search area */}
            <Paper
              elevation={6}
              sx={{
                mt: 1,
                px: { xs: 2, sm: 3 },
                py: { xs: 2, sm: 2.5 },
                width: "100%",
                maxWidth: 980,
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backdropFilter: "blur(6px)",
                background: alpha(theme.palette.background.paper, 0.08),
                border: `1px solid ${alpha(theme.palette.common.white, 0.06)}`,
              }}
            >
              <ToggleButtonGroup
                value={searchType}
                exclusive
                onChange={handleSearchTypeChange}
                sx={{
                  borderRadius: 999,
                  background: alpha(theme.palette.common.white, 0.06),
                  px: 0.5,
                  mb: 1.5,
                  "& .MuiToggleButton-root": {
                    px: 3,
                    py: 0.6,
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 999,
                    color: white80,
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
                  placeholder="Search by city, state or ZIP code"
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
                      color: white80,
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
                        color: white80,
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
                    boxShadow: `0 6px 18px ${alpha(primary, 0.18)}`,
                  }}
                >
                  Search
                </Button>
              </Stack>
            </Paper>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
}
