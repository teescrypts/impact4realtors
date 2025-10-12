"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  useTheme,
  alpha,
  Divider,
  Grid2,
} from "@mui/material";
import Close from "@/app/icons/untitled-ui/duocolor/close";
import ChevronLeft from "@/app/icons/untitled-ui/duocolor/chevron-left";
import ChevronRight from "@/app/icons/untitled-ui/duocolor/chevron-right";
import SimpleBarCore from "simplebar-core";
import { Scrollbar } from "@/app/component/scrollbar";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { convertTo12HourFormat } from "@/app/utils/convert-to-12hrs-format";

type DateItem = {
  date: string;
  slots: string[];
};

type Props = {
  open: boolean;
  onClose: () => void;
  dates: DateItem[];
  message: string | undefined;
  onDateClicked: (date: DateItem) => void;
  onTimeClicked: (selectedSlot: string) => void;
  onContinue: () => void;
};

export default function ScheduleDialogUI({
  open,
  onClose,
  dates,
  message,
  onDateClicked,
  onTimeClicked,
  onContinue,
}: Props) {
  const theme = useTheme();

  // UI state
  const [selectedDate, setSelectedDate] = useState<DateItem | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isProgrammaticScroll, setIsProgrammaticScroll] =
    useState<boolean>(false);
  const [visibleSlots, setVisibleSlots] = useState<number>(10);

  // scrollbar ref (SimpleBarCore)
  const scrollbarRef = useRef<SimpleBarCore | null>(null);
  const scrollContainerRef = useRef<HTMLElement | null>(null);

  // theme-driven colors
  const successBg = useMemo(
    () => alpha(theme.palette.success.main, 0.14),
    [theme.palette.success.main]
  );
  const errorBg = useMemo(
    () => alpha(theme.palette.error.main, 0.14),
    [theme.palette.error.main]
  );
  const highlight =
    theme.palette.mode === "dark"
      ? theme.palette.grey[900]
      : theme.palette.common.white;
  const textOnHighlight = useMemo(
    () => theme.palette.getContrastText(highlight),
    [highlight, theme]
  );

  // Helper: style for date card
  const cardSx = useCallback(
    (isSelected: boolean, hasSlots: boolean) => ({
      minWidth: 84,
      cursor: hasSlots ? "pointer" : "not-allowed",
      background: hasSlots ? (isSelected ? successBg : highlight) : errorBg,
      color: isSelected
        ? textOnHighlight
        : theme.palette.getContrastText(successBg),
      transition: "transform 200ms ease, box-shadow 200ms ease",
      borderRadius: 2,
      userSelect: "none",
      px: 1,
      py: 0.6,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: 84,
    }),
    [highlight, successBg, errorBg, textOnHighlight, theme]
  );

  // When `dates` changes, reset selection to first available date
  useEffect(() => {
    if (!dates || dates.length === 0) {
      setSelectedDate(null);
      setSelectedSlot("");
      setCurrentIndex(0);
      return;
    }
    setVisibleSlots(10);
  }, [dates]);

  // Expose scroll element for convenience
  useEffect(() => {
    try {
      const el = scrollbarRef.current?.getScrollElement();
      if (el) scrollContainerRef.current = el;
    } catch {
      scrollContainerRef.current = null;
    }
  }, []);

  // Programmatically scroll to currentIndex
  useEffect(() => {
    const el = scrollbarRef.current?.getScrollElement();
    if (!el || dates.length === 0) return;

    // Compute approximate item width (guard against divide by zero)
    const itemWidth = Math.max(1, el.scrollWidth / Math.max(1, dates.length));
    setIsProgrammaticScroll(true);

    el.scrollTo({
      left: Math.min(
        el.scrollWidth - el.clientWidth,
        Math.max(0, currentIndex * itemWidth)
      ),
      behavior: "smooth",
    });

    const timer = window.setTimeout(() => setIsProgrammaticScroll(false), 320);
    return () => clearTimeout(timer);
  }, [currentIndex, dates.length]);

  // Update currentIndex when user scrolls manually
  useEffect(() => {
    const el = scrollbarRef.current?.getScrollElement();
    if (!el) return;

    const onScroll = () => {
      if (isProgrammaticScroll) return;
      const itemWidth = Math.max(1, el.scrollWidth / Math.max(1, dates.length));
      const newIndex = Math.round(el.scrollLeft / itemWidth);
      if (!Number.isNaN(newIndex) && newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [isProgrammaticScroll, currentIndex, dates.length]);

  // Handlers
  const handleDateClick = useCallback(
    (date: DateItem, idx: number) => {
      if (!date || (date.slots?.length ?? 0) === 0) return;
      setSelectedDate(date);
      setSelectedSlot("");
      setCurrentIndex(idx);
      onDateClicked(date);
      setVisibleSlots(10);
    },
    [onDateClicked]
  );

  const handleScrollLeft = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }, []);

  const handleScrollRight = useCallback(() => {
    setCurrentIndex((i) => Math.min(dates.length - 1, i + 1));
  }, [dates.length]);

  const handleTimeClick = useCallback(
    (slot: string) => {
      setSelectedSlot(slot);
      onTimeClicked(slot);
    },
    [onTimeClicked]
  );

  const handleShowMore = useCallback(() => setVisibleSlots((v) => v + 10), []);

  // keyboard support: left/right arrow when focus on scroll container
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleScrollLeft();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleScrollRight();
      }
    };

    el.addEventListener("keydown", onKeyDown);
    return () => el.removeEventListener("keydown", onKeyDown);
  }, [handleScrollLeft, handleScrollRight]);

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={onClose}
      aria-labelledby="schedule-dialog-title"
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h6">Schedule a Call</Typography>
          <Typography variant="body2" color="text.secondary">
            Choose a date and time that works for you
          </Typography>
        </Box>

        <IconButton aria-label="close" onClick={onClose} size="large">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Dates Carousel */}
        {dates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <Grid2 container spacing={3} justifyContent="center" mb={4}>
              <Grid2 size={{ xs: 12, sm: 3 }}>
                <Box sx={{ p: 1, textAlign: "center" }}>
                  {dates[currentIndex] && (
                    <>
                      <Typography variant="h6" sx={{ mb: 0.5 }}>
                        Select Date
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary">
                        {format(
                          parseISO(dates[currentIndex].date),
                          "MMMM yyyy"
                        )}
                      </Typography>
                    </>
                  )}
                </Box>
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 9 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton
                    onClick={handleScrollLeft}
                    disabled={currentIndex === 0}
                    aria-label="previous date"
                    size="large"
                  >
                    <ChevronLeft />
                  </IconButton>

                  <Scrollbar
                    ref={scrollbarRef}
                    style={{ width: "100%", overflowX: "auto" }}
                    tabIndex={0}
                  >
                    <Grid2
                      container
                      wrap="nowrap"
                      spacing={2}
                      sx={{ alignItems: "center", py: 1 }}
                    >
                      {dates.map((date, idx) => {
                        const isSelected = selectedDate?.date === date.date;
                        const hasSlots = date.slots?.length > 0;
                        return (
                          <Grid2
                            key={date.date}
                            sx={{ flex: "0 0 auto", textAlign: "center" }}
                          >
                            <motion.div
                              whileHover={{ scale: hasSlots ? 1.06 : 1 }}
                              whileTap={{ scale: hasSlots ? 0.96 : 1 }}
                            >
                              <Card
                                onClick={() => handleDateClick(date, idx)}
                                sx={cardSx(isSelected, hasSlots)}
                                role="button"
                                aria-pressed={isSelected}
                                aria-disabled={!hasSlots}
                              >
                                <CardContent sx={{ p: 1 }}>
                                  <Typography variant="h6">
                                    {format(parseISO(date.date), "d")}
                                  </Typography>
                                  <Typography variant="caption">
                                    {format(parseISO(date.date), "EEE")}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </motion.div>
                          </Grid2>
                        );
                      })}
                    </Grid2>
                  </Scrollbar>

                  <IconButton
                    onClick={handleScrollRight}
                    disabled={currentIndex >= dates.length - 1}
                    aria-label="next date"
                    size="large"
                  >
                    <ChevronRight />
                  </IconButton>
                </Box>
              </Grid2>
            </Grid2>
          </motion.div>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Time slots */}
        {selectedDate ? (
          <Box textAlign="center" mb={4}>
            <Typography variant="h6" gutterBottom sx={{ my: 2 }}>
              Time slots for{" "}
              <strong>{format(parseISO(selectedDate.date), "PPPP")}</strong>:
            </Typography>

            <Grid2 container spacing={2} justifyContent="center">
              {selectedDate.slots && selectedDate.slots.length > 0 ? (
                selectedDate.slots.slice(0, visibleSlots).map((slot) => {
                  const selected = selectedSlot === slot;
                  return (
                    <Grid2
                      key={slot}
                      size={{ xs: 6, sm: 4, md: 3 }}
                      display="flex"
                      justifyContent="center"
                    >
                      <Chip
                        label={convertTo12HourFormat(slot)}
                        onClick={() => handleTimeClick(slot)}
                        sx={{
                          px: 2,
                          py: 1,
                          borderRadius: "20px",
                          cursor: "pointer",
                          background: selected
                            ? "primary"
                            : alpha(theme.palette.common.white, 0.06),
                          color: selected
                            ? textOnHighlight
                            : theme.palette.getContrastText(
                                alpha(theme.palette.common.white, 0.06)
                              ),
                          transition: "all 0.2s ease",
                          minWidth: 110,
                          fontWeight: 600,
                        }}
                        aria-pressed={selected}
                      />
                    </Grid2>
                  );
                })
              ) : (
                <Typography>No slots available.</Typography>
              )}
            </Grid2>

            {visibleSlots < (selectedDate.slots?.length ?? 0) && (
              <Button onClick={handleShowMore} sx={{ mt: 2 }}>
                Show More
              </Button>
            )}
          </Box>
        ) : (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">
              Select a date to view available slots.
            </Typography>
          </Box>
        )}

        {message && (
          <Typography variant="subtitle2" color="error" textAlign={"center"}>
            {message}
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        {/* Only show booking CTA when a slot is selected */}
        {selectedSlot ? (
          <Button variant="contained" onClick={onContinue}>
            Continue
          </Button>
        ) : (
          <Button onClick={onClose} color="inherit" variant="outlined">
            Cancel
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
