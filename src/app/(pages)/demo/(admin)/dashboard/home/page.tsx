import { cookies } from "next/headers";
import HomeSection from "../components/sections/home-section";
import { Metadata } from "next/types";
import apiRequest from "@/app/lib/api-request";

export const metadata: Metadata = {
  title: "Home | Innovative Real Estate Solutions",
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

export type HomeDataRes = {
  totalListings: number;
  totalUpcomingAppointments: number;
  totalNewLeads: number;
  leadChartData: { labels: string[]; values: number[] };
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;
  const days = (await searchParams).days as string | undefined;

  const url = days ? `admin/home/data?days=${days}` : "admin/home/data";

  const response = await apiRequest<{
    data: HomeDataRes;
  }>(url, { token, tag: "fetchAdminHomeData" });

  const data = response.data;

  return <HomeSection data={data} />;
}
