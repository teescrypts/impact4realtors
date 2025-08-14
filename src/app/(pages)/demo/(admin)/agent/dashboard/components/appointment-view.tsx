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

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleViewChange = (
    _event: React.MouseEvent<HTMLElement>,
    newView: "calendar" | "list" | null
  ) => {
    if (newView !== null) {
      if (newView === "calendar") {
        router.push(`/demo/agent/dashboard/appointment?view=calendar`);
      } else {
        router.push(`/demo/agent/dashboard/appointment`);
      }
    }
  };

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
          >
            <Typography variant="h4">Appointment</Typography>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              flexWrap="wrap"
            >
              {/* View Toggle */}
              {isSmallScreen ? (
                // Icon-only version for mobile
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
                // Full label version for larger screens
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

              {/* Availability Button */}

              <Link
                href="/demo/agent/dashboard/appointment/availability"
                passHref
              >
                <Button
                  variant="contained"
                  size={isSmallScreen ? "small" : "medium"}
                >
                  Availability
                </Button>
              </Link>
            </Stack>
          </Stack>

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
