"use client";

import {
  Card,
  CardContent,
  Typography,
  IconButton,
  CardMedia,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import { format } from "date-fns";
import { useState } from "react";
import { BlogType } from "./blog-page";
import truncateWords from "@/app/utils/truncated-words";
import Edit from "@/app/icons/untitled-ui/duocolor/edit";
import Delete from "@/app/icons/untitled-ui/duocolor/delete";
import Comments from "@/app/icons/untitled-ui/duocolor/comment";
import Likes from "@/app/icons/untitled-ui/duocolor/likes";
import Share07 from "@/app/icons/untitled-ui/duocolor/share-07";

function formatCreatedAt(createdAt: Date): string {
  return format(new Date(createdAt), "MMMM d, yyyy");
}

const BlogCard: React.FC<BlogType> = ({
  _id,
  createdAt,
  title,
  shortDescription,
  engagements: { comments, likes, shares },
  coverImage: { url, fileName, imageId },
  author,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [message, setMessage] = useState("");

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: isSmallScreen ? "column" : "row",
        padding: 2,
      }}
    >
      <Typography color="error" variant="subtitle2">
        {message}
      </Typography>
      <CardContent
        sx={{
          flex: "1 1 auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="body2" color="textSecondary">
          {formatCreatedAt(new Date(createdAt))}
        </Typography>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ marginBottom: 1 }}
        >
          By {author}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {truncateWords(shortDescription, 20)}
        </Typography>

        {/* Edit/Delete buttons with spacing */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "auto",
          }}
        >
          {/* Edit and Delete Buttons */}
          <Box>
            <Link href={`/demo/dashboard/blog/${_id}`}>
              <IconButton size="small" aria-label="edit">
                <Edit />
              </IconButton>
            </Link>

            <IconButton color="error" size="small" aria-label="delete">
              <Delete />
            </IconButton>
          </Box>
        </Box>
      </CardContent>

      {/* Conditionally render image on larger screens */}
      {!isSmallScreen && (
        <CardMedia
          component="img"
          sx={{ width: 200 }}
          image={url}
          alt={title}
        />
      )}
    </Card>
  );
};

export default BlogCard;
