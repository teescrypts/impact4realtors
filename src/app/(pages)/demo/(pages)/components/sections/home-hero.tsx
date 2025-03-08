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
        background:
          "linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3)), url('/images/bg-demo.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        px: 3,
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Stack
            direction="column"
            spacing={2}
            justifyContent="center"
            alignItems="center"
            mb={4}
          >
            <Typography
              maxWidth={600}
              variant="h2"
              fontWeight="bold"
              textAlign={"center"}
              gutterBottom
            >
              Find Your Dream Property with Ease
            </Typography>
            <Typography maxWidth={600} textAlign={"center"} variant="subtitle1">
              Buy, sell, or rent commercial and residential properties
              seamlessly. Your journey to the perfect home starts here.
            </Typography>
          </Stack>

          {/* Search Section */}
          <Stack
            direction="column"
            spacing={2}
            justifyContent="center"
            alignItems="center"
            mb={4}
          >
            {/* Toggle to choose Sale or Rent */}
            <ToggleButtonGroup
              value={searchType}
              exclusive
              onChange={handleSearchTypeChange}
              color="primary"
            >
              <ToggleButton value="For Sale">For Sale</ToggleButton>
              <ToggleButton value="For Rent">For Rent</ToggleButton>
            </ToggleButtonGroup>

            {/* Search Input */}
            <TextField
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by location"
              variant="outlined"
              size="small"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: 1,
                width: { xs: "100%", sm: "400px" },
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

            <Button variant="contained" size="large" onClick={handleSearch}>
              Search
            </Button>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
};

export default HeroSection;
