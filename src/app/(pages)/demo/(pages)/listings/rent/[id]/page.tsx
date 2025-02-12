import React from "react";
import ListingDetailsPage from "../../../components/listing-details";

import type { Metadata } from "next";

// type Props = {
//   params: Promise<{ id: string }>;
//   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
// };

export async function generateMetadata(): Promise<Metadata> {
  // { params, searchParams }: Props,
  // parent: ResolvingMetadata
  // In a real app, you'd fetch the blog data using the blog ID from params.
  // For this example, we'll use dummy blog data.
  const blogId = "hahhhshshshshshs";
  const blog = {
    title: "The Future of Real Estate: Trends to Watch",
    description:
      "In today's rapidly evolving real estate market, staying ahead of trends is crucial. Discover modern trends shaping the future of real estate in this insightful blog post.",
    image: "https://yourdomain.com/images/blog_future_real_estate.jpg",
  };

  return {
    title: `${blog.title} | Realtor Demo Blog`,
    description: blog.description,
    keywords:
      "real estate, trends, realtor demo, independent realtor, blog, real estate technology, property trends",
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    openGraph: {
      title: `${blog.title} | Realtor Demo Blog`,
      description: blog.description,
      url: `https://yourdomain.com/blog/${blogId}`,
      type: "article",
      images: [
        {
          url: blog.image,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${blog.title} | Realtor Demo Blog`,
      description: blog.description,
      images: [blog.image],
    },
  };
}

function Page() {
  return (
    <div>
      <ListingDetailsPage />
    </div>
  );
}

export default Page;
