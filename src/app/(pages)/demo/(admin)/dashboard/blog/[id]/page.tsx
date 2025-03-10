import apiRequest from "@/app/lib/api-request";
import { blogType, BlogType } from "@/types";
import { cookies } from "next/headers";
import React from "react";
import { DraftImgType } from "../../listing/add/page";
import EditBlog from "../../components/edit-blog";
import { RouterLink } from "@/app/component/router-link";
import {
  Box,
  Container,
  Typography,
  Stack,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { Metadata } from "next";

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

  return {
    title: `${blog.title} | Realtor Demo Blog`,
    description: blog.shortDescription,
    keywords:
      "real estate, trends, realtor demo, independent realtor, blog, real estate technology, property trends",
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    openGraph: {
      title: `${blog.title} | Realtor Demo Blog`,
      description: blog.shortDescription,
      url: `https://realtyillustrations.live/demo/dashboard/blog/${blogId}`,
      type: "article",
      images: [
        {
          url: blog.cover!.url!,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${blog.title} | Realtor Demo Blog`,
      description: blog.shortDescription,
      images: [blog.cover!.url!],
    },
  };
}

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const response = await apiRequest<{
    data: { blog: BlogType; draftImg: DraftImgType };
  }>(`admin/blog/${id}`, {
    token,
    tag: "fetchAdminBlog",
  });

  const blog = response.data.blog;
  const draftImg = response.data.draftImg;

  return (
    <div>
      {" "}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="h4" sx={{ mb: 2 }}>
            Edit Blog
          </Typography>

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
              <Typography color="text.primary"> Edit Blog</Typography>
            </Breadcrumbs>
          </Stack>

          <EditBlog blog={blog} draftImg={draftImg} />
        </Container>
      </Box>
    </div>
  );
}

export default Page;
