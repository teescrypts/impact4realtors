"use client";

import Instagram from "@/app/icons/untitled-ui/duocolor/instaagram";
import Linkedin from "@/app/icons/untitled-ui/duocolor/linkedin";
import Share07 from "@/app/icons/untitled-ui/duocolor/share-07";
import Twitter from "@/app/icons/untitled-ui/duocolor/twitter";
import Whatsapp from "@/app/icons/untitled-ui/duocolor/whatsapp";
import { formatCreatedAt } from "@/app/utils/format-created-at";
import { blogType } from "@/types";
import {
  Container,
  Box,
  Typography,
  Stack,
  Divider,
  IconButton,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function SingleBlogPage({
  blog,
  adminId,
}: {
  blog: blogType;
  adminId?: string;
}) {
  const blogUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = `Check out this blog: ${blog.title}`;

  const sharePost = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: shareTitle,
          url: blogUrl,
        });
        return;
      } catch (error) {
        console.warn(
          "Web Share API failed, falling back to deep links.",
          error
        );
      }
    }

    // If Web Share API fails, open Facebook share as fallback
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        blogUrl
      )}`,
      "_blank"
    );
  };

  return (
    <Container maxWidth={"lg"} sx={{ my: 6 }}>
      {/* Blog Header */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: { xs: 500, md: 600 }, // Responsive height
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {blog.cover?.url && (
            <Image
              src={blog.cover.url}
              alt={blog.title!}
              layout="fill"
              objectFit="cover"
              priority // Improve performance for above-the-fold images
            />
          )}
        </Box>

        <Typography variant="h3" fontWeight="bold" mt={3}>
          {blog.title}
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center" mt={1}>
          <Typography variant="body1" color="text.secondary">
            By {blog.author}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {formatCreatedAt(blog.createdAt)}
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
        dangerouslySetInnerHTML={{ __html: blog.content! }}
      />

      {/* Call-to-Action: Share or Navigate */}
      <Box textAlign="center" mt={4}>
        <Link
          href={adminId ? `/demo/blog?admin=${adminId}` : `/demo/blog`}
          passHref
        >
          <Typography
            variant="body2"
            color="primary"
            sx={{ cursor: "pointer", textDecoration: "underline" }}
          >
            Read more Blogs
          </Typography>
        </Link>

        {/* Social Share Buttons */}
        <Stack direction="row" spacing={1} justifyContent="center" mt={2}>
          <IconButton color="primary" onClick={sharePost}>
            <Share07 />
          </IconButton>
          <IconButton
            component="a"
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              shareTitle
            )}&url=${encodeURIComponent(blogUrl)}`}
            target="_blank"
            aria-label="Share on Twitter"
            color="primary"
          >
            <Twitter />
          </IconButton>
          <IconButton
            component="a"
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              shareTitle + " " + blogUrl
            )}`}
            target="_blank"
            aria-label="Share on WhatsApp"
            color="success"
          >
            <Whatsapp />
          </IconButton>
          <IconButton
            component="a"
            href={`https://www.instagram.com/?url=${encodeURIComponent(
              blogUrl
            )}`}
            target="_blank"
            aria-label="Share on Instagram"
            color="secondary"
          >
            <Instagram />
          </IconButton>
          <IconButton
            component="a"
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              blogUrl
            )}`}
            target="_blank"
            aria-label="Share on LinkedIn"
            color="primary"
          >
            <Linkedin />
          </IconButton>
        </Stack>
      </Box>
    </Container>
  );
}

export default SingleBlogPage;
