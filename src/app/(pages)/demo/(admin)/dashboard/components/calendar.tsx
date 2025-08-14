"use client";

import {
  Box,
  Card,
  Popover,
  Typography,
  Button,
  useMediaQuery,
  Theme,
  useTheme,
} from "@mui/material";
import { DateTime } from "luxon";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarContainer } from "./calendar-container";
import interactionPlugin from "@fullcalendar/interaction";
import { useRouter } from "nextjs-toploader/app";
import { CalendarApi, EventClickArg } from "@fullcalendar/core/index.js";
import { CalendarToolbar } from "./calendar-toolbar";
import { EventContentArg } from "@fullcalendar/core";
import ConfirmationModal from "./confirmation-modal";
import notify from "@/app/utils/toast";
import { getDateRange } from "@/app/utils/get-date-range";
import { updateAptStatus } from "@/app/actions/server-actions";

type Status = "upcoming" | "completed" | "cancelled" | "rescheduled";

export type AppointmentEvent = {
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

const STATUS_COLORS = (theme: Theme): Record<Status, string> => {
  return {
    upcoming: theme.palette.warning.main, // yellow
    completed: theme.palette.success.main, // green
    cancelled: theme.palette.error.main, // red
    rescheduled: theme.palette.warning.dark,
  };
};

const TIME_ZONE = "America/New_York";

const Calendar = ({ events }: { events: AppointmentEvent[] }) => {
  const calendarRef = useRef<FullCalendar | null>(null);
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));
  const router = useRouter();
  const theme = useTheme();

  const today = DateTime.now().setZone(TIME_ZONE).startOf("day").toJSDate();

  const [date, setDate] = useState(today);
  const [view, setView] = useState<
    "timeGridWeek" | "timeGridDay" | "dayGridMonth"
  >(mdUp ? "timeGridWeek" : "timeGridDay");

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<AppointmentEvent | null>(
    null
  );

  const [aptToDelete, setAptToDelete] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEventSelect = useCallback(
    (arg: EventClickArg) => {
      const found = events.find((e) => e.id === arg.event.id);
      setSelectedEvent(found || null);
      setAnchorEl(arg.el);
    },
    [events]
  );

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setSelectedEvent(null);
  };

  const handleCancelAppointment = (id: string) => {
    setAptToDelete(id);
    handleOpen();
  };

  const handleCanceleBooking = useCallback(() => {
    setLoading(true);
    if (aptToDelete) {
      updateAptStatus("cancelled", aptToDelete).then((result) => {
        if (result?.error) {
          setMessage(result.error);
          setLoading(false);
          handleClose();
        }
        if (result?.message) {
          notify(result.message);
          setLoading(false);
          handleClose();
        }
      });
    }
  }, [aptToDelete]);

  const handleGoToAppointment = () => {
    if (selectedEvent)
      router.push(`/demo/dashboard/appointment/details/${selectedEvent.id}`);
    handlePopoverClose();
  };

  const renderEventContent = (eventInfo: EventContentArg) => {
    const status = eventInfo.event.extendedProps.status as Status;

    return (
      <Box
        sx={{
          p: 0.5,
          cursor: "pointer",
          bgcolor: STATUS_COLORS(theme)[status],
          borderRadius: 1,
          fontSize: 12,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {eventInfo.event.title}
      </Box>
    );
  };

  const updateDateFromCalendar = (calendarApi: CalendarApi) => {
    const newDate = DateTime.fromJSDate(calendarApi.getDate())
      .setZone(TIME_ZONE)
      .toJSDate();
    setDate(newDate);
  };

  const handleDateNext = useCallback(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.next();
      updateDateFromCalendar(calendarApi);
    }
  }, []);

  const handleDatePrev = useCallback(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.prev();
      updateDateFromCalendar(calendarApi);
    }
  }, []);

  const handleDateToday = useCallback(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.today();
      updateDateFromCalendar(calendarApi);
    }
  }, []);

  const handleViewChange = useCallback((view: string) => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.changeView(view);
      setView(view as "dayGridMonth" | "timeGridDay" | "timeGridWeek");
    }
  }, []);

  useEffect(() => {
    const { start, end } = getDateRange(view, date);
    router.push(
      `/demo/dashboard/appointment?start=${start}&end=${end}&view=calendar`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, view]);

  return (
    <>
      <CalendarToolbar
        date={date}
        onDateNext={handleDateNext}
        onDatePrev={handleDatePrev}
        onDateToday={handleDateToday}
        onViewChange={handleViewChange}
        view={view}
      />
      <Card sx={{ my: 2 }}>
        <CalendarContainer>
          <FullCalendar
            ref={calendarRef}
            initialDate={date}
            initialView={view}
            height={800}
            editable={false}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            events={events}
            timeZone="America/New_York" // Correct property: timeZone instead of timezone
            eventClick={handleEventSelect}
            eventContent={renderEventContent}
            headerToolbar={false}
            dayMaxEventRows={false}
            moreLinkClick="popover"
          />
        </CalendarContainer>
      </Card>

      {/* Popover for Appointment Details */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: {
              p: 2,
              maxWidth: 320,
              borderRadius: 2,
              boxShadow: 3,
            },
          },
        }}
      >
        {selectedEvent && (
          <Box>
            {/* Title */}
            <Typography variant="h6" gutterBottom>
              {selectedEvent.title}
            </Typography>

            {/* Time */}
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Time:</strong>{" "}
              {DateTime.fromISO(selectedEvent.start)
                .setZone("America/New_York")
                .toFormat("ccc, MMM d, yyyy • h:mm a")}{" "}
              -{" "}
              {DateTime.fromISO(selectedEvent.end)
                .setZone("America/New_York")
                .toFormat("h:mm a")}
            </Typography>

            {/* Customer Info */}
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Client Details
              </Typography>
              <Typography variant="body2">
                {selectedEvent.customer.firstName}{" "}
                {selectedEvent.customer.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedEvent.customer.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedEvent.customer.phone}
              </Typography>
            </Box>

            {/* Status */}
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="caption"
                sx={{
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  backgroundColor:
                    selectedEvent.status === "cancelled"
                      ? "error.light"
                      : selectedEvent.status === "completed"
                      ? "success.light"
                      : selectedEvent.status === "rescheduled"
                      ? "warning.light"
                      : "info.light",
                  color:
                    selectedEvent.status === "cancelled"
                      ? "error.main"
                      : selectedEvent.status === "completed"
                      ? "success.main"
                      : selectedEvent.status === "rescheduled"
                      ? "warning.main"
                      : "info.main",
                  fontWeight: 600,
                }}
              >
                {selectedEvent.status.toUpperCase()}
              </Typography>
            </Box>

            {/* Action Buttons */}
            {selectedEvent.status !== "cancelled" && (
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  gap: 1,
                  justifyContent: "flex-end",
                  flexWrap: "wrap",
                }}
              >
                {(selectedEvent.status === "upcoming" ||
                  selectedEvent.status === "rescheduled") && (
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleCancelAppointment(selectedEvent.id)}
                  >
                    Cancel
                  </Button>
                )}

                <Button
                  size="small"
                  variant="contained"
                  onClick={handleGoToAppointment}
                >
                  Go to Appointment
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Popover>

      <ConfirmationModal
        open={open}
        message="Are you sure you want to cancel this appointment?"
        confirmText="Yes, Cancel"
        onClose={handleClose}
        loading={loading}
        cancelText="No, don't cancel"
        onConfirm={handleCanceleBooking}
        errMsg={message}
      />
    </>
  );
};

export default Calendar;
