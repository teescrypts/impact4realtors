import { RouterLink } from "@/app/component/router-link";
import {
  Box,
  Container,
  Stack,
  Typography,
  Breadcrumbs,
  Link,
} from "@mui/material";
import React from "react";
import AddBlog from "../../components/add-blog";
import { Metadata } from "next/types";
import { cookies } from "next/headers";
import apiRequest from "@/app/lib/api-request";
import { DraftImgType } from "../../listing/add/page";

export const metadata: Metadata = {
  title: "Publish Blog | Innovative Real Estate Solutions",
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

async function Page() {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const response = await apiRequest<{
    message: string;
    data: { draftImg: DraftImgType | string };
  }>("admin/blog/image/draft", {
    token,
    tag: "fetchBlogDraftImg",
  });

  const draftImg = response.data.draftImg;

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={1}>
          <Typography variant="h3">Publish Blog</Typography>
          <Stack sx={{ mb: 2 }}>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Link
                underline="hover"
                color="inherit"
                sx={{ cursor: "pointer" }}
                component={RouterLink}
                href={"/demo/dashboard/blog"}
              >
                Blog
              </Link>
              <Typography color="text.primary">Add New Blog</Typography>
            </Breadcrumbs>
          </Stack>
        </Stack>
        <AddBlog draftImg={draftImg} />
      </Container>
    </Box>
  );
}

export default Page;
