"use client";

import React, { useEffect, useRef, useState } from "react";
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
  SvgIcon,
} from "@mui/material";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { format, parseISO } from "date-fns";
import { Scrollbar } from "@/app/component/scrollbar";
import ChevronLeft from "@/app/icons/untitled-ui/duocolor/chevron-left";
import ChevronRight from "@/app/icons/untitled-ui/duocolor/chevron-right";
import { convertTo12HourFormat } from "@/app/utils/convert-to-12hrs-format";
import Call from "@/app/icons/untitled-ui/duocolor/call";
import SimpleBarCore from "simplebar-core";

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

const SellSection = () => {
  const theme = useTheme();
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

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.light})`,
        color: "white",
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <div>
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            gutterBottom
          >
            Book a Call with Our Realtor
          </Typography>

          <Typography
            variant="subtitle1"
            textAlign="center"
            maxWidth={600}
            mx="auto"
            mb={4}
          >
            Select a date and time that works for you, and let’s discuss selling
            your home effortlessly.
          </Typography>
        </div>

        <Grid2 container spacing={3} mb={4}>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <TextField
              variant="outlined"
              fullWidth
              label="Full Name"
              name="name"
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
              name="phone"
              required
              sx={textFieldStyle}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <TextField
              variant="outlined"
              fullWidth
              label="Property Type"
              name="propertyType"
              required
              sx={textFieldStyle}
            />
          </Grid2>
        </Grid2>

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
                    size={{ xs: 4, sm: 4, md: 2 }}
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

        {selectedSlot && (
          <Box textAlign="center">
            <Button
              startIcon={
                <SvgIcon>
                  <Call />
                </SvgIcon>
              }
              variant="contained"
              color="secondary"
              size="large"
            >
              Book a Call
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default SellSection;
