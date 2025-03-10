import React from "react";
import type { Metadata } from "next";
import apiRequest from "@/app/lib/api-request";
import { blogType } from "@/types";
import SingleBlogPage from "../../components/blog-page";
import SellSection from "../../components/sections/sell-section";
import TestimonialsSection from "../../components/sections/testimonial-section";
import FAQsSection from "../../components/sections/faqs";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blogId = (await params).id;

  const blogData = await apiRequest<{ data: { blog: blogType } }>(
    `public/blog/${blogId}`,
    {
      tag: "fetchPublicBlogPost",
    }
  );

  const blog = blogData.data.blog;

  return {
    title: `${blog.title} | Realtor Demo Blog`,
    description: blog.shortDescription,
    keywords:
      "real estate, trends, realtor demo, independent realtor, blog, real estate technology, property trends",
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    openGraph: {
      title: "Realtor Demo | Innovative Real Estate Solutions",
      description:
        "Discover a modern, creative platform designed for independent realtors. Elevate your business with our innovative tools and user-friendly interface.",
      url: `https://realtyillustrations.live/demo/blog/${blogId}`, // Replace with your actual domain
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
}

const BlogPage = async ({ params, searchParams }: Props) => {
  const id = (await params).id;
  const adminId = (await searchParams).admin as string | undefined;
  const response = await apiRequest<{ data: { blog: blogType } }>(
    `public/blog/${id}`,
    {
      tag: "fetchPublicBlogPost",
    }
  );

  const blog = response.data.blog;

  return (
    <>
      <SingleBlogPage blog={blog} adminId={adminId} />
      <SellSection adminId={adminId} />
      <TestimonialsSection />
      <FAQsSection />
    </>
  );
};

export default BlogPage;
