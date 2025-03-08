"use client";

import { BlogPostResponse } from "@/types";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Grid2,
  Container,
} from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import EmptyState from "../empty-state";

export default function LatestBlogs({
  blogs,
  adminId,
}: {
  blogs: BlogPostResponse[];
  adminId?: string;
}) {
  const router = useRouter();

  return (
    <Container maxWidth={"xl"}>
      <Box
        sx={{
          py: 8,
          px: 3,
          textAlign: "center",
        }}
      >
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" gutterBottom>
            Latest Blogs
          </Typography>
          <Typography variant="subtitle1" maxWidth="600px" mx="auto">
            Insights, Tips, and Trends from Our Experts
          </Typography>
        </Box>

        {blogs.length > 0 ? (
          <Grid2 container spacing={3} justifyContent="center">
            {blogs.map((blog) => (
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={blog._id}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                >
                  <Card
                    sx={{
                      mx: "auto",
                      boxShadow: 4,
                      borderRadius: 3,
                      overflow: "hidden",
                      transition: "transform 0.3s ease-in-out",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="300"
                      image={blog.cover.url}
                      alt={blog.title}
                    />
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {blog.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        {blog.shortDescription}
                      </Typography>
                      <Link
                        href={
                          adminId
                            ? `/demo/blog/${blog._id}?admin=${adminId}`
                            : `/demo/blog/${blog._id}`
                        }
                      >
                        <Button variant="contained" color="primary">
                          Read More
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid2>
            ))}
          </Grid2>
        ) : (
          <EmptyState
            title="No blogs found. "
            description="Please check back later"
          />
        )}

        {blogs.length > 0 && (
          <Box mt={4}>
            <Link href={adminId ? `/demo/blog?admin=${adminId}` : `/demo/blog`}>
              <Button variant="outlined" color="primary" size="large">
                Explore Blog
              </Button>
            </Link>
          </Box>
        )}
      </Box>
    </Container>
  );
}
