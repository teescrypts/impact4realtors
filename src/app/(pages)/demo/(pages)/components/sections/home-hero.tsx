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
} from "@mui/material";
import { motion } from "framer-motion";
import Search from "@/app/icons/untitled-ui/duocolor/search";
import { useRouter } from "nextjs-toploader/app";

const HeroSection = ({ adminId }: { adminId: string | undefined }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"For Sale" | "For Rent">(
    "For Sale"
  );
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery) {
      router.push(
        `/demo/listings?category=${searchType}&location=${searchQuery}&admin=${adminId}`
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
      url('/images/bg-demo.webp')
    `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        px: 3,
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Stack
            direction="column"
            spacing={4}
            justifyContent="center"
            alignItems="center"
            mb={6}
          >
            <Typography
              variant="h2"
              fontWeight={800}
              textAlign="center"
              sx={{
                fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
                textShadow: "0 2px 4px rgba(0,0,0,0.4)",
                lineHeight: 1.2,
                maxWidth: 700,
              }}
            >
              Find Your Dream Property with Ease
            </Typography>
            <Typography
              variant="h6"
              sx={{
                maxWidth: 600,
                color: "rgba(255, 255, 255, 0.85)",
                fontWeight: 400,
              }}
            >
              Buy, sell, or rent commercial and residential properties
              seamlessly. Your journey to the perfect home starts here.
            </Typography>
          </Stack>

          {/* Search Section */}
          <Stack
            direction="column"
            spacing={3}
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
                maxWidth: 600,
              }}
            >
              <TextField
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by location"
                variant="outlined"
                size="small"
                sx={{
                  backgroundColor: "white",
                  borderRadius: 2,
                  flex: 1,
                }}
                helperText={message ? message : ""}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleSearch}>
                          <Search />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
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
        </motion.div>
      </Container>
    </Box>
  );
};

export default HeroSection;
