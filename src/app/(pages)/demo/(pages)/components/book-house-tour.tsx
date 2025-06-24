import React, {
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Grid2,
  IconButton,
  useTheme,
  Stack,
  CircularProgress,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Scrollbar } from "@/app/component/scrollbar";
import ChevronLeft from "@/app/icons/untitled-ui/duocolor/chevron-left";
import ChevronRight from "@/app/icons/untitled-ui/duocolor/chevron-right";
import { convertTo12HourFormat } from "@/app/utils/convert-to-12hrs-format";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import SimpleBarCore from "simplebar-core";
import {
  bookAppointment,
  fetchAvailabilty,
} from "@/app/actions/server-actions";
import addDurationToTime from "@/app/utils/add-duration-to-time";
import { ActionStateType, AppointmentData } from "@/types";
import { SubmitButton } from "@/app/component/submit-buttton";
import notify from "@/app/utils/toast";

export interface Availability {
  date: string;
  slots: string[];
}

type DateItem = {
  date: string;
  slots: string[];
};

const initialState: ActionStateType = null;

function BookHouseTour({
  agent,
  houseTouringType,
  open,
  onClose,
  houseDetails,
  adminId,
}: {
  agent?: string;
  houseTouringType: string;
  open: boolean;
  onClose: () => void;
  houseDetails: {
    id: string;
    name: string;
    location: string;
    price: number;
  };
  adminId?: string;
}) {
  const [dates, setDates] = useState<DateItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<DateItem | null>(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isProgrammaticScroll, setIsProgrammaticScroll] =
    useState<boolean>(false);
  const [message, setMessage] = useState("");
  const [sendUpdates, setSendUpdates] = useState(false);
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
    type: "house_touring",
    date: undefined,
    bookedTime: {
      to: undefined,
      from: undefined,
    },
    propertyId: houseDetails.id,
    houseTouringType,
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

  const theme = useTheme();

  const handleContinue = useCallback(async () => {
    if (!sendUpdates) {
      return alert("Kindly check the box to move forward.");
    }

    setLoading(true);
    const result = await fetchAvailabilty("tour", adminId, agent);
    if (result.availability) setDates(result.availability);
    if (result.error) setMessage(result.error);
    if (result.message) setMessage(result.message);
    setLoading(false);
  }, [sendUpdates, adminId, agent]);

  const bookAppointmentWithData = bookAppointment.bind(null, adminId, aptData);
  const [state, formAction] = useActionState(
    bookAppointmentWithData,
    initialState
  );

  const handleClose = () => {
    onClose();
    setDates([]);
    setSelectedSlot("");
    setSelectedDate(null);
  };

  useEffect(() => {
    if (state) {
      if (state?.error) setMessage(state.error);
      if (state?.message) {
        notify(state.message);
        onClose();
        setDates([]);
        setSelectedSlot("");
        setSelectedDate(null);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            px: { xs: 2, sm: 4 },
            py: 3,
            backgroundColor: theme.palette.background.default,
            boxShadow: 24,
            backdropFilter: "blur(8px)",
          },
        },
      }}
    >
      <form action={formAction}>
        <DialogTitle sx={{ textAlign: "center", fontWeight: 600 }}>
          Book a Tour for <br />
          <Typography component="span" color="primary.main" fontWeight={700}>
            {houseDetails.name}
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          {/* Property Info */}
          <Stack spacing={1} mb={2}>
            <Typography variant="body1">
              <strong>Location:</strong> {houseDetails.location}
            </Typography>
            <Typography variant="body1">
              <strong>Price:</strong> ${houseDetails.price.toLocaleString()}
            </Typography>
          </Stack>

          {/* Input Fields */}
          <Stack spacing={2} my={2}>
            {/* TextField components here */}
            <TextField
              name="firstName"
              label="First Name"
              type="text"
              variant="outlined"
              required
            />

            <input defaultValue={agent} name="agent" hidden />

            <TextField
              name="lastName"
              label="Last Name"
              type="text"
              variant="outlined"
              required
            />

            <TextField
              name="email"
              label="Email"
              type="email"
              variant="outlined"
              required
            />

            <TextField
              name="phoneNumber"
              label="Phone Number"
              type="tel"
              variant="outlined"
              required
            />
          </Stack>

          {/* Promotional Consent */}
          <Box
            sx={{
              p: 2,
              mt: 2,
              mb: 3,
            }}
          >
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
                <Typography variant="body2" color="text.secondary">
                  I agree to receive <strong>promotional emails and SMS</strong>{" "}
                  about exclusive listings, market insights, and special offers.
                  I can <strong>unsubscribe anytime</strong>.
                </Typography>
              }
            />
          </Box>

          {/* Continue Button */}
          <Button
            color="primary"
            variant="contained"
            onClick={handleContinue}
            fullWidth
            sx={{ mb: 2 }}
          >
            Continue
          </Button>

          {/* Loading State */}
          {loading && (
            <Stack alignItems="center" spacing={1} my={2}>
              <CircularProgress size={24} />
              <Typography variant="body2" textAlign="center">
                Loading available dates...
              </Typography>
            </Stack>
          )}

          {dates.length > 0 && (
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
                                  color={date.slots.length === 0 ? "error" : ""}
                                  variant="subtitle1"
                                >
                                  {format(parseISO(date.date), "d")}
                                </Typography>
                                <Typography
                                  color={date.slots.length === 0 ? "error" : ""}
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
                            color: slot === selectedSlot ? "#fff" : "#333",
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
                <Button sx={{ mt: 2 }} onClick={handleShowMore}>
                  Show More
                </Button>
              )}
            </Box>
          )}

          {message && (
            <Typography color="error" textAlign={"center"} variant="subtitle2">
              {message}
            </Typography>
          )}
        </DialogContent>

        {/* Actions */}
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={handleClose} variant="outlined" color="error">
            Cancel
          </Button>
          <SubmitButton title="Book" isFullWidth={false} />
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default BookHouseTour;
