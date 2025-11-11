"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Stack,
  CircularProgress,
  Grid2,
  useTheme,
  alpha,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  fetchAdminAvailableDates,
  rescheduleApt,
} from "@/app/actions/server-actions";
import addDurationToTime from "@/app/utils/add-duration-to-time";
import notify from "@/app/utils/toast";
import { DateTime } from "luxon";
import { useScheduleState } from "@/app/hooks/use-schedule-state";
import { DateHeader } from "./schedule/date-header";
import { DateCarousel } from "./schedule/date-carousel";
import { TimeSlotSelector } from "./schedule/time-selector";

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
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [nextStartDate, setNextStartDate] = useState<string | undefined>();
  const [fullZoneName, setFullZoneName] = useState<string | null>(null);
  const [offset, setOffset] = useState("");
  const [rescheduling, setRescheduling] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const theme = useTheme();

  const handleUpdateDate = (selectedDate: DateItem) => {
    if (selectedDate) {
      // setAptData((prev) => {
      //   return {
      //     ...prev,
      //     date: selectedDate.date,
      //   };
      // });
    }
  };

  const handleUpdateTime = (selectedSlot: string) => {
    if (selectedSlot) {
      // setAptData((prev) => {
      //   return {
      //     ...prev,
      //     bookedTime: {
      //       from: selectedSlot,
      //       to: addDurationToTime(selectedSlot, { hours: 0, minutes: 45 }),
      //     },
      //   };
      // });
    }
  };

  const {
    selectedDate,
    selectedSlot,
    currentIndex,
    visibleSlots,
    setCurrentIndex,
    handleDateClick,
    handleTimeClick,
    handleShowMore,
    setSelectedDate,
    setSelectedSlot,
  } = useScheduleState(dates, handleUpdateDate, handleUpdateTime);

  const successBg = alpha(theme.palette.success.main, 0.14);
  const errorBg = alpha(theme.palette.error.main, 0.14);
  const highlight =
    theme.palette.mode === "dark"
      ? theme.palette.grey[900]
      : theme.palette.common.white;
  const textOnHighlight = theme.palette.getContrastText(highlight);

  const cardSx = (isSelected: boolean, hasSlots: boolean) => ({
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

  const fetchMoreAvailabilty = useCallback(async () => {
    setLoadingMore(true);
    const result = await fetchAdminAvailableDates(type, nextStartDate);

    if (result.data) {
      const dates = result.data.availability;
      const nextDate = result.data.nextStartDate;

      setDates((date) => {
        return [...date, ...dates!];
      });
      setNextStartDate(nextDate);
      setLoadingMore(false);
    }

    if (result.error) {
      setMessage(result.error);
      setLoadingMore(false);
    }
  }, [type, nextStartDate]);

  const fetchAvailabilty = useCallback(async () => {
    const result = await fetchAdminAvailableDates(type);

    if (result.data) {
      const dates = result.data.availability;
      const timeZone = result.data.timeZone;
      const nextDate = result.data.nextStartDate;

      const now = DateTime.now().setZone(timeZone);
      setFullZoneName(now.offsetNameLong);
      setOffset(now.toFormat("ZZZZ"));
      setDates(dates);
      setNextStartDate(nextDate);
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
          <Grid2>
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
                onLoadMore={fetchMoreAvailabilty}
              />
            </motion.div>
          </Grid2>
        )}

        <Divider sx={{ my: 2 }} />

        {selectedDate && (
          <TimeSlotSelector
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            visibleSlots={visibleSlots}
            onTimeClick={handleTimeClick}
            onShowMore={handleShowMore}
          />
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
