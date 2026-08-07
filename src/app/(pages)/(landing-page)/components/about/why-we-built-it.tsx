"use client";

import CheckCircle from "@/app/icons/untitled-ui/duocolor/checked-circle";
import Close from "@/app/icons/untitled-ui/duocolor/close";
import DesignServices from "@/app/icons/untitled-ui/duocolor/design-services";
import DownArrow from "@/app/icons/untitled-ui/duocolor/down-arrow";
import Paid from "@/app/icons/untitled-ui/duocolor/paid";
import TrendingUp from "@/app/icons/untitled-ui/duocolor/trending-up";
import {
  Box,
  Button,
  Container,
  Grid2,
  Stack,
  SvgIcon,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import Link from "next/link";

const theProblem = [
  {
    title: "What the brokerage hands you",
    body: "A generic profile page on someone else's site, with your name swapped in. No control over what it captures, no say in how it looks, and it disappears the day you move.",
  },
  {
    title: "What the platforms sell you",
    body: "A subscription to a template thousands of other agents are also using. Little real customization, features locked behind higher tiers, and a bill that keeps climbing.",
  },
];

const principles = [
  {
    title: "Custom, not templated",
    body: "Your site is built for your brand and the way you actually work — not picked from a gallery every other agent is picking from.",
    icon: <DesignServices />,
  },
  {
    title: "Priced within your capacity",
    body: "$30 a month, flat. The tool should never cost more than the growth it enables, and nothing worth having sits behind a higher tier.",
    icon: <Paid />,
  },
  {
    title: "Built to grow with you",
    body: "Everything an agent needs is included from day one, so the site keeps up as your business gets bigger instead of being outgrown.",
    icon: <TrendingUp />,
  },
];

export default function WhyWeBuiltIt() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "relative",
        bgcolor: "background.default",
        py: { xs: 10, md: 14 },
        borderTop: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ maxWidth: 660, mb: { xs: 6, md: 8 } }}>
          <Typography
            component="span"
            sx={{
              display: "inline-block",
              mb: 2,
              px: 1.5,
              py: 0.5,
              borderRadius: "6px",
              bgcolor: theme.palette.primary.alpha12,
              color: "primary.main",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Why we built it
          </Typography>

          <Typography
            component="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.875rem", md: "2.5rem" },
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              color: "text.primary",
              mb: 2,
            }}
          >
            Agents were being offered two bad options
          </Typography>

          <Typography
            sx={{
              fontSize: "1.0625rem",
              color: "text.secondary",
              lineHeight: 1.7,
            }}
          >
            Every agent we spoke to wanted the same thing and couldn&apos;t buy
            it anywhere: a site that was genuinely theirs, that did real work,
            at a price that made sense for a business of one.
          </Typography>
        </Box>

        {/* The two bad options */}
        <Grid2 container spacing={2.5}>
          {theProblem.map(({ title, body }, index) => (
            <Grid2 size={{ xs: 12, md: 6 }} key={title}>
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                sx={{
                  height: "100%",
                  p: { xs: 2.5, md: 3 },
                  borderRadius: "16px",
                  border: "1px dashed",
                  borderColor: "divider",
                  bgcolor: alpha(theme.palette.text.primary, 0.02),
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1.5}
                  sx={{ mb: 1.5 }}
                >
                  <SvgIcon
                    sx={{ fontSize: 17, color: "error.main", flexShrink: 0 }}
                  >
                    <Close />
                  </SvgIcon>
                  <Typography
                    sx={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "text.primary",
                    }}
                  >
                    {title}
                  </Typography>
                </Stack>
                <Typography
                  sx={{
                    fontSize: "0.9375rem",
                    color: "text.secondary",
                    lineHeight: 1.7,
                  }}
                >
                  {body}
                </Typography>
              </Box>
            </Grid2>
          ))}
        </Grid2>

        {/* Arrow */}
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          <SvgIcon sx={{ fontSize: 28, color: "primary.main" }}>
            <DownArrow />
          </SvgIcon>
        </Box>

        {/* Our answer */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          sx={{
            position: "relative",
            p: { xs: 3, md: 4.5 },
            borderRadius: "20px",
            border: "1.5px solid",
            borderColor: "primary.main",
            bgcolor: theme.palette.primary.alpha8,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -100,
              right: -60,
              width: 260,
              height: 260,
              bgcolor: "primary.main",
              opacity: 0.12,
              filter: "blur(80px)",
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />

          <Box sx={{ position: "relative", maxWidth: 720 }}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{ mb: 2 }}
            >
              <SvgIcon sx={{ fontSize: 20, color: "success.main" }}>
                <CheckCircle />
              </SvgIcon>
              <Typography
                sx={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "primary.main",
                }}
              >
                So we built the third option
              </Typography>
            </Stack>

            <Typography
              sx={{
                fontSize: { xs: "1.25rem", md: "1.5rem" },
                fontWeight: 700,
                color: "text.primary",
                lineHeight: 1.45,
                letterSpacing: "-0.01em",
                mb: 2,
              }}
            >
              A custom-built website that belongs to you, with every tool an
              agent needs already inside it — for $30 a month.
            </Typography>

            <Typography
              sx={{
                fontSize: "1rem",
                color: "text.secondary",
                lineHeight: 1.75,
                mb: 3.5,
              }}
            >
              Lead capture, follow-up automation, listings, appointments, blog
              and a dashboard to run all of it. Not a template with your logo
              dropped in, and not six subscriptions stitched together — one site
              designed around how you actually work.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                component={Link}
                href="/features"
                variant="contained"
                color="primary"
                sx={{
                  fontWeight: 700,
                  borderRadius: "10px",
                  px: 3.5,
                  py: 1.4,
                  textTransform: "none",
                  fontSize: "0.9375rem",
                  boxShadow: "none",
                  "&:hover": { boxShadow: "none" },
                }}
              >
                Explore the features
              </Button>
              <Button
                component={Link}
                href="/pricing"
                variant="outlined"
                color="primary"
                sx={{
                  fontWeight: 600,
                  borderRadius: "10px",
                  px: 3.5,
                  py: 1.4,
                  textTransform: "none",
                  fontSize: "0.9375rem",
                  borderWidth: "1.5px",
                  "&:hover": { borderWidth: "1.5px" },
                }}
              >
                See the pricing
              </Button>
            </Stack>
          </Box>
        </Box>

        {/* Principles */}
        <Grid2 container spacing={2.5} sx={{ mt: { xs: 6, md: 8 } }}>
          {principles.map(({ title, body, icon }, index) => (
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={title}>
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                sx={{
                  height: "100%",
                  p: 3,
                  borderRadius: "16px",
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                  transition: "border-color 0.3s ease, transform 0.3s ease",
                  "&:hover": {
                    borderColor: "primary.main",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: theme.palette.primary.alpha12,
                    mb: 2.5,
                  }}
                >
                  <SvgIcon sx={{ fontSize: 21, color: "primary.main" }}>
                    {icon}
                  </SvgIcon>
                </Box>
                <Typography
                  sx={{
                    fontSize: "1.0625rem",
                    fontWeight: 700,
                    color: "text.primary",
                    lineHeight: 1.3,
                    mb: 1,
                  }}
                >
                  {title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.9375rem",
                    color: "text.secondary",
                    lineHeight: 1.7,
                  }}
                >
                  {body}
                </Typography>
              </Box>
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </Box>
  );
}
