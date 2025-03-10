"use client";

import { Box, Button, Container, Typography, Stack } from "@mui/material";

const HomeHeroSection = () => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        background:
          "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/landing-page-bg.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff",
        px: 2,
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h3" fontWeight={700} gutterBottom>
          The Perfect Website for Your Real Estate Business
        </Typography>
        <Typography variant="h6" mb={3}>
          Showcase your listings, capture leads, and manage appointments—all in
          one place.
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ px: 4, py: 1.5, fontSize: "1.1rem", fontWeight: 600 }}
            href="/demo"
          >
            View Website Demo
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: 600,
              borderColor: "#fff",
              color: "#fff",
            }}
            href="/demo/auth/demo/login"
          >
            Explore Admin Dashboard
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default HomeHeroSection;
