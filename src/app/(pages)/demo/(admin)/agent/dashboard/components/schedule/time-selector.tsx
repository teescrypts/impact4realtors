// app/component/schedule/TimeSlotSelector.tsx
import {
  Box,
  Typography,
  Button,
  Chip,
  useTheme,
  alpha,
  Grid2,
  CircularProgress,
} from "@mui/material";
import { parseISO, format } from "date-fns";
import { motion } from "framer-motion";
import { convertTo12HourFormat } from "@/app/utils/convert-to-12hrs-format";
import { DateItem } from "@/types";
import { useEffect, useCallback } from "react";

type TimeSlotSelectorProps = {
  selectedDate: DateItem | null;
  selectedSlot: string;
  visibleSlots: number;
  onTimeClick: (slot: string) => void;
  onShowMore: () => void;
  loading?: boolean;
};

export function TimeSlotSelector({
  selectedDate,
  selectedSlot,
  visibleSlots,
  onTimeClick,
  onShowMore,
  loading = false,
}: TimeSlotSelectorProps) {
  const theme = useTheme();

  // Handle keyboard navigation for slots
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!selectedDate || selectedDate.slots.length === 0) return;
      const slots = selectedDate.slots.slice(0, visibleSlots);
      const currentIndex = slots.indexOf(selectedSlot);

      if (e.key === "ArrowRight" && currentIndex < slots.length - 1) {
        onTimeClick(slots[currentIndex + 1]);
      } else if (e.key === "ArrowLeft" && currentIndex > 0) {
        onTimeClick(slots[currentIndex - 1]);
      }
    },
    [selectedDate, selectedSlot, visibleSlots, onTimeClick]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!selectedDate) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="text.secondary">
          Select a date to view available slots.
        </Typography>
      </Box>
    );
  }

  const slots = selectedDate.slots ?? [];

  return (
    <Box textAlign="center" mb={4}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ my: 2, fontWeight: 600, color: theme.palette.text.primary }}
      >
        Time slots for{" "}
        <strong>{format(parseISO(selectedDate.date), "PPPP")}</strong>
      </Typography>

      {loading ? (
        <Box sx={{ py: 4 }}>
          <CircularProgress />
        </Box>
      ) : slots.length > 0 ? (
        <>
          <Grid2
            container
            spacing={2}
            justifyContent="center"
            sx={{
              px: { xs: 1, sm: 3 },
              rowGap: 2,
              columnGap: 2,
            }}
          >
            {slots.slice(0, visibleSlots).map((slot) => {
              const selected = selectedSlot === slot;
              return (
                <Grid2
                  key={slot}
                  sx={{ flex: "0 0 auto", textAlign: "center" }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Chip
                      label={convertTo12HourFormat(slot)}
                      onClick={() => onTimeClick(slot)}
                      sx={{
                        px: 2,
                        py: 1,
                        minWidth: 110,
                        fontWeight: 600,
                        borderRadius: "20px",
                        transition: "all 0.25s ease",
                        cursor: "pointer",
                        backgroundColor: selected
                          ? alpha(theme.palette.primary.main, 0.9)
                          : alpha(theme.palette.primary.main, 0.12),
                        color: selected
                          ? theme.palette.common.white
                          : theme.palette.text.primary,
                        boxShadow: selected
                          ? `0 0 10px ${alpha(theme.palette.primary.main, 0.4)}`
                          : "none",
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            selected ? 1 : 0.25
                          ),
                        },
                      }}
                    />
                  </motion.div>
                </Grid2>
              );
            })}
          </Grid2>

          {visibleSlots < slots.length && (
            <Box mt={3}>
              <Button
                variant="outlined"
                onClick={onShowMore}
                sx={{
                  borderRadius: "9999px",
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  textTransform: "none",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    borderColor: alpha(theme.palette.primary.main, 0.4),
                  },
                }}
              >
                Show More
              </Button>
            </Box>
          )}
        </>
      ) : (
        <Typography sx={{ mt: 2 }} color="text.secondary">
          No available time slots for this date.
        </Typography>
      )}
    </Box>
  );
}
