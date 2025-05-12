"use client";

import { BlogPostResponse } from "@/types";
import {
  Box,
  Button,
  Container,
  Typography,
} from "@mui/material";
import BlogCard from "../blog-card";
import Link from "next/link";

export default function LatestBlogs({
  blogs,
  adminId,
}: {
  blogs: BlogPostResponse[];
  adminId?: string;
}) {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 10, md: 14 },
        background: "linear-gradient(to left, #fdfcff, #f2f6ff)",
      }}
    >
      <Container>
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
        >
          Latest Blog Posts
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          textAlign="center"
          maxWidth="600px"
          mx="auto"
          mb={6}
        >
          Discover expert advice, real estate tips, and market insights to help
          guide your journey.
        </Typography>

        <BlogCard adminId={adminId} blogs={blogs} />

        <Box textAlign="center" mt={8}>
          <Link
            href={
              adminId
                ? `/demo/broker/blog?admin=${adminId}`
                : `/demo/broker/blog`
            }
            passHref
          >
            <Button
              variant="contained"
              size="large"
              sx={{
                borderRadius: 50,
                textTransform: "none",
                px: 4,
              }}
            >
             View Blogs
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}
