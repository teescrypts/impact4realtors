"use client";

import {
  bookAppointment,
  fetchAvailabilty,
} from "@/app/actions/server-actions";
import { Scrollbar } from "@/app/component/scrollbar";
import { SubmitButton } from "@/app/component/submit-buttton";
import ChevronLeft from "@/app/icons/untitled-ui/duocolor/chevron-left";
import ChevronRight from "@/app/icons/untitled-ui/duocolor/chevron-right";
import addDurationToTime from "@/app/utils/add-duration-to-time";
import { convertTo12HourFormat } from "@/app/utils/convert-to-12hrs-format";
import notify from "@/app/utils/toast";
import { ActionStateType, AppointmentData } from "@/types";
import {
  Box,
  Button,
  Container,
  Grid2,
  TextField,
  Typography,
  Avatar,
  CircularProgress,
  Stack,
  Card,
  CardContent,
  Chip,
  IconButton,
  useTheme,
} from "@mui/material";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import {
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import SimpleBarCore from "simplebar-core";

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
  const [selectedDate, setSelectedDate] = useState<DateItem | null>(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isProgrammaticScroll, setIsProgrammaticScroll] =
    useState<boolean>(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollbarRef = useRef<SimpleBarCore | null>(null);

  const handleDateClick = (date: DateItem) => {
    if (date.slots.length > 0) {
      setSelectedDate(date);
      setSelectedSlot("");
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
    callReason: reason === "general" ? "general_enquiry" : "mortgage_enquiry",
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
    setLoading(true);
    const result = await fetchAvailabilty("call", adminId);
    if (result.availability) setDates(result.availability);
    if (result.error) setMessage(result.error);
    if (result.message) setMessage(result.message);
    setLoading(false);
  }, []);

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

  const theme = useTheme();

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Grid2 container spacing={4} alignItems="center">
          <Grid2 size={{ xs: 12, md: 5 }}>
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
                      <Box sx={{ p: 2 }}>
                        {dates[currentIndex] && (
                          <div>
                            <Typography
                              variant="h3"
                              align="center"
                              sx={{ my: 2 }}
                            >
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
                            {dates.map((date) => (
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
                                      backgroundColor:
                                        date?.slots.length > 0
                                          ? selectedDate?.date === date.date
                                            ? theme.palette.success.main
                                            : theme.palette.primary.alpha50
                                          : theme.palette.error.alpha50,
                                      transition: "all 0.3s ease",
                                    }}
                                    onClick={() => handleDateClick(date)}
                                  >
                                    <CardContent>
                                      <Box>
                                        <Typography
                                          color={
                                            date.slots.length === 0
                                              ? "error"
                                              : ""
                                          }
                                          variant="subtitle1"
                                        >
                                          {format(parseISO(date.date), "d")}
                                        </Typography>
                                        <Typography
                                          color={
                                            date.slots.length === 0
                                              ? "error"
                                              : ""
                                          }
                                          variant="subtitle2"
                                        >
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
                  )}

                  {selectedDate && (
                    <Box textAlign="center">
                      <Typography variant="h6" gutterBottom sx={{ my: 4 }}>
                        Time slots for{" "}
                        {format(parseISO(selectedDate.date), "PPPP")}:
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
                                      slot === selectedSlot
                                        ? theme.palette.success.main
                                        : "",
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
                        <Button onClick={handleShowMore}>Show More</Button>
                      )}
                    </Box>
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

                  <Box
                    display={selectedDate && selectedSlot ? "block" : "none"}
                  >
                    <SubmitButton title="Book Call" isFullWidth={true} />
                  </Box>
                </Box>
              </motion.div>
            </form>
          </Grid2>
        </Grid2>
      </motion.div>
    </Container>
  );
}
