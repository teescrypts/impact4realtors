import React from "react";
import PagesLayout from "./components/pages-layout";
import { Metadata } from "next";
import TopLoader from "../demo/(admin)/dashboard/components/top-loader";

interface LayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Realtor Demo | Innovative Real Estate Solutions",
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
    url: "https://realtyillustrations.live",
    type: "website",
    images: [
      {
        url: "https://realtyillustrations.live /images/logo.png",
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
    images: ["https://realtyillustrations.live /images/logo.png"],
  },
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <PagesLayout>
      <TopLoader />
      {children}
    </PagesLayout>
  );
};

export default Layout;
