"use client";

import { BlogPostResponse } from "@/types";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  useTheme,
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
  const theme = useTheme();
  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        py: { xs: 12, md: 16 },
        background: `linear-gradient(to bottom, ${theme.palette.background.paper}, ${theme.palette.primary.alpha30})`,
        overflow: "hidden",
      }}
    >
      {/* Decorative Blob SVG */}
      <Box
        sx={{
          position: "absolute",
          top: "-60px",
          left: "-100px",
          width: "300px",
          height: "300px",
          opacity: 0.1,
          zIndex: 0,
          transform: "rotate(20deg)",
        }}
      >
        <svg
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          fill={theme.palette.primary.main}
        >
          <path
            d="M44.8,-78.9C58.4,-68.6,70.4,-58.2,77.8,-45.5C85.3,-32.8,88.3,-17.9,87.2,-3C86.1,11.9,80.8,23.7,73.8,35.7C66.8,47.6,58.1,59.7,46.2,67.9C34.3,76.2,19.2,80.6,3.7,75.6C-11.9,70.6,-23.8,56.1,-33.9,44.3C-43.9,32.5,-52.1,23.3,-62.3,10.3C-72.6,-2.8,-84.9,-19.6,-81.3,-32.4C-77.6,-45.1,-58,-54,-41.1,-63.4C-24.2,-72.9,-12.1,-82.9,2.3,-86.5C16.7,-90.2,33.4,-87.3,44.8,-78.9Z"
            transform="translate(100 100)"
          />
        </svg>
      </Box>

      <Container sx={{ position: "relative", zIndex: 1 }}>
        <Typography
          variant="h3"
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
          mb={8}
        >
          Explore expert advice, home tips, and real estate stories curated for
          you.
        </Typography>

        {/* Blog Grid */}
        <BlogCard blogs={blogs} />

        {/* CTA */}
        <Stack direction="row" justifyContent="center" mt={10}>
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
                px: 5,
              }}
            >
              View All Blogs
            </Button>
          </Link>
        </Stack>
      </Container>
    </Box>
  );
}
