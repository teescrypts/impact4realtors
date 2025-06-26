import React from "react";
import type { Metadata } from "next";
import apiRequest from "@/app/lib/api-request";
import { blogType } from "@/types";
import Testimonials from "../../components/sections/testimonials";
import AboutSection from "../../components/sections/about-us";
import { Box } from "@mui/material";
import SingleBlogPage from "../../components/blog-page";

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

  const title = `${blog.title || "Untitled Blog"} | Realtor Demo Blog`;
  const description =
    blog.shortDescription ||
    "Explore real estate trends and innovations on the Realtor Demo Blog.";
  const coverImage =
    blog.cover?.url || "https://realtyillustrations.live/images/logo.png";
  const url = `https://realtyillustrations.live/demo/blog/${blogId}`;

  return {
    title,
    description,
    keywords: [
      "real estate",
      "blog",
      "realtor demo",
      "property trends",
      "real estate technology",
      blog.title || "",
      blog.author || "",
    ],
    icons: {
      icon: "/images/logo.png",
      apple: "/apple-touch-icon.png",
    },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [
        {
          url: coverImage,
          width: 1200,
          height: 630,
          alt: blog.title || "Realtor Demo Blog",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [coverImage],
    },
    metadataBase: new URL("https://realtyillustrations.live"),
    alternates: {
      canonical: url,
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
      <Box sx={{ mt: 10 }}>
        <SingleBlogPage blog={blog} adminId={adminId} />
      </Box>
      <AboutSection adminId={adminId} />
      <Testimonials />
    </>
  );
};

export default BlogPage;
