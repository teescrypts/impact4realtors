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

const initialState: ActionStateType = null;

function BookHouseTour({
  houseTouringType,
  open,
  onClose,
  houseDetails,
  adminId,
}: {
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
    setLoading(true);
    const result = await fetchAvailabilty("tour", adminId);
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
        onClose();
        notify(state.message);
        setDates([]);
        setSelectedSlot("");
        setSelectedDate(null);
      }
    }
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
            borderRadius: 3,
            p: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            boxShadow: 10,
          },
        },
      }}
    >
      <form action={formAction}>
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          Book a Tour for {houseDetails.name}
        </DialogTitle>

        <DialogContent>
          <Typography variant="body1" gutterBottom>
            <strong>Location:</strong> {houseDetails.location}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Price:</strong> {houseDetails.price}
          </Typography>

          <Stack spacing={2} sx={{ my: 2 }}>
            <TextField
              name="firstName"
              label="First Name"
              type="text"
              variant="outlined"
              required
              sx={textFieldStyle}
            />

            <TextField
              name="lastName"
              label="Last Name"
              type="text"
              variant="outlined"
              required
              sx={textFieldStyle}
            />

            <TextField
              name="email"
              label="Email"
              type="email"
              variant="outlined"
              required
              sx={textFieldStyle}
            />

            <TextField
              name="phoneNumber"
              label="Phone Number"
              type="tel"
              variant="outlined"
              required
              sx={textFieldStyle}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={sendUpdates}
                  onChange={(e) => setSendUpdates(e.target.checked)}
                  color="primary"
                />
              }
              label="Send me updates on market trends and updates"
            />
          </Stack>

          <Button
            color="secondary"
            variant="contained"
            onClick={handleContinue}
            fullWidth
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
                            sx={{
                              minWidth: 80,
                              border: date.slots.length === 0 ? "red" : "",
                              cursor:
                                date.slots.length > 0
                                  ? "pointer"
                                  : "not-allowed",
                              background:
                                selectedDate?.date === date.date
                                  ? "#fff"
                                  : "#eeeeee50",
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
                <Button onClick={handleShowMore} sx={{ mt: 2, color: "white" }}>
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

        <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
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
