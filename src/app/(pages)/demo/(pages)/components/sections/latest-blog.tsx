"use client";

import { BlogPostResponse } from "@/types";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid2,
  Container,
} from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import EmptyState from "../empty-state";
import Image from "next/image";
import truncateWords from "@/app/utils/truncated-words";

export default function LatestBlogs({
  blogs,
  adminId,
}: {
  blogs: BlogPostResponse[];
  adminId?: string;
}) {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 8, px: 3, textAlign: "center" }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Explore Our Latest Blogs
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              maxWidth: "600px",
              mx: "auto",
              color: "text.secondary",
              fontSize: "1rem",
            }}
          >
            Insights, Tips, and Trends from Our Experts
          </Typography>
        </Box>

        {blogs.length > 0 ? (
          <Grid2 container spacing={4} justifyContent="center">
            {blogs.map((blog) => (
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={blog._id}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    sx={{
                      borderRadius: 3,
                      overflow: "hidden",
                      boxShadow: 3,
                      transition: "box-shadow 0.3s ease-in-out",
                      "&:hover": { boxShadow: 6 },
                    }}
                  >
                    <Box
                      sx={{ position: "relative", width: "100%", height: 260 }}
                    >
                      <Image
                        src={blog.cover.url}
                        alt={blog.title}
                        layout="fill"
                        objectFit="cover"
                      />
                    </Box>
                    <CardContent
                      sx={{ p: 3, display: "flex", flexDirection: "column" }}
                    >
                      <Typography variant="h6" fontWeight={700} gutterBottom>
                        {blog.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {truncateWords(blog.shortDescription, 10)}
                      </Typography>
                      <Box mt="auto">
                        <Link
                          href={
                            adminId
                              ? `/demo/blog/${blog._id}?admin=${adminId}`
                              : `/demo/blog/${blog._id}`
                          }
                          passHref
                        >
                          <Button variant="contained" color="primary" fullWidth>
                            Read More
                          </Button>
                        </Link>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid2>
            ))}
          </Grid2>
        ) : (
          <EmptyState
            title="No blogs found."
            description="Please check back later"
          />
        )}

        {blogs.length > 0 && (
          <Box mt={5}>
            <Link
              href={adminId ? `/demo/blog?admin=${adminId}` : `/demo/blog`}
              passHref
            >
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
