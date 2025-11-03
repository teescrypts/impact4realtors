"use client";

import Link from "next/link";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
  useTheme,
  Tooltip,
  SvgIcon,
} from "@mui/material";
import CalendarIcon from "@/app/icons/untitled-ui/duocolor/calendar";
import FormatList from "@/app/icons/untitled-ui/duocolor/format-list";
import { AppointmentResponse } from "@/types";
import { useRouter } from "nextjs-toploader/app";
import Calendar from "./calendar";
import AppointmentManagement from "./appointment-mgt";
import Google from "@/app/icons/untitled-ui/duocolor/google";
import CheckCircle from "@/app/icons/untitled-ui/duocolor/checked-circle";
import { useUserData } from "@/app/guards/auth-guard";
import { syncCalendar } from "@/app/actions/server-actions";
import { useState } from "react";

type Status = "upcoming" | "completed" | "cancelled" | "rescheduled";

export type AppointmentEventCaledar = {
  id: string;
  title: string;
  start: string;
  end: string;
  type: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  status: Status;
};

export default function AppointmentView({
  calendarEvents,
  appointmentInfo,
  view,
}: {
  calendarEvents?: AppointmentEventCaledar[];
  appointmentInfo?: {
    appointments: AppointmentResponse[];
    hasMore: boolean;
    lastCreatedAt: Date;
  };
  view: "calendar" | "list";
}) {
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState("");

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleViewChange = (
    _event: React.MouseEvent<HTMLElement>,
    newView: "calendar" | "list" | null
  ) => {
    if (newView !== null) {
      if (newView === "calendar") {
        router.push(`/demo/dashboard/appointment?view=calendar`);
      } else {
        router.push(`/demo/dashboard/appointment`);
      }
    }
  };

  const handleGoogleConnect = async () => {
    setSyncing(true);

    const origin = window.location.origin; // 👈 get current site domain (e.g. realtyillustration.live)
    const result = await syncCalendar(origin);

    if (result.url) {
      window.location.href = result.url;
    }

    if (result.error) {
      setMessage(result.error);
    }
  };

  const user = useUserData();
  const isSynced = user.google.calendarSyncEnabled;

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={2}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Typography variant="h4" fontWeight="bold">
              Appointment
            </Typography>

            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              flexWrap="wrap"
            >
              {/* View Toggle */}
              {isSmallScreen ? (
                <ToggleButtonGroup
                  value={view}
                  exclusive
                  onChange={handleViewChange}
                  size="small"
                  color="primary"
                >
                  <Tooltip title="Calendar View">
                    <ToggleButton value="calendar">
                      <CalendarIcon />
                    </ToggleButton>
                  </Tooltip>
                  <Tooltip title="List View">
                    <ToggleButton value="list">
                      <FormatList />
                    </ToggleButton>
                  </Tooltip>
                </ToggleButtonGroup>
              ) : (
                <ToggleButtonGroup
                  value={view}
                  exclusive
                  onChange={handleViewChange}
                  size="small"
                  color="primary"
                  sx={{
                    backgroundColor: "background.paper",
                    borderRadius: 1,
                    boxShadow: 1,
                  }}
                >
                  <ToggleButton value="calendar">
                    <SvgIcon sx={{ mr: 1 }}>
                      <CalendarIcon />
                    </SvgIcon>
                    Calendar View
                  </ToggleButton>
                  <ToggleButton value="list">
                    <SvgIcon sx={{ mr: 1 }}>
                      <FormatList />
                    </SvgIcon>
                    List View
                  </ToggleButton>
                </ToggleButtonGroup>
              )}

              {/* Google Calendar Sync Button */}
              <Tooltip
                title={
                  isSynced
                    ? "Google Calendar Synced"
                    : "Sync with Google Calendar"
                }
              >
                <Button
                  variant={isSynced ? "contained" : "outlined"}
                  color={isSynced ? "success" : "inherit"}
                  onClick={handleGoogleConnect}
                  size={isSmallScreen ? "small" : "medium"}
                  disabled={syncing}
                >
                  {isSynced ? (
                    <>
                      <CheckCircle />
                      {!isSmallScreen && (
                        <Typography sx={{ ml: 1 }}>Synced</Typography>
                      )}
                    </>
                  ) : (
                    <>
                      <Google width="20px" height="20px" />
                      {!isSmallScreen && (
                        <Typography sx={{ ml: 1 }}>Sync</Typography>
                      )}
                    </>
                  )}
                </Button>
              </Tooltip>

              {/* Availability Button */}
              <Link href="/demo/dashboard/appointment/availability" passHref>
                <Button
                  variant="contained"
                  size={isSmallScreen ? "small" : "medium"}
                >
                  Availability
                </Button>
              </Link>
            </Stack>
          </Stack>

          {message && (
            <Typography textAlign={"center"} variant="subtitle2" color="error">
              {message}
            </Typography>
          )}

          {/* Conditionally Render Views */}
          {view === "calendar" ? (
            <Calendar events={calendarEvents!} />
          ) : (
            <AppointmentManagement
              appointments={appointmentInfo!.appointments}
              hasMore={appointmentInfo!.hasMore}
              lastCreatedAt={appointmentInfo!.lastCreatedAt}
            />
          )}
        </Stack>
      </Container>
    </Box>
  );
}
