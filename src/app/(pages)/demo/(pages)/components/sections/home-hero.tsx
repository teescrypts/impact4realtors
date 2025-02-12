"use client";

import React, { useState } from "react";
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

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"sale" | "rent">("sale");

  const handleSearch = () => {
    // Implement search logic; you can include the searchType in your search query
    console.log("Searching for:", searchQuery, "Type:", searchType);
  };

  const handleSearchTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: "sale" | "rent" | null
  ) => {
    if (newType !== null) {
      setSearchType(newType);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: "90vh",
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
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            Find Your Dream Property with Ease
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.8, my: 3 }}>
            Buy, sell, or rent commercial and residential properties seamlessly.
            Your journey to the perfect home starts here.
          </Typography>

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
              <ToggleButton value="sale">For Sale</ToggleButton>
              <ToggleButton value="rent">For Rent</ToggleButton>
            </ToggleButtonGroup>

            {/* Search Input */}
            <TextField
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter location or keyword"
              variant="outlined"
              size="small"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: 1,
                width: { xs: "100%", sm: "400px" },
              }}
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
