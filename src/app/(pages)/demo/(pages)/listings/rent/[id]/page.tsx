import React from "react";
import ListingDetailsPage from "../../../components/listing-details";

import type { Metadata, ResolvingMetadata } from "next";
import apiRequest from "@/app/lib/api-request";
import { propertyType } from "../../page";
import FAQsSection from "../../../components/sections/faqs";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const propertyId = (await params).id;
  const propertyData = await apiRequest<{
    message: string;
    data: { property: propertyType };
  }>(`public/listing/${propertyId}`, {
    tag: "fetchPublicProperty",
  });

  const property = propertyData.data.property;

  return {
    title: `${property.propertyTitle} | Realtor Demo Blog`,
    description: property.description,
    keywords: `real estate, trends, realtor demo, independent realtor, blog, real estate technology, property trends, ${property.category}, ${property.price}, ${property.location.addressLine1}, ${property.location.countryName}, ${property.location.stateName}, ${property.location.cityName}`,
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    openGraph: {
      title: `${property.propertyTitle} | Realtor Demo Blog`,
      description: property.description,
      url: `https://yourdomain.com/blog/${propertyId}`,
      type: "article",
      images: [
        {
          url: property.images[0].url,
          width: 1200,
          height: 630,
          alt: property.category,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${property.propertyTitle} | Realtor Demo Blog`,
      description: property.description,
      images: [property.images[0].url],
    },
  };
}

async function Page({ params, searchParams }: Props) {
  const id = (await params).id;
  const adminId = (await searchParams).admin;

  const response = await apiRequest<{
    message: string;
    data: { property: propertyType };
  }>(`public/listing/${id}`, {
    tag: "fetchPublicProperty",
  });

  const property = response.data.property;
  return (
    <div>
      <ListingDetailsPage
        adminId={adminId as string | undefined}
        property={property}
      />
      <FAQsSection />
    </div>
  );
}

export default Page;
