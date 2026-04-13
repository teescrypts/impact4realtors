"use client";

import {
  bookAppointment,
  fetchAvailabilty,
} from "@/app/actions/server-actions";
import { SubmitButton } from "@/app/component/submit-buttton";
import addDurationToTime from "@/app/utils/add-duration-to-time";
import { ActionStateType, AppointmentData } from "@/types";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Grid2,
  IconButton,
  Stack,
  TextField,
  Typography,
  alpha,
  useTheme,
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

// Visual-only step labels — derive active step from existing state
const STEPS = ["Your info", "Pick a time", "Confirm"];

export default function ContactUs({
  reason,
  adminId,
}: {
  reason: string;
  adminId?: string;
}) {
  // ── STATE: identical to original ────────────────────────────────────────────
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

  // ── HANDLERS: identical to original ─────────────────────────────────────────
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
    initialState,
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

  // ── THEME TOKENS — no hardcoded colours ─────────────────────────────────────
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primaryDark = theme.palette.primary.dark;
  const primaryContrast = theme.palette.getContrastText(primary);

  // Subtle surfaces derived from the theme's own text colour (works in both modes)
  const surfaceBg = alpha(theme.palette.text.primary, 0.03);
  const borderColor = alpha(theme.palette.text.primary, 0.1);

  // Derive which visual step we are on from existing state — no new state added
  const visualStep = aptData.date && aptData.bookedTime.from ? 2 : open ? 1 : 0;

  // ── SHARED SX SHORTCUTS ─────────────────────────────────────────────────────
  const cardSx = {
    p: 2.5,
    borderRadius: 3,
    bgcolor: surfaceBg,
    border: `1px solid ${borderColor}`,
  } as const;

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      "& fieldset": { borderColor },
      "&:hover fieldset": {
        borderColor: alpha(theme.palette.text.primary, 0.25),
      },
    },
  } as const;

  const primaryBtnSx = {
    px: 4,
    borderRadius: 2,
    textTransform: "none",
    fontWeight: 500,
    fontSize: 14,
    background: primary,
    color: primaryContrast,
    boxShadow: `0 6px 20px ${alpha(primary, 0.28)}`,
    "&:hover": {
      background: primaryDark,
      boxShadow: `0 8px 24px ${alpha(primary, 0.35)}`,
    },
  } as const;

  // ── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <Grid2 container spacing={{ xs: 4, md: 6 }} alignItems="flex-start">
          {/* ── Left: Agent panel ─────────────────────────────────────────── */}
          <Grid2
            size={{ xs: 12, md: 5 }}
            sx={{
              position: { md: "sticky" },
              top: { md: 40 },
              mt: { xs: 0, md: 10 },
            }}
          >
            <Avatar
              src="/images/agent.jpeg"
              sx={{
                width: 84,
                height: 84,
                mb: 2.5,
                border: `3px solid ${alpha(primary, 0.2)}`,
                boxShadow: `0 0 0 6px ${alpha(primary, 0.07)}`,
              }}
            />

            <Typography
              variant="h4"
              fontWeight={600}
              gutterBottom
              sx={{ lineHeight: 1.25 }}
            >
              {`Let's Talk ${reason === "mortgage" ? "Mortgage" : "Real Estate"}!`}
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              gutterBottom
              sx={{ lineHeight: 1.7 }}
            >
              Call us at <strong>(123) 456-7890</strong> or book a call using
              the form below.
            </Typography>

            <Divider sx={{ my: 2.5, borderColor }} />

            <Stack spacing={1.5}>
              {[
                "45-minute video or phone call",
                "Available Monday – Saturday",
                "Remote or in-person",
              ].map((label) => (
                <Stack
                  key={label}
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                >
                  <Box
                    sx={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      bgcolor: primary,
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {label}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Grid2>

          {/* ── Right: Form ───────────────────────────────────────────────── */}
          <Grid2 size={{ xs: 12, md: 7 }} sx={{ mt: { xs: 0, md: 5 } }}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.12, ease: "easeOut" }}
            >
              {/* Visual step indicator — read-only, derived from existing state */}
              <Stack direction="row" alignItems="center" sx={{ mb: 4 }}>
                {STEPS.map((label, i) => (
                  <Box
                    key={label}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flex: i < STEPS.length - 1 ? 1 : "none",
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Box
                        sx={{
                          width: 26,
                          height: 26,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          fontSize: 11,
                          fontWeight: 700,
                          transition: "all 0.35s ease",
                          ...(i < visualStep && {
                            bgcolor: alpha(primary, 0.12),
                            color: primary,
                          }),
                          ...(i === visualStep && {
                            bgcolor: primary,
                            color: primaryContrast,
                            boxShadow: `0 4px 14px ${alpha(primary, 0.4)}`,
                          }),
                          ...(i > visualStep && {
                            bgcolor: surfaceBg,
                            border: `1px solid ${borderColor}`,
                            color: "text.disabled",
                          }),
                        }}
                      >
                        {i < visualStep ? "✓" : i + 1}
                      </Box>

                      <Typography
                        sx={{
                          fontSize: 12,
                          fontWeight: i === visualStep ? 600 : 400,
                          color:
                            i === visualStep
                              ? "text.primary"
                              : i < visualStep
                                ? "text.secondary"
                                : "text.disabled",
                          transition: "color 0.3s ease",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {label}
                      </Typography>
                    </Stack>

                    {i < STEPS.length - 1 && (
                      <Box
                        sx={{
                          flex: 1,
                          height: "1px",
                          mx: 1.5,
                          bgcolor:
                            i < visualStep ? alpha(primary, 0.3) : borderColor,
                          transition: "background-color 0.35s ease",
                        }}
                      />
                    )}
                  </Box>
                ))}
              </Stack>

              {/* ── Form — original action + all original fields ────────── */}
              <form action={formAction}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                      label="First Name"
                      name="firstName"
                      variant="outlined"
                      type="text"
                      required
                      fullWidth
                      sx={fieldSx}
                    />
                    <TextField
                      label="Last Name"
                      name="lastName"
                      variant="outlined"
                      type="text"
                      required
                      fullWidth
                      sx={fieldSx}
                    />
                  </Stack>

                  <TextField
                    label="Email"
                    type="email"
                    name="email"
                    variant="outlined"
                    required
                    fullWidth
                    sx={fieldSx}
                  />

                  <TextField
                    label="Phone Number"
                    type="tel"
                    name="phoneNumber"
                    variant="outlined"
                    required
                    fullWidth
                    sx={fieldSx}
                  />

                  {/* Consent checkbox — original logic, upgraded container */}
                  <Box sx={cardSx}>
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
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ lineHeight: 1.65 }}
                        >
                          I agree to receive{" "}
                          <strong>promotional emails and SMS</strong> about
                          exclusive real estate listings, market updates, and
                          special offers. I can{" "}
                          <strong>unsubscribe anytime</strong>. My information
                          is private and will not be shared without my consent.
                        </Typography>
                      }
                      sx={{ alignItems: "flex-start", m: 0 }}
                    />
                  </Box>

                  {/* Error message */}
                  {message && (
                    <Typography variant="body2" color="error.main">
                      {message}
                    </Typography>
                  )}

                  {/* Continue button — original condition */}
                  {!aptData.date && !aptData.bookedTime.from && (
                    <Stack direction="row" justifyContent="flex-end">
                      <Button
                        variant="contained"
                        disabled={loading}
                        sx={primaryBtnSx}
                        onClick={handleContinue}
                      >
                        {loading ? "Loading…" : "Continue"}
                      </Button>
                    </Stack>
                  )}

                  {/* Schedule dialog — original component, all original props */}
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

                  {/* Appointment details card — original condition */}
                  {aptData.date && aptData.bookedTime.from && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <Box sx={cardSx}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          mb={1.5}
                        >
                          <Typography
                            variant="overline"
                            sx={{
                              letterSpacing: "0.1em",
                              color: "text.secondary",
                              lineHeight: 1,
                            }}
                          >
                            Appointment Details
                          </Typography>
                          <IconButton
                            onClick={handleContinue}
                            color="primary"
                            size="small"
                            sx={{
                              bgcolor: alpha(primary, 0.08),
                              "&:hover": { bgcolor: alpha(primary, 0.16) },
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Stack>

                        <Divider sx={{ mb: 2, borderColor }} />

                        <Stack spacing={1.5}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography variant="body2" color="text.secondary">
                              Booked Date
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {format(
                                new Date(aptData.date),
                                "EEEE, MMMM d, yyyy",
                              )}
                            </Typography>
                          </Stack>

                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography variant="body2" color="text.secondary">
                              Booked Time
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {format(
                                parse(
                                  aptData.bookedTime.from,
                                  "HH:mm",
                                  new Date(),
                                ),
                                "h:mm a",
                              )}
                            </Typography>
                          </Stack>
                        </Stack>

                        <Divider sx={{ my: 2, borderColor }} />

                        <SubmitButton title="Book Call" isFullWidth={true} />
                      </Box>
                    </motion.div>
                  )}
                </Box>
              </form>
            </motion.div>
          </Grid2>
        </Grid2>
      </motion.div>

      {/* Success modal — original component, original props, original onClose */}
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
