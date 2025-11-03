"use client";

import {
  bookAppointment,
  fetchAvailabilty,
} from "@/app/actions/server-actions";
import { SubmitButton } from "@/app/component/submit-buttton";
import addDurationToTime from "@/app/utils/add-duration-to-time";
import { ActionStateType, AppointmentData } from "@/types";
import {
  Box,
  Button,
  Container,
  Grid2,
  TextField,
  Typography,
  Avatar,
  Stack,
  IconButton,
  useTheme,
  FormControlLabel,
  Checkbox,
  alpha,
  Divider,
} from "@mui/material";
import { format, parse } from "date-fns";
import { motion } from "framer-motion";
import { useActionState, useCallback, useEffect, useState } from "react";
import ScheduleDialogUI from "./sell-date-time";
import { DateTime } from "luxon";
import Edit from "@/app/icons/untitled-ui/duocolor/edit";
import AppointmentSuccessModal from "./apt-confirm";

export interface Availability {
  date: string;
  slots: string[];
}

type DateItem = {
  date: string;
  slots: string[];
};

const initialState: ActionStateType = null;

export default function ContactUs({
  reason,
  adminId,
}: {
  reason: string;
  adminId?: string;
}) {
  const [dates, setDates] = useState<DateItem[]>([]);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendUpdates, setSendUpdates] = useState(false);
  const [nextStartDate, setNextStartDate] = useState<string | undefined>();
  const [fullZoneName, setFullZoneName] = useState<string | null>(null);
  const [offset, setOffset] = useState("");

  const [aptData, setAptData] = useState<AppointmentData>({
    type: "call",
    date: undefined,
    bookedTime: {
      to: undefined,
      from: undefined,
    },
    callReason: reason === "general" ? "general_enquiry" : "mortgage_enquiry",
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

  const handleClose = () => setOpen(false);

  const [openCofirm, setOpennConnfirm] = useState(false);
  const handleOpenConfirm = () => setOpennConnfirm(true);
  const handleCloseConfirm = () => setOpennConnfirm(false);

  const handleLoadMore = useCallback(async () => {
    setLoadingMore(true);
    const result = await fetchAvailabilty("tour", nextStartDate, adminId);

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
  }, [nextStartDate, adminId]);

  const handleContinue = useCallback(async () => {
    if (!sendUpdates) return alert("Kindly check the box to move forward.");
    setLoading(true);

    const result = await fetchAvailabilty("call", undefined, adminId);

    if (result.availability) {
      const dates = result.availability;
      const timeZone = result.timeZone;
      const nextDate = result.nextStartDate;

      const now = DateTime.now().setZone(timeZone);
      setFullZoneName(now.offsetNameLong);
      setOffset(now.toFormat("ZZZZ"));
      setDates(dates);
      setNextStartDate(nextDate);
      setLoading(false);
      setOpen(true);
    }

    if (result.error) {
      setMessage(result.error);
      setLoading(false);
    }

    if (result.message) {
      setMessage(result.message);
      setLoading(false);
    }
  }, [sendUpdates, adminId]);

  const bookAppointmentWithData = bookAppointment.bind(null, adminId, aptData);
  const [state, formAction] = useActionState(
    bookAppointmentWithData,
    initialState
  );

  useEffect(() => {
    if (state) {
      if (state?.error) setMessage(state.error);
      if (state?.message) {
        handleOpenConfirm();
        setDates([]);
      }
    }
  }, [state]);

  const theme = useTheme();
  // theme colors for consistent look
  const primary = theme.palette.primary.main;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Grid2 container spacing={4} alignItems="center">
          <Grid2 size={{ xs: 12, md: 5 }} sx={{ mt: 10 }}>
            <Avatar
              src="/images/agent.jpeg"
              sx={{ width: 200, height: 200, mb: 2 }}
            />
            <Typography variant="h4" fontWeight={600} gutterBottom>
              {`Let's Talk ${
                reason === "mortgage" ? "Mortgage" : "Real Estate"
              }!`}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Call us at <strong>(123) 456-7890</strong> or book a call using
              the form below.
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 7 }} sx={{ mt: 5 }}>
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
                        special offers. I can{" "}
                        <strong>unsubscribe anytime</strong>. My information is
                        private and will not be shared without my consent.
                      </Typography>
                    }
                  />

                  {!aptData.date && !aptData.bookedTime.from && (
                    <Stack direction="row" gap={2} justifyContent="flex-end">
                      <Button
                        variant="contained"
                        disabled={loading}
                        sx={{
                          px: 4,
                          background: primary,
                          color: theme.palette.getContrastText(primary),
                          "&:hover": { background: theme.palette.primary.dark },
                          boxShadow: `0 10px 30px ${alpha(primary, 0.14)}`,
                        }}
                        onClick={handleContinue}
                      >
                        Continue
                      </Button>
                    </Stack>
                  )}

                  <ScheduleDialogUI
                    open={open}
                    onContinue={handleClose}
                    onClose={() => {
                      setAptData({
                        type: "call",
                        date: undefined,
                        bookedTime: {
                          to: undefined,
                          from: undefined,
                        },
                        callReason:
                          reason === "general"
                            ? "general_enquiry"
                            : "mortgage_enquiry",
                      });
                      handleClose();
                    }}
                    dates={dates}
                    message={message}
                    onTimeClicked={handleUpdateTime}
                    onDateClicked={handleUpdateDate}
                    onLoadMore={handleLoadMore}
                    loadingMore={loadingMore}
                    fullZoneName={fullZoneName}
                    offset={offset}
                  />

                  {aptData.date && aptData.bookedTime.from && (
                    <Box
                      sx={{
                        p: 2,
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        mb={1}
                      >
                        <Typography variant="h6" fontWeight={600}>
                          Appointment Details
                        </Typography>
                        <IconButton onClick={handleContinue} color="primary">
                          <Edit />
                        </IconButton>
                      </Stack>

                      <Divider sx={{ mb: 2 }} />

                      <Stack spacing={1}>
                        <Typography variant="body1">
                          <strong>Booked Date:</strong>{" "}
                          {format(new Date(aptData.date), "EEEE, MMMM d, yyyy")}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Booked Time:</strong>{" "}
                          {format(
                            parse(aptData.bookedTime.from, "HH:mm", new Date()),
                            "h:mm a"
                          )}
                        </Typography>
                      </Stack>

                      <Box mt={3}>
                        <SubmitButton title="Book Call" isFullWidth={true} />
                      </Box>
                    </Box>
                  )}
                </Box>
              </motion.div>
            </form>
          </Grid2>
        </Grid2>
      </motion.div>

      <AppointmentSuccessModal
        open={openCofirm}
        onClose={() => {
          setAptData({
            type: "call",
            date: undefined,
            bookedTime: {
              to: undefined,
              from: undefined,
            },
            callReason: "selling",
          });
          setSendUpdates(false);
          handleCloseConfirm();
        }}
        aptData={aptData}
      />
    </Container>
  );
}
