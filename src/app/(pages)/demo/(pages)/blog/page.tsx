import React from "react";
import Blogs from "../components/blog";
import { Metadata } from "next/types";
import apiRequest from "@/app/lib/api-request";
import { blogType } from "@/types";

export const metadata: Metadata = {
  title: "Blog | Innovative Real Estate Solutions",
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

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function Page({ searchParams }: Props) {
  const adminId = (await searchParams).admin as string | undefined;
  const page = (await searchParams).page as string | undefined;
  const url = adminId
    ? page
      ? `public/blog?adminId=${adminId}&page=${page}`
      : `public/blog?adminId=${adminId}&page=1`
    : page
    ? `public/blog?page=${page}`
    : "public/blog?page=1";

  const response = await apiRequest<{
    data: {
      blogs: blogType[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalBlogs: number;
      };
    };
  }>(url, { tag: "fetchPublicBlogs" });

  const blogs = response.data.blogs;
  const pagination = response.data.pagination;

  return (
    <div>
      <Blogs adminId={adminId} blogs={blogs} pagination={pagination} />
    </div>
  );
}

export default Page;
