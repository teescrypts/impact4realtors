import React from "react";
import {
  Container,
  Box,
  Typography,
  Stack,
  Divider,
  Button,
} from "@mui/material";
import Link from "next/link";

import type { Metadata, ResolvingMetadata } from "next";
import apiRequest from "@/app/lib/api-request";
import { blogType } from "@/types";
import { formatCreatedAt } from "@/app/utils/format-created-at";
import SingleBlogPage from "../../components/blog-page";
import SellSection from "../../components/sections/sell-section";
import TestimonialsSection from "../../components/sections/testimonial-section";
import FAQsSection from "../../components/sections/faqs";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
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
      title: `${blog.title} | Realtor Demo Blog`,
      description: blog.shortDescription,
      url: `https://yourdomain.com/blog/${blogId}`,
      type: "article",
      images: [
        {
          url: blog.cover!.url!,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${blog.title} | Realtor Demo Blog`,
      description: blog.shortDescription,
      images: [blog.cover!.url!],
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
