"use client";

import React, { useActionState, useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  Grid2,
  IconButton,
  Stack,
  Avatar,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  SvgIcon,
  Divider,
  Chip,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { format, parse } from "date-fns";
import Link from "next/link";
import { ActionStateType, AppointmentData } from "@/types";
import {
  fetchAvailabilty,
  bookAppointment,
} from "@/app/actions/server-actions";
import addDurationToTime from "@/app/utils/add-duration-to-time";
import { SubmitButton } from "@/app/component/submit-buttton";
import Edit from "@/app/icons/untitled-ui/duocolor/edit";
import ScheduleDialogUI from "../sell-date-time";
import Call from "@/app/icons/untitled-ui/duocolor/call";
import AppointmentSuccessModal from "../apt-confirm";
import { DateTime } from "luxon";

export interface Availability {
  date: string;
  slots: string[];
}

type DateItem = {
  date: string;
  slots: string[];
};

const initialState: ActionStateType = null;

// Trust signals shown beneath the agent photo
const trustSignals = [
  { value: "200+", label: "Homes Sold" },
  { value: "4.9★", label: "Rating" },
  { value: "15 yrs", label: "Experience" },
];

const SellSection = ({ adminId }: { adminId?: string }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [dates, setDates] = useState<DateItem[]>([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [sendUpdates, setSendUpdates] = useState(false);
  const [nextStartDate, setNextStartDate] = useState<string | undefined>();
  const [fullZoneName, setFullZoneName] = useState<string | null>(null);
  const [offset, setOffset] = useState("");
  const [aptData, setAptData] = useState<AppointmentData>({
    type: "call",
    date: undefined,
    bookedTime: { to: undefined, from: undefined },
    callReason: "selling",
  });

  const handleClose = () => setOpen(false);

  const handleUpdateDate = (selectedDate: DateItem) => {
    if (selectedDate)
      setAptData((prev) => ({ ...prev, date: selectedDate.date }));
  };

  const handleUpdateTime = (selectedSlot: string) => {
    if (selectedSlot)
      setAptData((prev) => ({
        ...prev,
        bookedTime: {
          from: selectedSlot,
          to: addDurationToTime(selectedSlot, { hours: 0, minutes: 45 }),
        },
      }));
  };

  const [loadingMore, setLoadingMore] = useState(false);

  const handleLoadMore = useCallback(async () => {
    setLoadingMore(true);
    const result = await fetchAvailabilty("tour", nextStartDate, adminId);
    if (result.availability) {
      setDates((prev) => [...prev, ...result.availability!]);
      setNextStartDate(result.nextStartDate);
    }
    if (result.error) setMessage(result.error);
    if (result.message) setMessage(result.message);
    setLoadingMore(false);
  }, [nextStartDate, adminId]);

  const handleContinue = useCallback(async () => {
    if (!sendUpdates) return alert("Kindly check the box to move forward.");
    setIsLoading(true);
    const result = await fetchAvailabilty("tour", undefined, adminId);
    if (result.availability) {
      const now = DateTime.now().setZone(result.timeZone);
      setFullZoneName(now.offsetNameLong);
      setOffset(now.toFormat("ZZZZ"));
      setDates(result.availability);
      setNextStartDate(result.nextStartDate);
      setOpen(true);
    }
    if (result.error) setMessage(result.error);
    if (result.message) setMessage(result.message);
    setIsLoading(false);
  }, [sendUpdates, adminId]);

  const bookAppointmentWithData = bookAppointment.bind(null, adminId, aptData);
  const [state, formAction] = useActionState(bookAppointmentWithData, initialState);

  const [openConfirm, setOpenConfirm] = useState(false);

  const resetAptData = () =>
    setAptData({
      type: "call",
      date: undefined,
      bookedTime: { to: undefined, from: undefined },
      callReason: "selling",
    });

  useEffect(() => {
    if (state?.error) setMessage(state.error);
    if (state?.message) {
      setOpenConfirm(true);
      setDates([]);
    }
  }, [state]);

  const primary = theme.palette.primary.main;
  const primaryLight = alpha(primary, 0.08);
  const primaryMid = alpha(primary, 0.15);

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        py: { xs: 8, md: 12 },
        bgcolor: isDark ? "grey.950" : "grey.50",
      }}
    >
      {/* Subtle background geometry */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {/* Large soft circle top-right */}
        <Box
          sx={{
            position: "absolute",
            top: "-15%",
            right: "-10%",
            width: { xs: 320, md: 560 },
            height: { xs: 320, md: 560 },
            borderRadius: "50%",
            background: `radial-gradient(circle, ${alpha(primary, 0.1)} 0%, transparent 70%)`,
          }}
        />
        {/* Smaller circle bottom-left */}
        <Box
          sx={{
            position: "absolute",
            bottom: "-10%",
            left: "-6%",
            width: { xs: 200, md: 380 },
            height: { xs: 200, md: 380 },
            borderRadius: "50%",
            background: `radial-gradient(circle, ${alpha(primary, 0.07)} 0%, transparent 70%)`,
          }}
        />
        {/* Thin horizontal rule accent */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${alpha(primary, 0.12)}, transparent)`,
          }}
        />
      </Box>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <form action={formAction}>
          <Grid2 container spacing={{ xs: 6, md: 8 }} alignItems="stretch">

            {/* ── LEFT COLUMN ── */}
            <Grid2 size={{ xs: 12, md: 5 }}>
              <Stack spacing={4} height="100%" justifyContent="center">

                {/* Badge */}
                <Box>
                  <Chip
                    label="Free Consultation · No Commitment"
                    size="small"
                    sx={{
                      bgcolor: primaryLight,
                      color: "primary.main",
                      fontWeight: 700,
                      fontSize: "0.72rem",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      border: `1px solid ${primaryMid}`,
                      borderRadius: 1,
                      height: 26,
                    }}
                  />
                </Box>

                {/* Heading */}
                <Box>
                  <Typography
                    variant="h2"
                    fontWeight={800}
                    lineHeight={1.1}
                    letterSpacing="-0.03em"
                    sx={{
                      fontSize: { xs: "2rem", sm: "2.5rem", md: "2.9rem" },
                      color: "text.primary",
                      mb: 2,
                    }}
                  >
                    Sell your home
                    <Box component="span" sx={{ color: "primary.main" }}>
                      {" "}with confidence.
                    </Box>
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    lineHeight={1.75}
                    sx={{ maxWidth: 400 }}
                  >
                    Get a free, no-pressure strategy session. We&apos;ll walk you through pricing,
                    market conditions, and what it takes to get top dollar — on your timeline.
                  </Typography>
                </Box>

                {/* Agent card */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2.5,
                    p: 2.5,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: isDark ? alpha("#fff", 0.08) : alpha("#000", 0.07),
                    bgcolor: isDark ? alpha("#fff", 0.03) : "white",
                    backdropFilter: "blur(6px)",
                    boxShadow: isDark
                      ? "none"
                      : `0 2px 20px ${alpha("#000", 0.06)}`,
                  }}
                >
                  <Avatar
                    src="/images/agent.jpeg"
                    alt="Alex – Real Estate Agent"
                    sx={{
                      width: 64,
                      height: 64,
                      flexShrink: 0,
                      border: `3px solid ${alpha(primary, 0.25)}`,
                      boxShadow: `0 0 0 1px ${alpha(primary, 0.12)}`,
                    }}
                  />
                  <Box flex={1} minWidth={0}>
                    <Typography fontWeight={700} lineHeight={1.2} noWrap>
                      Alex Johnson
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" mb={0.75}>
                      Licensed Real Estate Agent · Metro Area
                    </Typography>
                    <Link
                      href="tel:+11234567890"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: primary,
                        textDecoration: "none",
                      }}
                    >
                      <SvgIcon sx={{ fontSize: 14 }}><Call /></SvgIcon>
                      (123) 456-7890
                    </Link>
                  </Box>
                </Box>

                {/* Trust stats */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 1,
                  }}
                >
                  {trustSignals.map(({ value, label }) => (
                    <Box
                      key={label}
                      sx={{
                        textAlign: "center",
                        py: 2,
                        px: 1,
                        borderRadius: 2.5,
                        border: "1px solid",
                        borderColor: isDark ? alpha("#fff", 0.07) : alpha("#000", 0.06),
                        bgcolor: isDark ? alpha("#fff", 0.02) : "white",
                      }}
                    >
                      <Typography
                        fontWeight={800}
                        sx={{ fontSize: "1.25rem", color: "primary.main", lineHeight: 1 }}
                      >
                        {value}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" lineHeight={1.3} display="block" mt={0.5}>
                        {label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Stack>
            </Grid2>

            {/* ── RIGHT COLUMN: Form ── */}
            <Grid2 size={{ xs: 12, md: 7 }}>
              <Box
                sx={{
                  p: { xs: 3, sm: 4 },
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: isDark ? alpha("#fff", 0.08) : alpha("#000", 0.07),
                  bgcolor: isDark ? alpha("#fff", 0.03) : "white",
                  backdropFilter: "blur(8px)",
                  boxShadow: isDark
                    ? `0 0 0 1px ${alpha(primary, 0.08)}`
                    : `0 4px 32px ${alpha("#000", 0.08)}`,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                }}
              >
                {/* Form header */}
                <Box>
                  <Typography
                    variant="h5"
                    fontWeight={800}
                    letterSpacing="-0.02em"
                    gutterBottom
                  >
                    Schedule your free call
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    45-minute session · We&apos;ll contact you to confirm.
                  </Typography>
                </Box>

                <Divider />

                {/* Fields */}
                <Grid2 container spacing={2}>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      type="text"
                      required
                      autoComplete="given-name"
                      size="small"
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      type="text"
                      required
                      autoComplete="family-name"
                      size="small"
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      size="small"
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phoneNumber"
                      required
                      autoComplete="tel"
                      size="small"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <SvgIcon sx={{ fontSize: 18, color: "text.disabled" }}>
                                <Call />
                              </SvgIcon>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Property Type"
                      name="propertyTypeToSell"
                      required
                      placeholder="e.g., 3-bed house, condo, commercial"
                      size="small"
                    />
                  </Grid2>
                </Grid2>

                {/* Consent */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={sendUpdates}
                      onChange={(e) => setSendUpdates(e.target.checked)}
                      color="primary"
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="caption" color="text.secondary" lineHeight={1.5}>
                      I agree to receive <strong>promotional emails and SMS</strong> about listings,
                      market updates, and offers. I can <strong>unsubscribe anytime</strong>.
                    </Typography>
                  }
                  sx={{ alignItems: "flex-start", mt: -1 }}
                />

                {/* Error message */}
                {message && (
                  <Box
                    sx={{
                      px: 2,
                      py: 1.25,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.error.main, 0.08),
                      border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                    }}
                  >
                    <Typography variant="body2" color="error" fontWeight={500}>
                      {message}
                    </Typography>
                  </Box>
                )}

                {/* Appointment confirmed state */}
                {aptData.date && aptData.bookedTime.from && (
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 2.5,
                      border: `1px solid ${alpha(primary, 0.2)}`,
                      bgcolor: primaryLight,
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      mb={1.5}
                    >
                      <Typography variant="subtitle2" fontWeight={700} color="primary.main">
                        Appointment Selected
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={handleContinue}
                        color="primary"
                        sx={{ bgcolor: primaryMid, borderRadius: 1.5 }}
                      >
                        <Edit />
                      </IconButton>
                    </Stack>

                    <Stack spacing={0.75}>
                      <Stack direction="row" gap={1}>
                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                          Date
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {format(new Date(aptData.date), "EEEE, MMMM d, yyyy")}
                        </Typography>
                      </Stack>
                      <Stack direction="row" gap={1}>
                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                          Time
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {format(parse(aptData.bookedTime.from, "HH:mm", new Date()), "h:mm a")}
                          {" – "}
                          {format(parse(aptData.bookedTime.to!, "HH:mm", new Date()), "h:mm a")}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Box mt={2.5}>
                      <SubmitButton title="Confirm Booking" isFullWidth />
                    </Box>
                  </Box>
                )}

                {/* CTA */}
                {!aptData.date && !aptData.bookedTime.from && (
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={isLoading}
                    onClick={handleContinue}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      letterSpacing: "0.01em",
                      boxShadow: `0 6px 20px ${alpha(primary, 0.28)}`,
                      "&:hover": {
                        boxShadow: `0 8px 28px ${alpha(primary, 0.36)}`,
                      },
                      transition: "box-shadow 0.2s ease",
                    }}
                  >
                    {isLoading ? "Finding availability…" : "Choose a Date & Time →"}
                  </Button>
                )}

                {/* Privacy note */}
                <Typography variant="caption" color="text.disabled" textAlign="center">
                  🔒 Your information is private and never shared.
                </Typography>
              </Box>
            </Grid2>
          </Grid2>
        </form>
      </Container>

      {/* Dialogs */}
      <ScheduleDialogUI
        open={open}
        onContinue={handleClose}
        onClose={() => { resetAptData(); handleClose(); }}
        dates={dates}
        message={message}
        onTimeClicked={handleUpdateTime}
        onDateClicked={handleUpdateDate}
        onLoadMore={handleLoadMore}
        loadingMore={loadingMore}
        fullZoneName={fullZoneName}
        offset={offset}
      />

      <AppointmentSuccessModal
        open={openConfirm}
        onClose={() => { resetAptData(); setOpenConfirm(false); }}
        aptData={aptData}
      />
    </Box>
  );
};

export default SellSection;
