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
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid2,
  IconButton,
  TextField,
} from "@mui/material";
import { AgentType } from "../agents/page";
import { Scrollbar } from "@/app/component/scrollbar";
import { SubmitButton } from "@/app/component/submit-buttton";
import ChevronLeft from "@/app/icons/untitled-ui/duocolor/chevron-left";
import ChevronRight from "@/app/icons/untitled-ui/duocolor/chevron-right";
import { convertTo12HourFormat } from "@/app/utils/convert-to-12hrs-format";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import {
  fetchAvailabilty,
  bookAppointment,
} from "@/app/actions/server-actions";
import addDurationToTime from "@/app/utils/add-duration-to-time";
import notify from "@/app/utils/toast";
import { ActionStateType, AppointmentData } from "@/types";
import {
  useRef,
  useEffect,
  useState,
  useCallback,
  useActionState,
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
  const [selectedDate, setSelectedDate] = useState<DateItem | null>(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isProgrammaticScroll, setIsProgrammaticScroll] =
    useState<boolean>(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendUpdates, setSendUpdates] = useState(false);

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
    callReason: type === "general" ? "general_enquiry" : "mortgage_enquiry",
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
            to: addDurationToTime(selectedSlot, { hours: 0, minutes: 30 }),
          },
        };
      });
    }
  }, [selectedDate, selectedSlot]);

  const handleContinue = useCallback(async () => {
    if (!sendUpdates) return alert("Kindly check the box to move forward.");
    setLoading(true);
    const result = await fetchAvailabilty("call", adminId, agent.owner);
    if (result.availability) setDates(result.availability);
    if (result.error) setMessage(result.error);
    if (result.message) setMessage(result.message);
    setLoading(false);
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
        setSelectedSlot("");
        setSelectedDate(null);
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
                                  sx={(theme) => ({
                                    minWidth: 80,
                                    border:
                                      date.slots.length === 0
                                        ? "2px solid red"
                                        : "1px solid #ccc",
                                    cursor:
                                      date.slots.length > 0
                                        ? "pointer"
                                        : "not-allowed",
                                    backgroundColor:
                                      selectedDate?.date === date.date
                                        ? theme.palette.primary.main
                                        : "#f5f5f5",
                                    color:
                                      selectedDate?.date === date.date
                                        ? "#fff"
                                        : "#333",
                                    boxShadow:
                                      selectedDate?.date === date.date
                                        ? "0 4px 12px rgba(0, 0, 0, 0.2)"
                                        : "none",
                                    borderRadius: 2,
                                    p: 1,
                                    textAlign: "center",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                      backgroundColor:
                                        date.slots.length > 0 &&
                                        selectedDate?.date !== date.date
                                          ? theme.palette.primary.dark
                                          : undefined,
                                      color:
                                        date.slots.length > 0 &&
                                        selectedDate?.date !== date.date
                                          ? "#fff"
                                          : undefined,
                                    },
                                  })}
                                  onClick={() => handleDateClick(date)}
                                >
                                  <CardContent>
                                    <Box>
                                      <Typography
                                        color={
                                          date.slots.length === 0 ? "error" : ""
                                        }
                                        variant="subtitle1"
                                      >
                                        {format(parseISO(date.date), "d")}
                                      </Typography>
                                      <Typography
                                        color={
                                          date.slots.length === 0 ? "error" : ""
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
                                sx={(theme) => ({
                                  px: 2,
                                  py: 1,
                                  borderRadius: "20px",
                                  cursor: "pointer",
                                  transition: "all 0.3s ease",
                                  backgroundColor:
                                    slot === selectedSlot
                                      ? theme.palette.primary.main
                                      : "#f5f5f5",
                                  color:
                                    slot === selectedSlot ? "#fff" : "#333",
                                  fontWeight:
                                    slot === selectedSlot ? "bold" : "normal",
                                  boxShadow:
                                    slot === selectedSlot
                                      ? "0 3px 8px rgba(0,0,0,0.2)"
                                      : "none",
                                  "&:hover": {
                                    backgroundColor:
                                      slot === selectedSlot
                                        ? theme.palette.primary.dark
                                        : "#e0e0e0",
                                  },
                                  border:
                                    slot === selectedSlot
                                      ? `2px solid ${theme.palette.primary.main}`
                                      : "1px solid #ccc",
                                })}
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
