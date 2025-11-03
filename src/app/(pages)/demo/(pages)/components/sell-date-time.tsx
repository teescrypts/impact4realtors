// app/component/schedule/ScheduleDialogUI.tsx
"use client";

import { useScheduleState } from "@/app/hooks/use-schedule-state";
import { ScheduleDialogProps } from "@/types";
import {
  Dialog,
  DialogActions,
  Button,
  Typography,
  Divider,
  useTheme,
  alpha,
  SxProps,
  Theme,
} from "@mui/material";
import { motion } from "framer-motion";
import { DateCarousel } from "./schedule/date-carousel";
import ScheduleHeader from "./schedule/schedule-header";
import { TimeSlotSelector } from "./schedule/time-selector";
import { DateHeader } from "./schedule/date-header";

export default function ScheduleDialogUI({
  open,
  onClose,
  dates,
  message,
  onDateClicked,
  onTimeClicked,
  onContinue,
  onLoadMore,
  loadingMore,
  fullZoneName,
  offset,
}: ScheduleDialogProps) {
  const theme = useTheme();

  const {
    selectedDate,
    selectedSlot,
    currentIndex,
    visibleSlots,
    setCurrentIndex,
    handleDateClick,
    handleTimeClick,
    handleShowMore,
  } = useScheduleState(dates, onDateClicked, onTimeClicked);

  const successBg = alpha(theme.palette.success.main, 0.14);
  const errorBg = alpha(theme.palette.error.main, 0.14);
  const highlight =
    theme.palette.mode === "dark"
      ? theme.palette.grey[900]
      : theme.palette.common.white;
  const textOnHighlight = theme.palette.getContrastText(highlight);

  const cardSx = (isSelected: boolean, hasSlots: boolean): SxProps<Theme> => ({
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
  });

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <ScheduleHeader onClose={onClose} />

      <DateHeader
        dates={dates}
        currentIndex={currentIndex}
        fullZoneName={fullZoneName}
        offset={offset}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <DateCarousel
          dates={dates}
          selectedDate={selectedDate}
          currentIndex={currentIndex}
          onDateClick={handleDateClick}
          setCurrentIndex={setCurrentIndex}
          cardSx={cardSx}
          loadingMore={loadingMore}
          onLoadMore={onLoadMore}
        />
      </motion.div>

      <Divider sx={{ my: 2 }} />

      <TimeSlotSelector
        selectedDate={selectedDate}
        selectedSlot={selectedSlot}
        visibleSlots={visibleSlots}
        onTimeClick={handleTimeClick}
        onShowMore={handleShowMore}
      />

      {message && (
        <Typography variant="subtitle2" color="error" textAlign="center">
          {message}
        </Typography>
      )}

      <DialogActions sx={{ px: 3, py: 2 }}>
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
