"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  KeyboardEvent,
} from "react";
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Grid2,
  CircularProgress,
  useTheme,
  alpha,
  SxProps,
  Theme,
} from "@mui/material";
import { motion } from "framer-motion";
import ChevronLeft from "@/app/icons/untitled-ui/duocolor/chevron-left";
import ChevronRight from "@/app/icons/untitled-ui/duocolor/chevron-right";
import LoadMore from "@/app/icons/untitled-ui/duocolor/load-more";
import { Scrollbar } from "@/app/component/scrollbar";
import { format, parseISO } from "date-fns";
import type { DateItem } from "@/types";
import type SimpleBarCore from "simplebar-core";

type DateCarouselProps = {
  dates: DateItem[];
  selectedDate: DateItem | null;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  onDateClick: (date: DateItem, idx: number) => void;
  cardSx: (isSelected: boolean, hasSlots: boolean) => SxProps<Theme>;
  loadingMore: boolean;
  onLoadMore: () => void;
};

export function DateCarousel({
  dates,
  selectedDate,
  currentIndex,
  setCurrentIndex,
  onDateClick,
  cardSx,
  loadingMore,
  onLoadMore,
}: DateCarouselProps) {
  const theme = useTheme();
  const scrollbarRef = useRef<SimpleBarCore | null>(null);
  const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false);

  // --- Scroll handlers ---
  const handleScrollLeft = useCallback(() => {
    setIsProgrammaticScroll(true);
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, [setCurrentIndex]);

  const handleScrollRight = useCallback(() => {
    setIsProgrammaticScroll(true);
    setCurrentIndex((prev) => Math.min(dates.length - 1, prev + 1));
  }, [dates.length, setCurrentIndex]);

  // --- useEffect 1: Programmatic scroll when currentIndex changes ---
  useEffect(() => {
    if (!scrollbarRef.current || !isProgrammaticScroll || !dates.length) return;
    const scrollbarElement = scrollbarRef.current.getScrollElement();
    if (!scrollbarElement) return;

    const itemWidth = scrollbarElement.scrollWidth / dates.length;
    const scrollPosition = currentIndex * itemWidth;

    scrollbarElement.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    });

    const timer = setTimeout(() => setIsProgrammaticScroll(false), 350);
    return () => clearTimeout(timer);
  }, [currentIndex, dates.length, isProgrammaticScroll]);

  // --- useEffect 2: Update currentIndex on manual scroll ---
  useEffect(() => {
    const scrollbarElement = scrollbarRef.current?.getScrollElement();
    if (!scrollbarElement) return;

    const handleScroll = () => {
      if (isProgrammaticScroll) return;
      const itemWidth =
        scrollbarElement.scrollWidth / Math.max(dates.length, 1);
      const newIndex = Math.round(scrollbarElement.scrollLeft / itemWidth);
      if (newIndex !== currentIndex) setCurrentIndex(newIndex);
    };

    scrollbarElement.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    return () => scrollbarElement.removeEventListener("scroll", handleScroll);
  }, [currentIndex, dates.length, isProgrammaticScroll, setCurrentIndex]);

  // --- Keyboard navigation (← / →) ---
  useEffect(() => {
    const scrollbarElement = scrollbarRef.current?.getScrollElement();
    if (!scrollbarElement) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleScrollLeft();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleScrollRight();
      }
    };

    scrollbarElement.addEventListener("keydown", handleKeyDown as () => void);
    return () =>
      scrollbarElement.removeEventListener(
        "keydown",
        handleKeyDown as () => void
      );
  }, [handleScrollLeft, handleScrollRight]);

  // --- Snap on scroll end ---
  useEffect(() => {
    const scrollbarElement = scrollbarRef.current?.getScrollElement();
    if (!scrollbarElement) return;

    let timeout: NodeJS.Timeout | null = null;
    const handleSnap = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        const itemWidth =
          scrollbarElement.scrollWidth / Math.max(dates.length, 1);
        const newIndex = Math.round(scrollbarElement.scrollLeft / itemWidth);
        scrollbarElement.scrollTo({
          left: newIndex * itemWidth,
          behavior: "smooth",
        });
      }, 120);
    };

    scrollbarElement.addEventListener("scroll", handleSnap);
    return () => {
      if (timeout) clearTimeout(timeout);
      scrollbarElement.removeEventListener("scroll", handleSnap);
    };
  }, [dates.length]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        width: "100%",
      }}
    >
      {/* Left Arrow */}
      <IconButton
        onClick={handleScrollLeft}
        disabled={currentIndex === 0}
        aria-label="previous date"
        size="large"
      >
        <ChevronLeft />
      </IconButton>

      {/* Scrollable Dates */}
      <Scrollbar
        ref={scrollbarRef}
        style={{
          width: "100%",
          overflowX: "auto",
          paddingBottom: theme.spacing(1),
        }}
        tabIndex={0}
      >
        <Grid2
          container
          wrap="nowrap"
          spacing={2}
          sx={{
            alignItems: "center",
            py: 1,
            px: 1,
            scrollSnapType: "x mandatory",
            "& > *": {
              scrollSnapAlign: "center",
            },
          }}
        >
          {dates.map((date, idx) => {
            const isSelected = selectedDate?.date === date.date;
            const hasSlots = date.slots.length > 0;

            return (
              <Grid2
                key={date.date}
                sx={{ flex: "0 0 auto", textAlign: "center", minWidth: 84 }}
              >
                <motion.div
                  whileHover={{ scale: hasSlots ? 1.06 : 1 }}
                  whileTap={{ scale: hasSlots ? 0.96 : 1 }}
                >
                  <Card
                    onClick={() => onDateClick(date, idx)}
                    sx={cardSx(isSelected, hasSlots)}
                    role="button"
                    aria-pressed={isSelected}
                    aria-disabled={!hasSlots}
                  >
                    <CardContent sx={{ p: 1 }}>
                      <Typography variant="h6" fontWeight={600}>
                        {format(parseISO(date.date), "d")}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        {format(parseISO(date.date), "EEE")}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid2>
            );
          })}

          {/* Load More Card */}
          {/* Load More Card */}
          <Grid2 sx={{ flex: "0 0 auto", textAlign: "center", minWidth: 84 }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Card
                onClick={!loadingMore ? onLoadMore : undefined}
                sx={{
                  background: `linear-gradient(135deg, ${alpha(
                    theme.palette.primary.main,
                    0.85
                  )}, ${alpha(theme.palette.secondary.main, 0.85)})`,
                  color: theme.palette.common.white,
                  borderRadius: 3,
                  height: 84,
                  width: 84,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: loadingMore ? "default" : "pointer",
                  boxShadow: `0 0 8px ${alpha(
                    theme.palette.primary.main,
                    0.4
                  )}`,
                  transition: "all 0.25s ease",
                  "&:hover": loadingMore
                    ? {} // ✅ always return an object
                    : {
                        transform: "translateY(-3px) scale(1.05)",
                        boxShadow: `0 6px 14px ${alpha(
                          theme.palette.primary.main,
                          0.5
                        )}`,
                      },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    width: "100%",
                    gap: 0.5,
                  }}
                >
                  {loadingMore ? (
                    <CircularProgress size={22} sx={{ color: "#fff" }} />
                  ) : (
                    <>
                      <LoadMore />
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 500, color: "#fff", lineHeight: 1.2 }}
                      >
                        Load More
                      </Typography>
                    </>
                  )}
                </Box>
              </Card>
            </motion.div>
          </Grid2>

          {/* Spacer to ensure last card is fully visible */}
          <Grid2 sx={{ flex: "0 0 auto", width: theme.spacing(16) }} />
        </Grid2>
      </Scrollbar>

      {/* Right Arrow */}
      <IconButton
        onClick={handleScrollRight}
        disabled={currentIndex >= dates.length - 1}
        aria-label="next date"
        size="large"
      >
        <ChevronRight />
      </IconButton>
    </Box>
  );
}
