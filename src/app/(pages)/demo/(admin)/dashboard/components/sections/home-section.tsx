"use client";

import Calendar from "@/app/icons/untitled-ui/duocolor/calendar";
import Funnel from "@/app/icons/untitled-ui/duocolor/funnel";
import HomeSmile from "@/app/icons/untitled-ui/duocolor/home-smile";
import RealEstateAgent from "@/app/icons/untitled-ui/duocolor/real-estate-agent";
import Users03 from "@/app/icons/untitled-ui/duocolor/users-03";
import {
  Card,
  CardContent,
  Typography,
  Grid2,
  Box,
  Button,
  AppBar,
  Toolbar,
  Container,
  Stack,
} from "@mui/material";
import { useMemo } from "react";

const quickActions = [
  {
    label: "Add New Listing",
    path: "/demo/dashboard/listing/add",
    icon: <RealEstateAgent />,
  },
  {
    label: "View Appointments",
    path: "/demo/dashboard/appointment",
    icon: <Calendar />,
  },
  { label: "Manage Leads", path: "/demo/dashboard/lead", icon: <Funnel /> },
  // { label: "Newsletter", path: "/dashboard/newsletter", icon: <Mail04 /> },
];

import React from "react";
import LeadChart from "../lead-chart";
import { HomeDataRes } from "../../home/page";

function HomeSection({ data }: { data: HomeDataRes }) {
  const stats = useMemo(() => {
    return [
      {
        title: "Total Listings",
        value: data.totalListings,
        icon: <HomeSmile fontSize="large" color="primary" />,
      },
      {
        title: "Upcoming Appointments",
        value: data.totalUpcomingAppointments,
        icon: <Calendar fontSize="large" color="secondary" />,
      },
      {
        title: "New Leads",
        value: data.totalNewLeads,
        icon: <Users03 fontSize="large" color="success" />,
      },
    ];
  }, [data]);

  return (
    <Container maxWidth="xl">
      <Stack sx={{ mb: 6 }} spacing={2}>
        <Stack sx={{ mb: 2 }}>
          <Typography variant="h4">Home</Typography>
        </Stack>
        <Box>
          {/* Quick Stats */}
          <Grid2 sx={{ my: 4 }} container spacing={3}>
            {stats.map((stat, index) => (
              <Grid2 size={{ xs: 12, sm: 4 }} key={index}>
                <Card>
                  <CardContent
                    sx={{ display: "flex", alignItems: "center", gap: 2 }}
                  >
                    {stat.icon}
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {stat.title}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>

          {/* Recent Activities - Upgraded */}
          <Box sx={{ my: 4 }}>
            {/* <Card>
              <CardContent sx={{ p: 0 }}> */}
            <LeadChart leadData={data.leadChartData} />
            {/* <Scrollbar style={{ maxHeight: 400 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      p: 2,
                    }}
                  >
                    {mockActivities.map((activity, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          p: 2,
                          bgcolor:
                            theme.palette.mode === "dark"
                              ? "grey.900"
                              : "grey.100",
                          borderRadius: 2,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            bgcolor:
                              theme.palette.mode === "dark"
                                ? "grey.800"
                                : "grey.200",
                          },
                        }}
                      >
                        <EventBusy fontSize="small" color="primary" />
                        <Box>
                          <Typography variant="body2">
                            {activity.text}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {activity.time}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Scrollbar> */}
            {/* </CardContent>
            </Card> */}
          </Box>

          {/* Quick Actions */}
          <AppBar
            position="static"
            color="default"
            sx={{ boxShadow: 1, borderRadius: 2, mt: 3 }}
          >
            <Toolbar
              sx={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap", // Ensures wrapping on smaller screens
                gap: 2,
                overflowX: "auto", // Enables horizontal scrolling for very small screens
                p: 1,
              }}
            >
              {quickActions.map((action, idx) => (
                <Button
                  key={idx}
                  href={action.path}
                  startIcon={action.icon}
                  sx={{
                    color: "text.primary",
                    fontSize: "0.875rem",
                    fontWeight: "bold",
                    textTransform: "none",
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    whiteSpace: "nowrap", // Prevents text from breaking into two lines
                    transition: "0.3s",
                    "&:hover": { bgcolor: "primary.light" },
                  }}
                >
                  {action.label}
                </Button>
              ))}
            </Toolbar>
          </AppBar>
        </Box>
      </Stack>
    </Container>
  );
}

export default HomeSection;
