import React from "react";
import { Metadata } from "next/types";
import { Container, Box, Typography } from "@mui/material";
import Motion from "../../../components/motion";
import DemoLogin from "../../../components/demo-login";

export const metadata: Metadata = {
  title: "Sign up | Innovative Real Estate Solutions",
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

async function Page() {
  return (
    <Container
      maxWidth="sm"
      sx={{ mt: 8, mb: 8, fontFamily: "Poppins, sans-serif" }}
    >
      <Motion>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight="bold">
            Create Your Account
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Sign up for a demo account using any email. The account will be
            deactivated after 2 hours.
          </Typography>
        </Box>
      </Motion>
      <DemoLogin />
    </Container>
  );
}

export default Page;
