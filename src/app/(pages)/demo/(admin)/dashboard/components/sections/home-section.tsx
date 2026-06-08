"use client";

import Calendar from "@/app/icons/untitled-ui/duocolor/calendar";
import Funnel from "@/app/icons/untitled-ui/duocolor/funnel";
import HomeSmile from "@/app/icons/untitled-ui/duocolor/home-smile";
import RealEstateAgent from "@/app/icons/untitled-ui/duocolor/real-estate-agent";
import Users03 from "@/app/icons/untitled-ui/duocolor/users-03";
import {
  Typography,
  Grid2,
  Box,
  Button,
  Container,
  Stack,
  Avatar,
  Chip,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useMemo } from "react";
import React from "react";
import LeadChart from "../lead-chart";
import { HomeDataRes } from "../../home/page";

/* ─────────────────────────────────────────────
   Quick actions config
───────────────────────────────────────────── */
const quickActions = [
  {
    label: "Add Listing",
    path: "/demo/dashboard/listing/add",
    icon: <RealEstateAgent />,
    description: "Post a new property",
  },
  {
    label: "Appointments",
    path: "/demo/dashboard/appointment",
    icon: <Calendar />,
    description: "View your schedule",
  },
  {
    label: "Manage Leads",
    path: "/demo/dashboard/lead",
    icon: <Funnel />,
    description: "Track prospects",
  },
];

/* ─────────────────────────────────────────────
   Stat card
───────────────────────────────────────────── */
function StatCard({
  title,
  value,
  icon,
  accentColor,
  trend,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  accentColor: string;
  trend?: string;
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: 3,
        p: 3,
        bgcolor: isDark ? alpha("#fff", 0.04) : "#fff",
        border: "1px solid",
        borderColor: isDark ? alpha("#fff", 0.08) : alpha("#000", 0.07),
        boxShadow: isDark
          ? "none"
          : "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)",
        overflow: "hidden",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: isDark
            ? `0 0 0 1px ${alpha(accentColor, 0.3)}`
            : "0 4px 24px rgba(0,0,0,0.1)",
        },
      }}
    >
      {/* Accent bar */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          bgcolor: accentColor,
          borderRadius: "3px 3px 0 0",
        }}
      />

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Box>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              fontSize: "0.7rem",
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{ mt: 0.5, lineHeight: 1, letterSpacing: "-0.02em" }}
          >
            {value}
          </Typography>
          {trend && (
            <Chip
              label={trend}
              size="small"
              sx={{
                mt: 1,
                height: 20,
                fontSize: "0.68rem",
                fontWeight: 700,
                bgcolor: alpha(accentColor, 0.1),
                color: accentColor,
                border: "none",
              }}
            />
          )}
        </Box>

        <Avatar
          sx={{
            width: 44,
            height: 44,
            bgcolor: alpha(accentColor, 0.12),
            color: accentColor,
            borderRadius: 2,
          }}
        >
          {icon}
        </Avatar>
      </Stack>
    </Box>
  );
}

/* ─────────────────────────────────────────────
   Quick action card
───────────────────────────────────────────── */
function ActionCard({
  label,
  description,
  path,
  icon,
}: {
  label: string;
  description: string;
  path: string;
  icon: React.ReactNode;
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;

  return (
    <Button
      href={path}
      sx={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 1,
        p: 2,
        borderRadius: 2.5,
        textTransform: "none",
        textAlign: "left",
        bgcolor: isDark ? alpha("#fff", 0.03) : alpha(primary, 0.03),
        border: "1px solid",
        borderColor: isDark ? alpha("#fff", 0.07) : alpha(primary, 0.1),
        color: "text.primary",
        transition: "all 0.18s ease",
        "&:hover": {
          bgcolor: isDark ? alpha(primary, 0.12) : alpha(primary, 0.08),
          borderColor: alpha(primary, 0.3),
          transform: "translateY(-1px)",
        },
      }}
    >
      <Avatar
        sx={{
          width: 36,
          height: 36,
          bgcolor: alpha(primary, 0.1),
          color: primary,
          borderRadius: 1.5,
        }}
      >
        {icon}
      </Avatar>
      <Box>
        <Typography variant="body2" fontWeight={700} lineHeight={1.2}>
          {label}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          mt={0.25}
        >
          {description}
        </Typography>
      </Box>
    </Button>
  );
}

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
function HomeSection({ data }: { data: HomeDataRes }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const stats = useMemo(
    () => [
      {
        title: "Total Listings",
        value: data.totalListings,
        icon: <HomeSmile fontSize="small" />,
        accentColor: theme.palette.primary.main,
        trend: "Active",
      },
      {
        title: "Upcoming Appointments",
        value: data.totalUpcomingAppointments,
        icon: <Calendar fontSize="small" />,
        accentColor: theme.palette.secondary.main,
        trend: "Scheduled",
      },
      {
        title: "Leads Today",
        value: data.totalNewLeads,
        icon: <Users03 fontSize="small" />,
        accentColor: theme.palette.success.main,
        trend: "New today",
      },
    ],
    [data, theme],
  );

  const hour = parseInt(
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone: "America/New_York",
    }).format(new Date()),
  );
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <Box
      sx={{
        minHeight: "100%",
        bgcolor: isDark ? "grey.950" : alpha("#f8f9fb", 1),
      }}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack spacing={4}>
          {/* ── Header ── */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
          >
            <Box>
              <Typography
                variant="overline"
                sx={{
                  color: "primary.main",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  fontSize: "0.7rem",
                }}
              >
                Dashboard
              </Typography>
              <Typography
                variant="h4"
                fontWeight={800}
                letterSpacing="-0.02em"
                lineHeight={1.2}
              >
                {greeting} 👋
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                Here's what's happening with your properties today.
              </Typography>
            </Box>

            <Button
              href="/demo/dashboard/listing/add"
              variant="contained"
              startIcon={<RealEstateAgent />}
              sx={{
                borderRadius: 2,
                fontWeight: 700,
                textTransform: "none",
                px: 2.5,
                py: 1.25,
                flexShrink: 0,
                boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              Add New Listing
            </Button>
          </Stack>

          {/* ── Stat Cards ── */}
          <Grid2 container spacing={2.5}>
            {stats.map((stat, i) => (
              <Grid2 size={{ xs: 12, sm: 4 }} key={i}>
                <StatCard {...stat} />
              </Grid2>
            ))}
          </Grid2>

          {/* ── Lead Chart ── */}
          <Box
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: isDark ? alpha("#fff", 0.08) : alpha("#000", 0.07),
              bgcolor: isDark ? alpha("#fff", 0.03) : "#fff",
              overflow: "hidden",
              boxShadow: isDark
                ? "none"
                : "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)",
            }}
          >
            <LeadChart leadData={data.leadChartData} />
          </Box>

          {/* ── Quick Actions ── */}
          <Box>
            <Typography
              variant="overline"
              sx={{
                color: "text.secondary",
                fontWeight: 700,
                letterSpacing: "0.1em",
                fontSize: "0.7rem",
                mb: 1.5,
                display: "block",
              }}
            >
              Quick Actions
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              {quickActions.map((action, idx) => (
                <ActionCard key={idx} {...action} />
              ))}
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

export default HomeSection;
