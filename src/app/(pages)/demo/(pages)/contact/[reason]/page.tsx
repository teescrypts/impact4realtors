import React from "react";
import ContactUs from "../../components/contact-us";
import FAQsSection from "../../components/sections/faqs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Innovative Real Estate Solutions",
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
  params,
  searchParams,
}: {
  params: Promise<{ reason: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const reason = (await params).reason;
  const adminId = (await searchParams).admin as string;

  return (
    <div>
      <ContactUs reason={reason} adminId={adminId} />
      <FAQsSection />
    </div>
  );
}

export default Page;
