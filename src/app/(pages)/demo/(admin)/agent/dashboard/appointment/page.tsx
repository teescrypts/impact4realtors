import React from "react";
import AppointmentManagement from "../components/appointment-mgt";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { Metadata } from "next/types";
import { cookies } from "next/headers";
import apiRequest from "@/app/lib/api-request";
import { AppointmentResponse } from "@/types";

export const metadata: Metadata = {
  title: "Appointment | Innovative Real Estate Solutions",
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

async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const params = await searchParams;
  const lastCreatedAtQuery = params.lastCreatedAt as string | undefined;
  const status = params.status as string | undefined;

  // Build the API request URL dynamically
  const queryParams = new URLSearchParams();
  if (lastCreatedAtQuery)
    queryParams.append("lastCreatedAt", lastCreatedAtQuery);
  if (status) queryParams.append("status", status);

  const url = `admin/appointment${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  const response = await apiRequest<{
    data: {
      appointments: AppointmentResponse[];
      hasMore: boolean;
      lastCreatedAt: Date;
    };
  }>(url, { token, tag: "fetchAdminAppointments" });

  const appointments = response.data.appointments;
  const hasMore = response.data.hasMore;
  const lastCreatedAt = response.data.lastCreatedAt;

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
          <Stack direction="row" justifyContent="space-between" spacing={4}>
            <div>
              <Typography variant="h4">Appointment</Typography>
            </div>
            <div>
              <Stack direction="row" spacing={4}>
                <Link href={"/demo/agent/dashboard/appointment/availability"}>
                  <Button variant="contained">Availablity</Button>
                </Link>
              </Stack>
            </div>
          </Stack>
          <AppointmentManagement
            appointments={appointments}
            hasMore={hasMore}
            lastCreatedAt={lastCreatedAt}
          />
        </Stack>
      </Container>
    </Box>
  );
}

export default Page;
