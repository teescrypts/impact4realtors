"use client";

import { blogType } from "@/types";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid2,
  Container,
  Pagination,
} from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import EmptyState from "./empty-state";
import Image from "next/image";

export default function Blogs({
  blogs,
  pagination,
  adminId,
}: {
  blogs: blogType[];
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
      <Box sx={{ py: 8, px: 3, textAlign: "center" }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" gutterBottom>
            Latest Blogs
          </Typography>
          <Typography variant="subtitle1" maxWidth="600px" mx="auto">
            Insights, Tips, and Trends from Our Experts
          </Typography>
        </Box>

        <>
          <Grid2 container spacing={3} justifyContent="center">
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={blog._id}>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Card
                      sx={{
                        mx: "auto",
                        boxShadow: 4,
                        borderRadius: 3,
                        overflow: "hidden",
                        transition: "transform 0.3s ease-in-out",
                      }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          height: 260,
                        }}
                      >
                        <Image
                          src={blog.cover!.url!}
                          alt={blog.title!}
                          layout="fill"
                          objectFit="cover"
                        />
                      </Box>
                      <CardContent>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {blog.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mb={2}
                        >
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
              ))
            ) : (
              <EmptyState
                title="No Blog Found"
                description="Please check back later"
              />
            )}
          </Grid2>

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
