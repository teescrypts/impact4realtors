import React from "react";
import LeadManagement from "../components/lead-management";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Metadata } from "next/types";
import { cookies } from "next/headers";
import apiRequest from "@/app/lib/api-request";

export const metadata: Metadata = {
  title: "Leads | Innovative Real Estate Solutions",
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

export interface LeadType {
  _id: string;
  type: string;
  status: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyId?: string;
  createdAt: Date;
}

async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;
  const lastCreatedAtQuery = (await searchParams).lastCreatedAt as
    | string
    | undefined;

  const url = lastCreatedAtQuery
    ? `admin/lead?lastCreatedAt=${lastCreatedAtQuery}`
    : "admin/lead";

  const response = await apiRequest<{
    data: { leads: LeadType[]; hasMore: boolean; lastCreatedAt: Date };
  }>(url, { token, tag: "fetchAdminLead" });

  const leads = response.data.leads;
  const hasMore = response.data.hasMore;
  const lastCreatedAt = response.data.lastCreatedAt;

  return (
    <div>
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
              <Typography variant="h4">Lead</Typography>
            </Stack>
            <LeadManagement
              leads={leads}
              hasMore={hasMore}
              lastCreatedAt={lastCreatedAt}
            />
          </Stack>
        </Container>
      </Box>
    </div>
  );
}

export default Page;
