import { Grid2, Stack } from "@mui/material";
import React from "react";
import BlogCard from "./blog-card";
import EmptyState from "../../../(pages)/components/empty-state";

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
        {blogs.length > 0 &&
          blogs.map((blog, index) => (
            <Grid2 size={{ xs: 12, md: 6, lg: 6 }} key={index}>
              <BlogCard {...blog} />
            </Grid2>
          ))}
      </Grid2>
      {blogs.length === 0 && (
        <Stack justifyContent={"center"} alignItems={"center"}>
          <EmptyState
            title="No Blog Post"
            description="You have not published any blog post."
          />
        </Stack>
      )}
    </div>
  );
}

export default BlogPage;
