import React from "react";
import type { Metadata } from "next";
import apiRequest from "@/app/lib/api-request";
import { propertyType } from "../../page";
import Testimonials from "../../../components/sections/testimonials";
import ListingDetailsPage from "../../../components/listing-details";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const propertyId = (await params).id;

  const propertyData = await apiRequest<{
    message: string;
    data: { property: propertyType };
  }>(`public/listing/${propertyId}`, {
    tag: "fetchPublicProperty", 
  });

  const property = propertyData.data.property;

  const title = `${property.propertyTitle} | Realtor Demo Property Details`;
  const description =
    property.description ||
    "Explore this property listed on RealtyIllustration's pagee.";
  const baseImage =
    property.images?.[0]?.url ||
    "https://realtyillustrations.live/images/logo.png";
  const url = `https://realtyillustrations.live/demo/broker/listings/sale/${propertyId}`;

  return {
    title,
    description,
    keywords: [
      "real estate",
      "trends",
      "realtor demo",
      "independent realtor",
      "blog",
      "real estate technology",
      "property trends",
      property.category,
      property.price.toString(),
      property.location.addressLine1,
      property.location.countryName,
      property.location.stateName,
      property.location.cityName,
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
          url: baseImage,
          width: 1200,
          height: 630,
          alt: property.propertyTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [baseImage],
    },
    metadataBase: new URL("https://realtyillustrations.live"),
    alternates: {
      canonical: url,
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
      <Testimonials />
    </div>
  );
}

export default Page;
