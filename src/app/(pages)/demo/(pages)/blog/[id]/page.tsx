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

const BlogPage = () => {
  // Dummy blog data; in practice, fetch the blog using the blogId parameter.
  const blog = {
    id: 1,
    title: "The Future of Real Estate: Trends to Watch",
    image: "/images/bg-demo.webp",
    author: "Alex Johnson",
    date: "February 20, 2025",
    content: `
      <p>In today's rapidly evolving real estate market, staying ahead of the trends is crucial. Modern technology, sustainable living, and innovative design are all playing a significant role in shaping the future of our industry.</p>
      <p>This blog explores some of the key trends that every independent realtor should watch closely. From smart home integration to eco-friendly building materials, the landscape is changing rapidly.</p>
      <p>By understanding these trends, realtors can better serve their clients and capitalize on emerging opportunities. Whether you're buying, selling, or simply curious about the future of real estate, there's a lot to discover in this exciting era of innovation.</p>
    `,
  };

  return (
    <Container sx={{ my: 6, fontFamily: "Poppins, sans-serif" }}>
      {/* Blog Header */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Box
          component="img"
          src={blog.image}
          alt={blog.title}
          sx={{
            width: "100%",
            maxHeight: { xs: 400, md: 500 },
            objectFit: "cover",
            borderRadius: 2,
          }}
        />
        <Typography variant="h3" fontWeight="bold" mt={3}>
          {blog.title}
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" mt={1}>
          <Typography variant="body1" color="text.secondary">
            By {blog.author}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {blog.date}
          </Typography>
        </Stack>
      </Box>
      <Divider sx={{ mb: 4 }} />

      {/* Blog Content */}
      <Box
        sx={{
          "& p": { mb: 2, lineHeight: 1.6 },
          textAlign: "justify",
        }}
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* Call-to-Action: Share or Navigate */}
      <Box textAlign="center" mt={4}>
        <Link href={"/demo/blog"}>
          <Button variant="contained" color="primary">
            Back to Blogs
          </Button>
        </Link>

        <Button variant="outlined" color="primary" sx={{ ml: 2 }}>
          Share this Blog
        </Button>
      </Box>
    </Container>
  );
};

export default BlogPage;
