"use client";

import Search from "@/app/icons/untitled-ui/duocolor/search";
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
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
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        background: `
         linear-gradient(to bottom right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3)),
         url('/images/broker-bg.png')
       `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        px: 3,
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Stack
            direction="column"
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Typography
              variant="h2"
              textAlign="center"
              sx={{
                textShadow: "0 2px 4px rgba(0,0,0,0.4)",
              }}
            >
              Your Home Journey Starts Here
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "rgba(255, 255, 255, 0.85)",
              }}
            >
              Buy, rent, or sell your home with trusted local experts by your
              side.
            </Typography>

            {/* Search Card */}
            <Stack
              direction="column"
              spacing={4}
              justifyContent="center"
              alignItems="center"
            >
              <ToggleButtonGroup
                value={searchType}
                exclusive
                onChange={handleSearchTypeChange}
                color="primary"
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "999px",
                  p: 0.5,
                  "& .MuiToggleButton-root": {
                    color: "white",
                    fontWeight: 500,
                    border: 0,
                    px: 3,
                    "&.Mui-selected": {
                      backgroundColor: "white",
                      color: "#333",
                    },
                  },
                }}
              >
                <ToggleButton value="For Sale">For Sale</ToggleButton>
                <ToggleButton value="For Rent">For Rent</ToggleButton>
              </ToggleButtonGroup>

              <Box
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch();
                }}
                sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <TextField
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by state, city or zip code"
                  variant="standard"
                  sx={{
                    flex: 1,
                    width: isMobile ? "70vw" : "25vw",
                    input: {
                      color: "#fff", // input text
                      "::placeholder": {
                        color: "#fff", // placeholder
                        opacity: 1, // ensures white is not faded
                      },
                    },
                    "& .MuiInput-underline:before": {
                      borderBottomColor: "#fff", // underline default
                    },
                    "& .MuiInput-underline:hover:before": {
                      borderBottomColor: "#fff", // underline hover
                    },
                    "& .MuiInput-underline:after": {
                      borderBottomColor: "#fff", // underline active
                    },
                  }}
                  helperText={message ? message : ""}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          sx={{ color: "#fff" }}
                          onClick={handleSearch}
                        >
                          <Search />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSearch}
                  sx={{
                    px: 4,
                    borderRadius: "999px",
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                >
                  Search
                </Button>
              </Box>
            </Stack>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
}
