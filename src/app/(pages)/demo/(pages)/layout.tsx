import React, { ReactNode } from "react";

import Navbar from "./components/nav-bar";
import Motion from "./components/motion";
import CustomTheme from "@/app/component/custom-theme";
import { Metadata } from "next/types";
import Footer from "./components/footer";
import TopLoader from "../(admin)/dashboard/components/top-loader";
import { Box } from "@mui/material";

export const metadata: Metadata = {
  title: "Homepage | Innovative Real Estate Solutions",
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
    url: "https://realtyillustrations.live", // Replace with your actual domain
    type: "website",
    images: [
      {
        url: "https://realtyillustrations.live/images/logo.png", // Replace with your actual OG image URL
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
    images: ["https://realtyillustrations.live/images/logo.png"], // Replace accordingly
  },
};

const Layout = async ({ children }: { children: ReactNode }) => {
  return (
    <CustomTheme>
      <Motion>
        <TopLoader />
        <Navbar />
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ flexGrow: 1 }}>{children}</Box>
        </Box>
        <Footer />
      </Motion>
    </CustomTheme>
  );
};

export default Layout;
