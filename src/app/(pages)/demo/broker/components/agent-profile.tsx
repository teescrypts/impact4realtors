"use client";

import {
  Box,
  Typography,
  Avatar,
  Stack,
  Button,
  Chip,
  Divider,
  Container,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid2,
  TextField,
  alpha,
  useTheme,
} from "@mui/material";
import { AgentType } from "../agents/page";
import { SubmitButton } from "@/app/component/submit-buttton";
import { motion } from "framer-motion";
import {
  fetchAvailabilty,
  bookAppointment,
} from "@/app/actions/server-actions";
import addDurationToTime from "@/app/utils/add-duration-to-time";
import notify from "@/app/utils/toast";
import { ActionStateType, AppointmentData } from "@/types";
import { useEffect, useState, useCallback, useActionState } from "react";
import { DateHeader } from "../../(pages)/components/schedule/date-header";
import { DateCarousel } from "../../(pages)/components/schedule/date-carousel";
import { TimeSlotSelector } from "../../(pages)/components/schedule/time-selector";
import { DateTime } from "luxon";
import { useScheduleState } from "@/app/hooks/use-schedule-state";

export interface Availability {
  date: string;
  slots: string[];
}

type DateItem = {
  date: string;
  slots: string[];
};

const initialState: ActionStateType = null;

export default function AgentProfilePage({
  agent,
  type,
  adminId,
}: {
  agent: AgentType;
  type: "general" | "mortgage";
  adminId?: string;
}) {
  const [dates, setDates] = useState<DateItem[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendUpdates, setSendUpdates] = useState(false);
  const [nextStartDate, setNextStartDate] = useState<string | undefined>();
  const [fullZoneName, setFullZoneName] = useState<string | null>(null);
  const [offset, setOffset] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  // const [timeZone, setTimeZone] = useState("");

  const theme = useTheme();

  const [aptData, setAptData] = useState<AppointmentData>({
    type: "call",
    date: undefined,
    bookedTime: {
      to: undefined,
      from: undefined,
    },
    callReason: type === "general" ? "general_enquiry" : "mortgage_enquiry",
  });

  const handleUpdateDate = (selectedDate: DateItem) => {
    if (selectedDate) {
      setAptData((prev) => {
        return {
          ...prev,
          date: selectedDate.date,
        };
      });
    }
  };

  const handleUpdateTime = (selectedSlot: string) => {
    if (selectedSlot) {
      setAptData((prev) => {
        return {
          ...prev,
          bookedTime: {
            from: selectedSlot,
            to: addDurationToTime(selectedSlot, { hours: 0, minutes: 45 }),
          },
        };
      });
    }
  };

  const {
    selectedDate,
    selectedSlot,
    currentIndex,
    visibleSlots,
    setCurrentIndex,
    handleDateClick,
    handleTimeClick,
    handleShowMore,
  } = useScheduleState(dates, handleUpdateDate, handleUpdateTime);

  const successBg = alpha(theme.palette.success.main, 0.14);
  const errorBg = alpha(theme.palette.error.main, 0.14);
  const highlight =
    theme.palette.mode === "dark"
      ? theme.palette.grey[900]
      : theme.palette.common.white;
  const textOnHighlight = theme.palette.getContrastText(highlight);

  const cardSx = (isSelected: boolean, hasSlots: boolean) => ({
    minWidth: 84,
    cursor: hasSlots ? "pointer" : "not-allowed",
    background: hasSlots ? (isSelected ? successBg : highlight) : errorBg,
    color: isSelected
      ? textOnHighlight
      : theme.palette.getContrastText(successBg),
    transition: "transform 200ms ease, box-shadow 200ms ease",
    borderRadius: 2,
    userSelect: "none",
    px: 1,
    py: 0.6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 84,
  });

  const handleLoadMore = useCallback(async () => {
    setLoadingMore(true);
    const result = await fetchAvailabilty(
      "call",
      nextStartDate,
      adminId,
      agent.owner
    );

    if (result.availability) {
      const dates = result.availability;
      const nextDate = result.nextStartDate;

      setDates((prev) => {
        if (prev) {
          return [...prev, ...dates!];
        } else {
          return [];
        }
      });
      setNextStartDate(nextDate);
      setLoadingMore(false);
    }

    if (result.error) {
      setMessage(result.error);
      setLoadingMore(false);
    }

    if (result.message) {
      setMessage(result.message);
      setLoadingMore(false);
    }
  }, [nextStartDate, adminId, agent.owner]);

  const handleContinue = useCallback(async () => {
    if (!sendUpdates) return alert("Kindly check the box to move forward.");
    setLoading(true);
    const result = await fetchAvailabilty(
      "call",
      undefined,
      adminId,
      agent.owner
    );

    if (result.availability) {
      const dates = result.availability;
      const timeZone = result.timeZone;
      const nextDate = result.nextStartDate;

      const now = DateTime.now().setZone(timeZone);
      setFullZoneName(now.offsetNameLong);
      setOffset(now.toFormat("ZZZZ"));
      // setTimeZone(timeZone!);
      setDates(dates);
      setNextStartDate(nextDate);
      setLoading(false);
    }

    if (result.error) {
      setMessage(result.error);
      setLoading(false);
    }

    if (result.message) {
      setMessage(result.message);
      setLoading(false);
    }
  }, [sendUpdates, adminId, agent.owner]);

  const bookAppointmentWithData = bookAppointment.bind(null, adminId, aptData);
  const [state, formAction] = useActionState(
    bookAppointmentWithData,
    initialState
  );

  useEffect(() => {
    if (state) {
      if (state?.error) setMessage(state.error);
      if (state?.message) {
        notify(state.message);
        setDates([]);
        setSendUpdates(false);
      }
    }
  }, [state]);

  return (
    <Container sx={{ py: 6, mt: 10 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { md: "flex-start" },
          gap: 4,
        }}
      >
        <Avatar
          src={agent.profilePictureUrl}
          alt={`${agent.firstName} ${agent.lastName}`}
          sx={{ width: 120, height: 120, fontSize: 40 }}
        >
          {agent.firstName[0]}
          {agent.lastName[0]}
        </Avatar>

        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {agent.firstName} {agent.lastName}
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            License #: {agent.licenseNumber}
          </Typography>
          <Typography color="text.secondary">
            {agent.email} • {agent.phone}
          </Typography>

          {agent.bio && (
            <Typography sx={{ mt: 2 }} color="text.primary">
              {agent.bio}
            </Typography>
          )}

          <Box mt={3}>
            <Typography variant="subtitle2" gutterBottom>
              Licensed In:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {agent?.licensedStates &&
                agent.licensedStates.map((state, idx) => (
                  <Chip
                    key={idx}
                    label={`${state.state}, ${state.country}`}
                    variant="outlined"
                    size="small"
                  />
                ))}
            </Stack>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              {`Let's Talk ${
                type === "mortgage" ? "Mortgage" : "Real Estate"
              }!`}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Call us at <strong>(123) 456-7890</strong> or book a call using
              the form below.
            </Typography>
          </Box>
        </Box>
      </Box>
      <Grid2>
        <Grid2 size={{ xs: 12, md: 7 }}>
          <form action={formAction}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="First Name"
                  name="firstName"
                  variant="outlined"
                  type="text"
                  required
                  fullWidth
                />

                <input defaultValue={agent.owner} name="agent" hidden />

                <TextField
                  label="Last Name"
                  name="lastName"
                  variant="outlined"
                  type="text"
                  required
                  fullWidth
                />
                <TextField
                  label="Email"
                  type="email"
                  name="email"
                  variant="outlined"
                  required
                  fullWidth
                />
                <TextField
                  label="Phone Number"
                  type="tel"
                  name="phoneNumber"
                  variant="outlined"
                  required
                  fullWidth
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={sendUpdates}
                      onChange={(e) => {
                        setSendUpdates(e.target.checked);
                      }}
                      color="primary"
                      sx={{ mr: 1 }}
                      aria-label="Consent to receive promotional updates"
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I agree to receive{" "}
                      <strong>promotional emails and SMS</strong> about
                      exclusive real estate listings, market updates, and
                      special offers. I can <strong>unsubscribe anytime</strong>
                      . My information is private and will not be shared without
                      my consent.
                    </Typography>
                  }
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleContinue}
                >
                  Continue
                </Button>

                {loading && (
                  <Stack alignItems={"center"}>
                    <CircularProgress />
                    <Typography variant="body2" textAlign={"center"}>
                      Loading Available Dates...
                    </Typography>
                  </Stack>
                )}

                {dates.length > 0 && (
                  <Grid2 container spacing={3} justifyContent="center" mb={4}>
                    <DateHeader
                      dates={dates}
                      currentIndex={currentIndex}
                      fullZoneName={fullZoneName}
                      offset={offset}
                    />

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45 }}
                    >
                      <DateCarousel
                        dates={dates}
                        selectedDate={selectedDate}
                        currentIndex={currentIndex}
                        onDateClick={handleDateClick}
                        setCurrentIndex={setCurrentIndex}
                        cardSx={cardSx}
                        loadingMore={loadingMore}
                        onLoadMore={handleLoadMore}
                      />
                    </motion.div>
                  </Grid2>
                )}

                <Divider sx={{ my: 2 }} />

                {selectedDate && (
                  <TimeSlotSelector
                    selectedDate={selectedDate}
                    selectedSlot={selectedSlot}
                    visibleSlots={visibleSlots}
                    onTimeClick={handleTimeClick}
                    onShowMore={handleShowMore}
                  />
                )}

                {message && (
                  <Typography
                    color="error"
                    textAlign={"center"}
                    variant="subtitle2"
                  >
                    {message}
                  </Typography>
                )}

                <Box display={selectedDate && selectedSlot ? "block" : "none"}>
                  <SubmitButton title="Book Call" isFullWidth={true} />
                </Box>
              </Box>
            </motion.div>
          </form>
        </Grid2>
      </Grid2>
    </Container>
  );
}
