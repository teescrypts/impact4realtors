import { Metadata } from "next/types";
import Listings from "../components/listings";
import apiRequest from "@/app/lib/api-request";

export const metadata: Metadata = {
  title: "Listings | Innovative Real Estate Solutions",
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

export interface propertyType {
  _id: string;
  propertyTitle: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareMeters: number;
  description: string;
  category: "For Sale" | "For Rent";
  propertyType: "House" | "Apartment" | "Condo";
  status: "Active" | "Rented" | "Sold";
  location: {
    addressLine1: string;
    addressLine2?: string;
    countryName: string;
    countryCode: string;
    stateName: string;
    stateCode: string;
    cityName: string;
    postalCode?: string;
  };
  features: string[];
  images: { url: string; fileName: string; imageId: string }[];
  createdAt: string; // Added this field
}

export interface PropertyResponseType {
  properties: propertyType[];
  totalPages: number;
  currentPage: number;
}

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const adminId = (await searchParams).admin as string | undefined;
  const category = (await searchParams)?.category as string | undefined;
  const minPrice = (await searchParams)?.minPrice as string | undefined;
  const maxPrice = (await searchParams)?.maxPrice as string | undefined;
  const bedrooms = (await searchParams)?.bedrooms as string | undefined;
  const bathrooms = (await searchParams)?.bathrooms as string | undefined;
  const minSquareMeters = (await searchParams)?.minSquareMeters as
    | string
    | undefined;
  const maxSquareMeters = (await searchParams)?.maxSquareMeters as
    | string
    | undefined;
  const location = (await searchParams)?.location as string | undefined;
  const page = (await searchParams)?.page as string | undefined;
  const queryParams = new URLSearchParams();

  if (adminId) queryParams.set("adminId", adminId);
  if (category) queryParams.set("category", category);
  if (minPrice) queryParams.set("minPrice", minPrice);
  if (maxPrice) queryParams.set("maxPrice", maxPrice);
  if (bedrooms) queryParams.set("bedrooms", bedrooms);
  if (bathrooms) queryParams.set("bathrooms", bathrooms);
  if (minSquareMeters) queryParams.set("minSquareMeters", minSquareMeters);
  if (maxSquareMeters) queryParams.set("maxSquareMeters", maxSquareMeters);
  if (location) queryParams.set("location", location);
  if (page) queryParams.set("page", page);

  const response = await apiRequest<{
    message: string;
    data: PropertyResponseType;
  }>(`public/listing?${queryParams.toString()}`, {
    tag: "fetchPublicListing",
  });

  const properties = response.data.properties;
  const totalPages = response.data.totalPages;
  const currentPage = response.data.currentPage;

  return (
    <Listings
      properties={properties}
      totalPages={totalPages}
      currentPage={currentPage}
    />
  );
};

export default Page;
