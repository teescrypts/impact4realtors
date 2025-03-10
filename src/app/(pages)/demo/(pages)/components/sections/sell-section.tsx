"use client";

import React, {
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  Chip,
  TextField,
  Grid2,
  IconButton,
  CircularProgress,
  Stack,
  Avatar,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { format, parseISO } from "date-fns";
import { Scrollbar } from "@/app/component/scrollbar";
import ChevronLeft from "@/app/icons/untitled-ui/duocolor/chevron-left";
import ChevronRight from "@/app/icons/untitled-ui/duocolor/chevron-right";
import { convertTo12HourFormat } from "@/app/utils/convert-to-12hrs-format";
import SimpleBarCore from "simplebar-core";
import Link from "next/link";
import { ActionStateType, AppointmentData } from "@/types";
import {
  fetchAvailabilty,
  bookAppointment,
} from "@/app/actions/server-actions";
import addDurationToTime from "@/app/utils/add-duration-to-time";
import { SubmitButton } from "@/app/component/submit-buttton";
import notify from "@/app/utils/toast";

const textFieldStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "white",
    },
    "&:hover fieldset": {
      borderColor: "#ccc",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#f0f0f0",
    },
  },
  "& label": { color: "white" },
  "& label.Mui-focused": { color: "white" },
  "& input": { color: "white" },
};

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
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isProgrammaticScroll, setIsProgrammaticScroll] =
    useState<boolean>(false);
  const [dates, setDates] = useState<DateItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<DateItem | null>(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [sendUpdates, setSendUpdates] = useState(false);

  const scrollbarRef = useRef<SimpleBarCore | null>(null);

  const handleDateClick = (date: DateItem) => {
    if (date.slots.length > 0) {
      setSelectedDate(date);
    }
  };

  const handleScrollLeft = () => {
    if (currentIndex > 0) {
      setIsProgrammaticScroll(true);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleScrollRight = () => {
    if (currentIndex < dates.length - 1) {
      setIsProgrammaticScroll(true);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  useEffect(() => {
    // Programmatically scroll to the correct position when currentIndex changes
    if (scrollbarRef.current && isProgrammaticScroll) {
      const scrollbarElement = scrollbarRef.current.getScrollElement();

      if (scrollbarElement) {
        const itemWidth = scrollbarElement.scrollWidth / dates.length;
        scrollbarElement.scrollTo({
          left: currentIndex * itemWidth,
          behavior: "smooth",
        });
      }

      // Reset the flag after the programmatic scroll
      const timer = setTimeout(() => setIsProgrammaticScroll(false), 300); // Allow smooth scroll to complete
      return () => clearTimeout(timer);
    }
  }, [currentIndex, dates.length, isProgrammaticScroll]);

  useEffect(() => {
    // Update currentIndex based on manual scrolling/swiping
    const handleScroll = () => {
      if (isProgrammaticScroll) return; // Skip manual scroll updates during programmatic scroll

      if (scrollbarRef.current) {
        const scrollbarElement = scrollbarRef.current.getScrollElement();

        let newIndex;
        if (scrollbarElement) {
          const itemWidth = scrollbarElement.scrollWidth / dates.length;
          newIndex = Math.round(scrollbarElement.scrollLeft / itemWidth);
        }

        if (newIndex && newIndex !== currentIndex) {
          setCurrentIndex(newIndex);
        }
      }
    };

    const scrollbarElement = scrollbarRef.current?.getScrollElement();
    scrollbarElement?.addEventListener("scroll", handleScroll);

    return () => {
      scrollbarElement?.removeEventListener("scroll", handleScroll);
    };
  }, [currentIndex, dates.length, isProgrammaticScroll]);

  const [visibleSlots, setVisibleSlots] = useState(10);

  const handleShowMore = () => {
    setVisibleSlots((prev) => prev + 10);
  };

  const [aptData, setAptData] = useState<AppointmentData>({
    type: "call",
    date: undefined,
    bookedTime: {
      to: undefined,
      from: undefined,
    },
    callReason: "selling",
  });

  useEffect(() => {
    if (selectedDate) {
      setAptData((prev) => {
        return {
          ...prev,
          date: selectedDate?.date,
        };
      });
    }

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
  }, [selectedDate, selectedSlot]);

  const handleContinue = useCallback(async () => {
    if (!sendUpdates) return alert("Kindly check the box to move forward.");
    setIsLoading(true);
    const result = await fetchAvailabilty("tour", adminId);
    if (result.availability) setDates(result.availability);
    if (result.error) setMessage(result.error);
    if (result.message) setMessage(result.message);
    setIsLoading(false);
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
        notify(state.message);
        setDates([]);
        setSelectedSlot("");
        setSelectedDate(null);
      }
    }
  }, [state]);

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.alpha50})`,
        color: "white",
        py: 6,
      }}
    >
      <form action={formAction}>
        <Container maxWidth="md">
          <Box textAlign="center" mb={4}>
            <Avatar
              src="/images/agent.jpeg"
              alt="Andrea - Real Estate Agent"
              sx={{ width: 200, height: 200, mx: "auto", mb: 2 }}
            />

            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Hey there, I’m Andrea!
            </Typography>

            <Typography variant="subtitle1" maxWidth={600} mx="auto" mb={2}>
              Thinking about selling your home? I’m here to make the process
              smooth and stress-free. Whether you have questions about pricing,
              market trends, or the next steps, I’ve got you covered!
            </Typography>

            <Typography variant="subtitle1" maxWidth={600} mx={"auto"}>
              Schedule a free, no-obligation call today, or give me a call at{" "}
              <Link href="tel:+17036343963" color="inherit">
                (123) 456-7890
              </Link>
              . Let’s get your home sold for the best price, hassle-free!
            </Typography>
          </Box>

          <div>
            <Grid2 container spacing={3} mb={4}>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="First Name"
                  name="firstName"
                  type="text"
                  required
                  sx={textFieldStyle}
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
                  sx={textFieldStyle}
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
                  sx={textFieldStyle}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  required
                  sx={textFieldStyle}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 12 }}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Property Type"
                  name="propertyTypeToSell"
                  required
                  sx={textFieldStyle}
                />
              </Grid2>

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
                  <Typography variant="body2" color="white">
                    I agree to receive{" "}
                    <strong>promotional emails and SMS</strong> about exclusive
                    real estate listings, market updates, and special offers. I
                    can <strong>unsubscribe anytime</strong>. My information is
                    private and will not be shared without my consent.
                  </Typography>
                }
              />
            </Grid2>

            <Stack>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={handleContinue}
              >
                Continue
              </Button>
            </Stack>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  minHeight={100}
                >
                  <CircularProgress color="secondary" />
                </Box>
              </motion.div>
            )}

            {dates.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Grid2 container spacing={3} justifyContent="center" mb={4}>
                  <Box sx={{ p: 2 }}>
                    {dates[currentIndex] && (
                      <div>
                        <Typography variant="h3" align="center" sx={{ my: 2 }}>
                          Select Date
                        </Typography>
                        <Typography variant="h5" align="center">
                          {`${format(
                            parseISO(dates[currentIndex].date),
                            "MMMM yyyy"
                          )}`}
                        </Typography>
                      </div>
                    )}
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      overflow: "hidden",
                      mb: 2,
                    }}
                  >
                    <IconButton
                      onClick={handleScrollLeft}
                      disabled={currentIndex === 0}
                    >
                      <ChevronLeft />
                    </IconButton>

                    <Scrollbar
                      ref={scrollbarRef}
                      style={{ width: "100%", overflowX: "auto" }}
                    >
                      <Grid2 container wrap="nowrap" spacing={2}>
                        {dates.map((date: DateItem) => (
                          <Grid2
                            key={date.date}
                            sx={{
                              flex: "0 0 auto",
                              textAlign: "center",
                            }}
                          >
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Card
                                sx={{
                                  minWidth: 80,
                                  cursor:
                                    date.slots.length > 0
                                      ? "pointer"
                                      : "not-allowed",
                                  background:
                                    date.slots.length > 0
                                      ? selectedDate?.date === date.date
                                        ? "#fff"
                                        : theme.palette.success.alpha50
                                      : theme.palette.error.alpha50,
                                  color:
                                    selectedDate?.date === date.date
                                      ? "black"
                                      : "white",
                                  transition: "all 0.3s ease",
                                }}
                                onClick={() => handleDateClick(date)}
                              >
                                <CardContent>
                                  <Box>
                                    <Typography variant="subtitle1">
                                      {format(parseISO(date.date), "d")}
                                    </Typography>
                                    <Typography variant="subtitle2">
                                      {format(parseISO(date.date), "EEE")}
                                    </Typography>
                                  </Box>
                                </CardContent>
                              </Card>
                            </motion.div>
                          </Grid2>
                        ))}
                      </Grid2>
                    </Scrollbar>

                    <IconButton
                      onClick={handleScrollRight}
                      disabled={currentIndex === dates.length - 1}
                    >
                      <ChevronRight />
                    </IconButton>
                  </Box>
                </Grid2>
              </motion.div>
            )}

            {selectedDate && (
              <Box textAlign="center" mb={4}>
                <Typography variant="h6" gutterBottom sx={{ my: 4 }}>
                  Time slots for {format(parseISO(selectedDate.date), "PPPP")}:
                </Typography>

                <Grid2 container spacing={2} justifyContent="center">
                  {selectedDate.slots.length > 0 ? (
                    selectedDate.slots
                      .slice(0, visibleSlots)
                      .map((slot, index) => (
                        <Grid2
                          key={index}
                          size={{ xs: 6, sm: 4, md: 4 }}
                          display="flex"
                          justifyContent="center"
                        >
                          <Chip
                            label={convertTo12HourFormat(slot)}
                            onClick={() => setSelectedSlot(slot)}
                            sx={{
                              px: 2,
                              py: 1,
                              borderRadius: "20px",
                              cursor: "pointer",
                              background:
                                slot === selectedSlot ? "white" : "#eeeeee50",
                              color: slot === selectedSlot ? "black" : "white",
                              transition: "all 0.3s ease",
                            }}
                          />
                        </Grid2>
                      ))
                  ) : (
                    <Typography>No slots available.</Typography>
                  )}
                </Grid2>

                {/* Show More Button */}
                {visibleSlots < selectedDate.slots.length && (
                  <Button
                    onClick={handleShowMore}
                    sx={{ mt: 2, color: "white" }}
                  >
                    Show More
                  </Button>
                )}
              </Box>
            )}

            {message && (
              <Typography
                variant="subtitle2"
                color="error"
                textAlign={"center"}
              >
                {message}
              </Typography>
            )}

            {selectedSlot && (
              <SubmitButton title="Book Call" isFullWidth={true} />
            )}
          </div>
        </Container>
      </form>
    </Box>
  );
};

export default SellSection;
