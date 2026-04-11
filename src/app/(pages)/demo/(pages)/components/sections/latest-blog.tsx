"use client";

import { BlogPostResponse } from "@/types";
import {
  Box,
  Typography,
  Button,
  Grid2,
  Container,
  Stack,
  Chip,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import Link from "next/link";
import EmptyState from "../empty-state";
import Image from "next/image";
import truncateWords from "@/app/utils/truncated-words";

function BlogCard({
  blog,
  adminId,
  index,
}: {
  blog: BlogPostResponse;
  adminId?: string;
  index: number;
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;

  const href = adminId
    ? `/demo/blog/${blog._id}?admin=${adminId}`
    : `/demo/blog/${blog._id}`;

  return (
    <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.08 }}
        style={{ height: "100%" }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid",
            borderColor: isDark ? alpha("#fff", 0.08) : alpha("#000", 0.07),
            bgcolor: isDark ? alpha("#fff", 0.03) : "white",
            boxShadow: isDark ? "none" : `0 2px 16px ${alpha("#000", 0.06)}`,
            transition: "transform 0.22s ease, box-shadow 0.22s ease",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: isDark
                ? `0 0 0 1px ${alpha(primary, 0.2)}`
                : `0 12px 40px ${alpha("#000", 0.11)}`,
              "& .blog-image": { transform: "scale(1.05)" },
            },
          }}
        >
          {/* Image */}
          <Link href={href} style={{ display: "block", flexShrink: 0 }}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: 220,
                overflow: "hidden",
                bgcolor: "grey.100",
              }}
            >
              <Image
                className="blog-image"
                src={blog.cover.url}
                alt={blog.title}
                fill
                sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                style={{
                  objectFit: "cover",
                  transition: "transform 0.4s ease",
                }}
              />
              {/* Bottom gradient */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 55%)",
                }}
              />
            </Box>
          </Link>

          {/* Content */}
          <Box
            sx={{
              p: 2.5,
              display: "flex",
              flexDirection: "column",
              flex: 1,
              gap: 1.5,
            }}
          >
            <Typography
              component={Link}
              href={href}
              variant="subtitle1"
              fontWeight={700}
              letterSpacing="-0.015em"
              lineHeight={1.35}
              sx={{
                color: "text.primary",
                textDecoration: "none",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                "&:hover": { color: "primary.main" },
                transition: "color 0.15s ease",
              }}
            >
              {blog.title}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              lineHeight={1.65}
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                flex: 1,
              }}
            >
              {truncateWords(blog.shortDescription, 20)}
            </Typography>

            <Button
              component={Link}
              href={href}
              variant="text"
              size="small"
              sx={{
                alignSelf: "flex-start",
                fontWeight: 700,
                fontSize: "0.8rem",
                px: 0,
                color: "primary.main",
                "&:hover": { bgcolor: "transparent", opacity: 0.75 },
              }}
            >
              Read Article →
            </Button>
          </Box>
        </Box>
      </motion.div>
    </Grid2>
  );
}

export default function LatestBlogs({
  blogs,
  adminId,
}: {
  blogs: BlogPostResponse[];
  adminId?: string;
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: isDark ? "background.default" : "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle background orb */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          bottom: "-15%",
          left: "-8%",
          width: { xs: 260, md: 460 },
          height: { xs: 260, md: 460 },
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(primary, 0.06)} 0%, transparent 70%)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Stack spacing={7}>
          {/* ── Header ── */}
          <Stack alignItems="center" spacing={2} textAlign="center">
            <Chip
              label="From our experts"
              size="small"
              sx={{
                bgcolor: alpha(primary, 0.08),
                color: "primary.main",
                fontWeight: 700,
                fontSize: "0.7rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                border: `1px solid ${alpha(primary, 0.18)}`,
                borderRadius: 1,
                height: 26,
              }}
            />
            <Box>
              <Typography
                variant="h3"
                fontWeight={900}
                letterSpacing="-0.03em"
                lineHeight={1.1}
                sx={{ fontSize: { xs: "1.85rem", sm: "2.4rem", md: "2.9rem" } }}
              >
                Insights & market
                <Box component="span" sx={{ color: "primary.main" }}>
                  {" "}
                  updates
                </Box>
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mt: 1.5, maxWidth: 480, mx: "auto", lineHeight: 1.7 }}
              >
                Tips, trends, and expert perspectives to help you make smarter
                real estate decisions.
              </Typography>
            </Box>
          </Stack>

          {/* ── Blog Grid ── */}
          {blogs.length > 0 ? (
            <Grid2 container spacing={3}>
              {blogs.map((blog, i) => (
                <BlogCard
                  key={blog._id}
                  blog={blog}
                  adminId={adminId}
                  index={i}
                />
              ))}
            </Grid2>
          ) : (
            <Stack alignItems="center" py={6}>
              <EmptyState
                title="No posts yet"
                description="Check back soon — new articles are on the way."
              />
            </Stack>
          )}

          {/* ── CTA ── */}
          {blogs.length > 0 && (
            <Stack alignItems="center" spacing={1}>
              <Button
                component={Link}
                href={adminId ? `/demo/blog?admin=${adminId}` : `/demo/blog`}
                variant="contained"
                size="large"
                sx={{
                  px: 5,
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  borderRadius: 2,
                  boxShadow: `0 6px 20px ${alpha(primary, 0.28)}`,
                  "&:hover": {
                    boxShadow: `0 8px 28px ${alpha(primary, 0.38)}`,
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                Visit the Blog →
              </Button>
              <Typography variant="caption" color="text.disabled">
                New articles published weekly
              </Typography>
            </Stack>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
