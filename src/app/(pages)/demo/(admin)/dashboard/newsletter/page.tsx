import React from "react";
import NewsletterPage from "../components/newsletter-page";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Newsletter | Innovative Real Estate Solutions",
  description:
    "Explore our live demo website showcasing cutting-edge tools for independent realtors. Our platform offers creative solutions for listing, buying, and renting properties—designed to elevate your real estate business.",
  keywords:
    "realtor demo, real estate solutions, independent realtor, property listing, modern real estate website, innovative real estate, property management",
  icons: {
    icon: "/images/logo.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Realtor Demo | Innovative Real Estate Solutions",
    description:
      "Discover a modern, creative platform designed for independent realtors. Elevate your business with our innovative tools and user-friendly interface.",
    url: "https://impact4realtors.live", // Replace with your actual domain
    type: "website",
    images: [
      {
        url: "https://impact4realtors.live/images/logo.png", // Replace with your actual OG image URL
        width: 1200,
        height: 630,
        alt: "Realtor Demo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Realtor Demo | Innovative Real Estate Solutions",
    description:
      "Explore our live demo website showcasing modern tools for independent realtors.",
    images: ["https://impact4realtors.live/images/logo.png"], // Replace accordingly
  },
};

function Page() {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth={"xl"}>
        <Stack spacing={2}>
          <Stack sx={{ mb: 2 }}>
            <Typography variant="h4"> Send Newsletter</Typography>
          </Stack>
          <NewsletterPage />
        </Stack>
      </Container>
    </Box>
  );
}

export default Page;
