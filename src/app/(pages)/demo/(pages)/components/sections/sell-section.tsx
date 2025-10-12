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
  Paper,
  InputAdornment,
  SvgIcon,
  Divider,
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

export interface Availability {
  date: string;
  slots: string[];
}

type DateItem = {
  date: string;
  slots: string[];
};

const initialState: ActionStateType = null;

const SellSection = ({ adminId }: { adminId?: string }) => {
  const theme = useTheme();
  const [dates, setDates] = useState<DateItem[]>([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [sendUpdates, setSendUpdates] = useState(false);
  const [aptData, setAptData] = useState<AppointmentData>({
    type: "call",
    date: undefined,
    bookedTime: {
      to: undefined,
      from: undefined,
    },
    callReason: "selling",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  const handleContinue = useCallback(async () => {
    if (!sendUpdates) return alert("Kindly check the box to move forward.");
    setIsLoading(true);

    const result = await fetchAvailabilty("tour", adminId);

    if (result.availability) {
      setDates(result.availability);
      handleOpen();
      setIsLoading(false);
    }

    if (result.error) {
      setMessage(result.error);
      setIsLoading(false);
    }

    if (result.message) {
      setMessage(result.message);
      setIsLoading(false);
    }
  }, [sendUpdates, adminId]);

  const bookAppointmentWithData = bookAppointment.bind(null, adminId, aptData);
  const [state, formAction] = useActionState(
    bookAppointmentWithData,
    initialState
  );

  const [openCofirm, setOpennConnfirm] = useState(false);
  const handleOpenConfirm = () => setOpennConnfirm(true);
  const handleCloseConfirm = () => setOpennConnfirm(false);

  useEffect(() => {
    if (state) {
      if (state?.error) setMessage(state.error);
      if (state?.message) {
        handleOpenConfirm();
        setDates([]);
      }
    }
  }, [state]);

  // theme colors for consistent look
  const primary = theme.palette.primary.main;
  const accent = theme.palette.secondary.main;
  const cardBg = alpha(theme.palette.background.paper, 0.06);

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        color: theme.palette.getContrastText(theme.palette.background.default),
        py: { xs: 6, md: 10 },
        px: 2,
        background: theme.palette.background.default,
      }}
    >
      {/* Decorative cursive SVG strokes — positioned behind content */}
      <Box
        sx={{
          position: "absolute",
          top: -20,
          left: -40,
          zIndex: 0,
          pointerEvents: "none",
          width: { xs: 260, md: 420 },
          opacity: 0.12,
        }}
        aria-hidden
      >
        <svg
          viewBox="0 0 600 200"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* soft, flowing brush stroke */}
          <path
            d="M10 120 C120 10, 300 10, 420 120 C500 200, 600 110, 580 90"
            stroke={primary}
            strokeWidth="28"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            strokeOpacity="0.9"
          />
        </svg>
      </Box>

      <Box
        sx={{
          position: "absolute",
          bottom: -30,
          right: -60,
          zIndex: 0,
          pointerEvents: "none",
          width: { xs: 220, md: 420 },
          opacity: 0.09,
          transform: "rotate(-12deg)",
        }}
        aria-hidden
      >
        <svg
          viewBox="0 0 600 200"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d="M10 60 C140 150, 300 170, 520 40"
            stroke={accent}
            strokeWidth="20"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            strokeOpacity="0.95"
          />
        </svg>
      </Box>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <form action={formAction}>
          <Grid2 container spacing={4} alignItems="center">
            {/* Left: Agent */}
            <Grid2 size={{ xs: 12, sm: 5 }}>
              <Box textAlign="center" mb={2}>
                <Avatar
                  src="/images/agent.jpeg"
                  alt="Andrea - Real Estate Agent"
                  sx={{
                    width: { xs: 140, sm: 180, md: 200 },
                    height: { xs: 140, sm: 180, md: 200 },
                    mx: "auto",
                    mb: 2,
                    boxShadow: `0 12px 30px ${alpha(primary, 0.14)}`,
                    border: `4px solid ${alpha(
                      theme.palette.common.white,
                      0.06
                    )}`,
                  }}
                />

                {/* subtle cursive name accent */}
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "'Brush Script MT', 'Pacifico', cursive",
                    color: primary,
                    fontSize: { xs: 20, sm: 22, md: 26 },
                    mb: 0.5,
                  }}
                >
                  Alex — Your Local Agent
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight="700"
                  gutterBottom
                  sx={{ color: theme.palette.text.primary, mt: 0.5 }}
                >
                  Hey there — I’m Alex!
                </Typography>

                <Typography
                  variant="body1"
                  maxWidth={600}
                  mx="auto"
                  mb={2}
                  sx={{ color: alpha(theme.palette.text.primary, 0.9) }}
                >
                  Thinking about selling your home? I’m here to make the process
                  smooth and stress-free. Whether you have questions about
                  pricing, market trends, or the next steps, I’ve got you
                  covered!
                </Typography>

                <Typography
                  variant="body2"
                  maxWidth={600}
                  mx="auto"
                  sx={{ color: alpha(theme.palette.text.primary, 0.78) }}
                >
                  Schedule a free, no-obligation call today, or call{" "}
                  <Link href="tel:+17036343963" color="inherit">
                    (123) 456-7890
                  </Link>
                  . Let’s get your home sold for top dollar — hassle-free!
                </Typography>
              </Box>
            </Grid2>

            {/* Right: Form in glass card */}
            <Grid2 size={{ xs: 12, sm: 7 }}>
              <Paper
                elevation={6}
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: 3,
                  background: cardBg,
                  backdropFilter: "blur(6px) saturate(120%)",
                  border: `1px solid ${alpha(
                    theme.palette.common.white,
                    0.04
                  )}`,
                }}
              >
                <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
                  Schedule a call
                </Typography>

                <Grid2 container spacing={2} mb={2}>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      label="First Name"
                      name="firstName"
                      type="text"
                      required
                      autoComplete="given-name"
                    />
                  </Grid2>

                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      type="text"
                      required
                      autoComplete="family-name"
                    />
                  </Grid2>

                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                    />
                  </Grid2>

                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      label="Phone Number"
                      name="phoneNumber"
                      required
                      autoComplete="tel"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <SvgIcon
                                sx={{
                                  color: alpha(theme.palette.text.primary, 0.6),
                                }}
                              >
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
                      variant="outlined"
                      fullWidth
                      label="Property Type"
                      name="propertyTypeToSell"
                      required
                      placeholder="e.g., 3-bed house, condo, commercial"
                    />
                  </Grid2>

                  <Grid2 size={{ xs: 12 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={sendUpdates}
                          onChange={(e) => setSendUpdates(e.target.checked)}
                          color="primary"
                          aria-label="Consent to receive promotional updates"
                        />
                      }
                      label={
                        <Typography
                          variant="body2"
                          sx={{
                            color: alpha(theme.palette.text.primary, 0.82),
                          }}
                        >
                          I agree to receive{" "}
                          <strong>promotional emails and SMS</strong> about
                          exclusive real estate listings, market updates, and
                          special offers. I can{" "}
                          <strong>unsubscribe anytime</strong>.
                        </Typography>
                      }
                      sx={{ alignItems: "flex-start" }}
                    />
                  </Grid2>
                </Grid2>

                {message && (
                  <Typography
                    variant="subtitle2"
                    color="error"
                    textAlign={"center"}
                  >
                    {message}
                  </Typography>
                )}

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

                {!aptData.date && !aptData.bookedTime.from && (
                  <Stack direction="row" gap={2} justifyContent="flex-end">
                    <Button
                      variant="contained"
                      disabled={isLoading}
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
              </Paper>
            </Grid2>
          </Grid2>

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
                callReason: "selling",
              });
              handleClose();
            }}
            dates={dates}
            message={message}
            onTimeClicked={handleUpdateTime}
            onDateClicked={handleUpdateDate}
          />
        </form>

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
            handleCloseConfirm();
          }}
          aptData={aptData}
        />
      </Container>
    </Box>
  );
};

export default SellSection;
