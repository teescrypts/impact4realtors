import { formatCreatedAt } from "@/app/utils/format-created-at";
import truncateWords from "@/app/utils/truncated-words";
import { BlogPostResponse } from "@/types";
import {
  Grid2,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import React from "react";

function BlogCard({
  blogs,
  adminId,
}: {
  blogs: BlogPostResponse[];
  adminId?: string;
}) {
  return (
    <div>
      {" "}
      <Grid2 container spacing={4}>
        {blogs.map((blog, index) => (
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardActionArea
                href={
                  adminId
                    ? `/demo/broker/blog/${blog._id}?admin=${adminId}`
                    : `/demo/broker/blog/${blog._id}`
                }
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={blog.cover.url}
                  alt={blog.title}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent>
                  <Typography variant="caption" color="text.secondary">
                    {formatCreatedAt(blog.createdAt)}
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                    mt={1}
                  >
                    {blog.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {truncateWords(blog.shortDescription, 15)}
                  </Typography>
                  <Button
                    size="small"
                    sx={{ textTransform: "none", borderRadius: 2 }}
                  >
                    Read More
                  </Button>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </div>
  );
}

export default BlogCard;
