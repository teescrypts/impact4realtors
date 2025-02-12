import React, { useEffect, useRef, useState } from "react";
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
} from "@mui/material";
import { Scrollbar } from "@/app/component/scrollbar";
import ChevronLeft from "@/app/icons/untitled-ui/duocolor/chevron-left";
import ChevronRight from "@/app/icons/untitled-ui/duocolor/chevron-right";
import { convertTo12HourFormat } from "@/app/utils/convert-to-12hrs-format";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import SimpleBarCore from "simplebar-core";

export interface Availability {
  date: string;
  slots: string[];
}

type DateItem = {
  date: string;
  slots: string[];
};

function BookHouseTour({
  open,
  onClose,
  houseDetails,
}: {
  open: boolean;
  onClose: () => void;
  houseDetails: {
    name: string;
    location: string;
    price: number;
  };
}) {
  const [selectedDate, setSelectedDate] = useState<DateItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isProgrammaticScroll, setIsProgrammaticScroll] =
    useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState("");

  const scrollbarRef = useRef<SimpleBarCore | null>(null);

  const dates: DateItem[] = [
    {
      date: "2025-01-09",
      slots: [
        "13:00",
        "10:00",
        "13:00",
        "10:00",
        "13:00",
        "10:00",
        "13:00",
        "10:00",
      ],
    },
    { date: "2025-01-10", slots: ["01:00", "12:00"] },
    { date: "2025-01-11", slots: ["02:00", "04:00"] },
    { date: "2025-01-12", slots: ["13:00", "10:00"] },
    { date: "2025-01-13", slots: ["01:00", "12:00"] },
    { date: "2025-01-15", slots: ["02:00", "04:00"] },
    { date: "2025-01-16", slots: ["01:00", "12:00"] },
    { date: "2025-01-17", slots: ["02:00", "04:00"] },
    { date: "2025-01-18", slots: ["13:00", "10:00"] },
    { date: "2025-01-19", slots: ["01:00", "12:00"] },
    { date: "2025-01-20", slots: ["02:00", "04:00"] },
  ];

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

  // const handleBooking = () => {
  //   if (!selectedDate || !selectedTime) {
  //     alert("Please select a date and time for the tour.");
  //     return;
  //   }

  //   console.log("House Tour Booked:", {
  //     house: houseDetails.name,
  //     date: selectedDate.date.toString(),
  //     time: selectedTime,
  //   });

  //   onClose(); // Close the modal after booking
  // };

  const theme = useTheme();

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
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
            boxShadow: 10,
          },
        },
      }}
    >
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

        <Grid2 container spacing={3} justifyContent="center" mb={4}>
          <Box sx={{ p: 2 }}>
            {dates[currentIndex] && (
              <Typography variant="h2" align="center">
                {`${format(parseISO(dates[currentIndex].date), "MMMM yyyy")}`}
              </Typography>
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
                          cursor:
                            date.slots.length > 0 ? "pointer" : "not-allowed",
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

        {selectedDate && (
          <Box textAlign="center" mb={4}>
            <Typography variant="h6" gutterBottom sx={{ my: 4 }}>
              Time slots for {format(parseISO(selectedDate.date), "PPPP")}:
            </Typography>

            <Grid2 container spacing={2} justifyContent="center">
              {selectedDate.slots.length > 0 ? (
                selectedDate.slots.map((slot, index) => (
                  <Grid2
                    key={index}
                    size={{ xs: 4, sm: 4, md: 4 }}
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
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
        <Button onClick={onClose} variant="outlined" color="error">
          Cancel
        </Button>
        <Button variant="contained" color="primary">
          Confirm Booking
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default BookHouseTour;
