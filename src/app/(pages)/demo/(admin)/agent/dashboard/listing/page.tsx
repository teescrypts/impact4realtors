import React from "react";
import ListingsPage from "../components/listing-page";
import { Box, Container } from "@mui/material";

import { Metadata } from "next/types";
import apiRequest from "@/app/lib/api-request";
import { cookies } from "next/headers";
import { PropertyType } from "@/types";

export const metadata: Metadata = {
  title: "Listing | Innovative Real Estate Solutions",
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

async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const query = (await searchParams)?.query || "";
  const status = (await searchParams)?.status || "";
  const page = (await searchParams)?.page || "";

  const response = await apiRequest<{
    messgae: string;
    data: {
      properties: PropertyType[];
      pagination: {
        totalCount: number;
        totalPages: number;
        currentPage: number;
      };
    };
  }>(`admin/listing?query=${query}&status=${status}&page=${page}`, {
    token,
    tag: "fetchAdminProperties",
  });

  const properties = response.data.properties;
  const pagination = response.data.pagination;

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth={"xl"}>
        <ListingsPage properties={properties} pagination={pagination} />
      </Container>
    </Box>
  );
}

export default Page;
