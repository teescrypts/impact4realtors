import { Grid2 } from "@mui/material";
import React from "react";
import BlogCard from "./blog-card";

export interface BlogType {
  _id: string;
  title: string;
  shortDescription: string;
  author: string;
  content: string;
  status: "draft" | "published";
  cover: { url: string; fileName: string; imageId: string };
  createdAt: string;
  updatedAt: string;
}

function BlogPage({ blogs }: { blogs: BlogType[] }) {
  return (
    <div>
      {" "}
      <Grid2 container spacing={2}>
        {blogs.map((blog, index) => (
          <Grid2 size={{ xs: 12, md: 6, lg: 6 }} key={index}>
            <BlogCard {...blog} />
          </Grid2>
        ))}
      </Grid2>
    </div>
  );
}

export default BlogPage;
