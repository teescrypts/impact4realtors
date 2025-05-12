"use client";

import { BlogPostResponse } from "@/types";
import { Box, Typography, Container, Pagination } from "@mui/material";
import { useRouter } from "next/navigation";
import BlogCard from "./blog-card";

export default function Blogs({
  blogs,
  pagination,
  adminId,
}: {
  blogs: BlogPostResponse[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBlogs: number;
  };
  adminId?: string;
}) {
  const router = useRouter();

  return (
    <Container sx={{ mt: 6, mb: 6 }}>
      <Box sx={{ py: 8, px: 3 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" gutterBottom>
            Latest Blogs
          </Typography>
          <Typography variant="subtitle1" maxWidth="600px" mx="auto">
            Insights, Tips, and Trends from Our Experts
          </Typography>
        </Box>

        <>
          <BlogCard adminId={adminId} blogs={blogs} />

          {blogs.length > 0 && (
            <Box display="flex" justifyContent="center" my={4}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.currentPage}
                onChange={(_, value) => router.push(value.toString())}
                color="primary"
              />
            </Box>
          )}
        </>
      </Box>
    </Container>
  );
}
