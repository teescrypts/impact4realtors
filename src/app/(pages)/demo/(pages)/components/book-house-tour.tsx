import React, { useActionState, useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid2,
  useTheme,
  Stack,
  CircularProgress,
  TextField,
  Checkbox,
  FormControlLabel,
  alpha,
} from "@mui/material";
import {
  bookAppointment,
  fetchAvailabilty,
} from "@/app/actions/server-actions";
import addDurationToTime from "@/app/utils/add-duration-to-time";
import { ActionStateType, AppointmentData, DateItem } from "@/types";
import { SubmitButton } from "@/app/component/submit-buttton";
import notify from "@/app/utils/toast";
import { DateTime } from "luxon";
import { DateCarousel } from "./schedule/date-carousel";
import { useScheduleState } from "@/app/hooks/use-schedule-state";
import { TimeSlotSelector } from "./schedule/time-selector";
import { DateHeader } from "./schedule/date-header";

export interface Availability {
  date: string;
  slots: string[];
}

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
  const [dates, setDates] = useState<DateItem[] | undefined>();
  const [isProgrammaticScroll, setIsProgrammaticScroll] =
    useState<boolean>(false);
  const [message, setMessage] = useState("");
  const [sendUpdates, setSendUpdates] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nextStartDate, setNextStartDate] = useState<string | undefined>();
  const [fullZoneName, setFullZoneName] = useState<string | null>(null);
  const [offset, setOffset] = useState("");
  const theme = useTheme();

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

  const handleUpdateTime = (selectedSlot: string) => {
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
  };

  const handleUpdateDate = (selectedDate: DateItem) => {
    if (selectedDate) {
      setAptData((prev) => {
        return {
          ...prev,
          date: selectedDate.date,
        };
      });
    }
  };

  const {
    selectedDate,
    selectedSlot,
    currentIndex,
    visibleSlots,
    scrollbarRef,
    setCurrentIndex,
    handleDateClick,
    handleTimeClick,
    handleShowMore,
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

  useEffect(() => {
    // Programmatically scroll to the correct position when currentIndex changes
    if (scrollbarRef.current && isProgrammaticScroll) {
      const scrollbarElement = scrollbarRef.current.getScrollElement();

      if (scrollbarElement && dates) {
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
  }, [currentIndex, dates?.length, dates, scrollbarRef, isProgrammaticScroll]);

  useEffect(() => {
    // Update currentIndex based on manual scrolling/swiping
    const handleScroll = () => {
      if (isProgrammaticScroll) return; // Skip manual scroll updates during programmatic scroll

      if (scrollbarRef.current) {
        const scrollbarElement = scrollbarRef.current.getScrollElement();

        let newIndex;
        if (scrollbarElement && dates) {
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
  }, [
    currentIndex,
    dates?.length,
    isProgrammaticScroll,
    dates,
    scrollbarRef,
    setCurrentIndex,
  ]);

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
  }, [selectedDate, selectedSlot, dates, scrollbarRef]);

  const [loadingMore, setLoadingMore] = useState(false);

  const handleLoadMore = useCallback(async () => {
    setLoadingMore(true);
    const result = await fetchAvailabilty(
      "tour",
      nextStartDate,
      adminId,
      agent
    );

    if (result.availability) {
      const dates = result.availability;
      const nextDate = result.nextStartDate;

      setDates((prev) => {
        if (prev) {
          return [...prev, ...dates!];
        }
      });
      setNextStartDate(nextDate);
      setLoadingMore(false);
    }

    if (result.error) {
      setMessage(result.error);
      setLoadingMore(false);
    }

    if (result.message) {
      setMessage(result.message);
      setLoadingMore(false);
    }
  }, [nextStartDate, adminId, agent]);

  const handleContinue = useCallback(async () => {
    if (!sendUpdates) {
      return alert("Kindly check the box to move forward.");
    }

    setLoading(true);
    const result = await fetchAvailabilty("tour", undefined, adminId, agent);

    if (result.availability) {
      const dates = result.availability;
      const timeZone = result.timeZone;
      const nextDate = result.nextStartDate;

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

    if (result.message) {
      setMessage(result.message);
      setLoading(false);
    }
  }, [sendUpdates, adminId, agent]);

  const bookAppointmentWithData = bookAppointment.bind(null, adminId, aptData);
  const [state, formAction] = useActionState(
    bookAppointmentWithData,
    initialState
  );

  const handleClose = () => {
    onClose();
    setDates([]);
    // setSelectedSlot("");
    // setSelectedDate(null);
    setSendUpdates(false);
  };

  useEffect(() => {
    if (state) {
      if (state?.error) setMessage(state.error);
      if (state?.message) {
        notify(state.message);
        onClose();
        setDates([]);
        // setSelectedSlot("");
        // setSelectedDate(null);
        setSendUpdates(false);
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

          {dates && dates.length > 0 && (
            <Grid2 container spacing={3} justifyContent="center" mb={4}>
              <DateHeader
                dates={dates}
                currentIndex={currentIndex}
                fullZoneName={fullZoneName}
                offset={offset}
              />

              <DateCarousel
                dates={dates}
                selectedDate={selectedDate}
                currentIndex={currentIndex}
                onDateClick={handleDateClick}
                setCurrentIndex={setCurrentIndex}
                cardSx={cardSx}
                loadingMore={loadingMore}
                onLoadMore={handleLoadMore}
              />
            </Grid2>
          )}

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
