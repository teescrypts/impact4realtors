/**
 * Lead Management Page - Server Component
 * 
 * Fetches initial data on the server, then passes to client component
 * Uses Next.js Server Components for optimal performance
 */

import { Suspense } from "react";
import { Metadata } from "next";
import { Box, Container, CircularProgress, Typography } from "@mui/material";
import { getLeads } from "@/app/actions/lead-actions";
import { getTags } from "@/app/actions/tag-actions";
import { DUMMY_LEADS } from "../components/lead/data/dummy-leads";
import { DUMMY_TAGS } from "../components/lead/data/tag-data";
import LeadManagementContainer from "./lead-management-container";

export const metadata: Metadata = {
  title: "Leads | Innovative Real Estate Solutions",
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


// Loading fallback
function LeadManagementLoading() {
  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          gap: 2,
        }}
      >
        <CircularProgress size={48} />
        <Typography variant="h6" color="text.secondary">
          Loading leads...
        </Typography>
      </Box>
    </Container>
  );
}

// Main page component
export default async function LeadManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const categoryParam = params.category as string | undefined;
  const initialCategory = categoryParam === "seller" || categoryParam === "inquiry" 
    ? categoryParam 
    : "buyer";

  // Fetch data on server
  let leads = DUMMY_LEADS;
  let tags = DUMMY_TAGS;
  let error: string | null = null;

  try {
    // Fetch in parallel for better performance
    const [tagsResponse, leadsResponse] = await Promise.all([
      getTags().catch((err) => {
        console.error("Failed to fetch tags:", err);
        return { data:  DUMMY_TAGS }; // Fallback to dummy data
      }),
      getLeads(initialCategory).catch((err) => {
        console.error("Failed to fetch leads:", err);
        return { data: { leads: DUMMY_LEADS, hasMore: false, lastCreatedAt: null } };
      }),
    ]);

    tags = tagsResponse.data;
    leads = leadsResponse.data.leads;
  } catch (err: any) {
    console.error("Error fetching data:", err);
    error = err.message || "Failed to load data";
    // Will use dummy data as fallback
  }

  return (
    <Suspense fallback={<LeadManagementLoading />}>
      <LeadManagementContainer
        initialLeads={leads}
        initialTags={tags}
        initialCategory={initialCategory}
        error={error}
      />
    </Suspense>
  );
}

// GET /api/admin/lead?type={category}
// POST /api/admin/lead
// PATCH /api/admin/lead/[id]
// DELETE /api/admin/lead/[id]
// GET /api/admin/tags


// POST /api/admin/lead/[id]/journey/pause
// POST /api/admin/lead/[id]/journey/resume
