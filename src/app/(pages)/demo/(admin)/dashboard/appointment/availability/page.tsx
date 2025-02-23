import React from "react";
import Availability from "../../components/availability";
import { Metadata } from "next/types";
import { cookies } from "next/headers";
import apiRequest from "@/app/lib/api-request";

export const metadata: Metadata = {
  title: "Abailability | Innovative Real Estate Solutions",
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

export interface TimeSlot {
  from: string;
  to: string;
}

export interface OpeningHoursType {
  id: string;
  owner: string;
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
  availability: "available" | "unavailable";
}

export const dummyOpeningHours: OpeningHoursType = {
  id: "1",
  owner: "John Doe",
  availability: "available",
  monday: [
    { from: "09:00", to: "12:00" },
    { from: "13:00", to: "18:00" },
  ],
  tuesday: [
    { from: "09:00", to: "12:00" },
    { from: "13:00", to: "18:00" },
  ],
  wednesday: [
    { from: "09:00", to: "12:00" },
    { from: "13:00", to: "18:00" },
  ],
  thursday: [
    { from: "09:00", to: "12:00" },
    { from: "13:00", to: "18:00" },
  ],
  friday: [
    { from: "09:00", to: "12:00" },
    { from: "13:00", to: "17:00" },
  ],
  saturday: [{ from: "10:00", to: "14:00" }],
  sunday: [],
};

async function Page() {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const response = await apiRequest<{
    message: string;
    data: { openingHour: OpeningHoursType };
  }>("admin/openings", {
    token,
    tag: "fetchOpenings",
  });

  const openingHours = response.data.openingHour;

  return (
    <div>
      <Availability openingHours={openingHours} />
    </div>
  );
}

export default Page;
