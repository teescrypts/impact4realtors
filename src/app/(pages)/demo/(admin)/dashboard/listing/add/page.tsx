import {
  Box,
  Breadcrumbs,
  Container,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import AddListingPage from "../../components/add-listing-page";
import { RouterLink } from "@/app/component/router-link";

import { Metadata } from "next/types";
import { cookies } from "next/headers";
import apiRequest from "@/app/lib/api-request";

export const metadata: Metadata = {
  title: "Add New Listing | Innovative Real Estate Solutions",
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

export type DraftImgType = { url: string; imageId: string; fileName: string };

export default async function AddListing() {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const response = await apiRequest<{
    message: string;
    data: { draftImages: DraftImgType[] };
  }>(`admin/image?type=${"listing"}`, {
    token,
    tag: "fetchistingDraftImgs",
  });

  const draftImages = response.data.draftImages;

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 2 }}>
          Add New Listing
        </Typography>

        <Stack sx={{ mb: 2 }}>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <Link
              underline="hover"
              color="inherit"
              sx={{ cursor: "pointer" }}
              component={RouterLink}
              href={"/demo/dashboard/listing"}
            >
              Listing
            </Link>
            <Typography color="text.primary">Add New Listing</Typography>
          </Breadcrumbs>
        </Stack>

        <AddListingPage draftImages={draftImages} />
      </Container>
    </Box>
  );
}
