"use client";

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
import { useRouter } from "next/navigation";

const blogs = [
  {
    id: 1,
    title: "5 Tips for First-Time Home Buyers",
    description:
      "Buying your first home? Here are essential tips to guide you through the process.",
    image: "/images/blog1.jpg",
    link: "/blog/first-time-buyers",
  },
  {
    id: 2,
    title: "The Future of Real Estate Investments",
    description:
      "Learn how the real estate market is evolving and how to make smart investments.",
    image: "/images/blog2.jpg",
    link: "/blog/real-estate-investments",
  },
  {
    id: 3,
    title: "Interior Design Trends for 2025",
    description:
      "Discover the latest interior design trends that will dominate the market in 2025.",
    image: "/images/blog3.jpg",
    link: "/blog/interior-design-trends",
  },
];

export default function LatestBlogs() {
  const router = useRouter();

  return (
    <Container sx={{ mt: 6, mb: 6 }}>
      <Box
        sx={{
          py: 8,
          px: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" fontWeight="bold" mb={4} color="primary">
          Latest Blogs
        </Typography>

        <Grid2 container spacing={3} justifyContent="center">
          {blogs.map((blog) => (
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={blog.id}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
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
                    image={blog.image}
                    alt={blog.title}
                  />
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {blog.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {blog.description}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => router.push(blog.link)}
                    >
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid2>
          ))}
        </Grid2>

        <Box mt={4}>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => router.push("/blog")}
          >
            Explore Blog
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
