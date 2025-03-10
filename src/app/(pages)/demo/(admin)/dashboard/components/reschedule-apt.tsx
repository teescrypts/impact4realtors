"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Stack,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Grid2,
  IconButton,
  useTheme,
} from "@mui/material";
import SimpleBarCore from "simplebar-core";
import { Scrollbar } from "@/app/component/scrollbar";
import ChevronLeft from "@/app/icons/untitled-ui/duocolor/chevron-left";
import ChevronRight from "@/app/icons/untitled-ui/duocolor/chevron-right";
import { convertTo12HourFormat } from "@/app/utils/convert-to-12hrs-format";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import {
  fetchAdminAvailableDates,
  rescheduleApt,
} from "@/app/actions/server-actions";
import addDurationToTime from "@/app/utils/add-duration-to-time";
import notify from "@/app/utils/toast";

export interface Availability {
  date: string;
  slots: string[];
}

type DateItem = {
  date: string;
  slots: string[];
};

interface RescheduleModalProps {
  open: boolean;
  onClose: () => void;
  customer: string;
  type: "call" | "house_touring";
  currentDate: string;
  currentAptId: string;
}

const RescheduleAppointmentModal: React.FC<RescheduleModalProps> = ({
  open,
  onClose,
  customer,
  type,
  currentDate,
  currentAptId,
}) => {
  const [dates, setDates] = useState<DateItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<DateItem | null>(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isProgrammaticScroll, setIsProgrammaticScroll] =
    useState<boolean>(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [rescheduling, setRescheduling] = useState(false);
  const theme = useTheme();

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

  const fetchAvailabilty = useCallback(async () => {
    const result = await fetchAdminAvailableDates(type);

    if (result.data) {
      setDates(result.data);
      setLoading(false);
    }

    if (result.error) {
      setMessage(result.error);
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchAvailabilty();
  }, [currentAptId, type, fetchAvailabilty]);

  const HandleRescheduleApt = useCallback(async () => {
    if (selectedDate && selectedSlot) {
      setRescheduling(true);
      const result = await rescheduleApt(
        selectedDate.date,
        selectedSlot,
        addDurationToTime(selectedSlot, {
          hours: 0,
          minutes: type === "call" ? 30 : 40,
        }),
        currentAptId
      );

      if (result?.error) setMessage(result.error);
      if (result?.message) {
        notify(result.message);
        onClose();
      }

      setRescheduling(false);
    } else {
      alert("Please select date and time");
    }
  }, [selectedSlot, selectedDate, currentAptId, onClose, type]);

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

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          width: 500,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Reschedule {customer}&apos;s Appointment
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          Current Date: {currentDate}
        </Typography>

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
                              date.slots.length > 0 ? "pointer" : "not-allowed",
                            background:
                              selectedDate?.date === date.date
                                ? theme.palette.primary.dark
                                : theme.palette.primary.light,
                            // color:
                            //   selectedDate?.date === date.date
                            //     ? "black"
                            //     : "white",
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
                selectedDate.slots.slice(0, visibleSlots).map((slot, index) => (
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
                            ? theme.palette.primary.dark
                            : "",
                        // color: slot === selectedSlot ? "black" : "white",
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

        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
          <Button
            variant="outlined"
            onClick={() => {
              setSelectedDate(null);
              setSelectedSlot("");
              onClose();
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            sx={{
              position: "relative",
              minWidth: "120px",
              height: "40px",
              my: 4,
            }}
            onClick={HandleRescheduleApt}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                position: "absolute",
                transition: "opacity 0.2s ease-in-out",
              }}
            >
              {!rescheduling && "Reschedule"}
            </Box>
            {rescheduling && <CircularProgress size={24} />}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default RescheduleAppointmentModal;
