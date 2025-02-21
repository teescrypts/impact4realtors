import { RouterLink } from "@/app/component/router-link";
import Add from "@/app/icons/untitled-ui/duocolor/add";
import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  SvgIcon,
} from "@mui/material";
import React from "react";
import BlogPage, { BlogType } from "../components/blog-page";

import { Metadata } from "next/types";

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

export const dummyBlogs: BlogType[] = [
  {
    _id: "blog123",
    title: "The Future of Real Estate in 2025",
    shortDescription:
      "A deep dive into emerging trends shaping the real estate market in 2025.",
    author: "John Doe",
    content: `
        The real estate industry is evolving rapidly, with technology and shifting market 
        dynamics playing a crucial role. In this article, we explore key trends such as 
        smart homes, AI-driven property recommendations, and sustainable housing developments.
      `,
    coverImage: {
      url: "https://example.com/blog-cover1.jpg",
      fileName: "blog-cover1.jpg",
      imageId: "img_456xyz",
    },
    engagements: {
      likes: 120,
      comments: 35,
      shares: 50,
    },
    createdAt: "2025-02-14T10:30:00Z",
    updatedAt: "2025-02-14T12:45:00Z",
  },
  {
    _id: "blog124",
    title: "How AI is Transforming Home Buying",
    shortDescription:
      "Exploring how artificial intelligence is reshaping the home-buying process.",
    author: "Jane Smith",
    content: `
        AI-powered tools are making home buying more efficient by providing personalized 
        recommendations, automating paperwork, and improving mortgage approval processes.
      `,
    coverImage: {
      url: "https://example.com/blog-cover2.jpg",
      fileName: "blog-cover2.jpg",
      imageId: "img_789abc",
    },
    engagements: {
      likes: 200,
      comments: 45,
      shares: 80,
    },
    createdAt: "2025-02-10T08:15:00Z",
    updatedAt: "2025-02-12T09:30:00Z",
  },
  {
    _id: "blog125",
    title: "Sustainable Housing: The Next Big Thing",
    shortDescription:
      "How eco-friendly housing is becoming the new standard in real estate.",
    author: "Michael Green",
    content: `
        Green homes with energy-efficient designs and sustainable materials are attracting 
        more buyers. Developers are focusing on solar energy, water conservation, and smart 
        resource management.
      `,
    coverImage: {
      url: "https://example.com/blog-cover3.jpg",
      fileName: "blog-cover3.jpg",
      imageId: "img_987def",
    },
    engagements: {
      likes: 150,
      comments: 60,
      shares: 70,
    },
    createdAt: "2025-01-25T14:20:00Z",
    updatedAt: "2025-02-01T16:00:00Z",
  },
];

function Page() {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={4}>
          <Stack direction="row" justifyContent="space-between" spacing={4}>
            <Stack spacing={1}>
              <Typography variant="h4">Blog</Typography>
            </Stack>
            <Stack alignItems="center" direction="row" spacing={3}>
              <Button
                component={RouterLink}
                href={"/demo/dashboard/blog/add"}
                startIcon={
                  <SvgIcon>
                    <Add />
                  </SvgIcon>
                }
                variant="contained"
              >
                Add New Blog
              </Button>
            </Stack>
          </Stack>
          <BlogPage blogs={dummyBlogs} />
        </Stack>
      </Container>
    </Box>
  );
}

export default Page;
