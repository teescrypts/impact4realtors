import ChevronLeft from "@/app/icons/untitled-ui/duocolor/chevron-left";
import ChevronRight from "@/app/icons/untitled-ui/duocolor/chevron-right";
import {
  useMediaQuery,
  Stack,
  Typography,
  IconButton,
  SvgIcon,
  Button,
  TextField,
  Theme,
} from "@mui/material";
import { useCallback, useMemo } from "react";
import dayjs from "dayjs";

const viewOptions = [
  { label: "Month", value: "dayGridMonth" },
  { label: "Week", value: "timeGridWeek" },
  { label: "Day", value: "timeGridDay" },
  // { label: "Agenda", value: "listWeek" },
];

type PropTypes = {
  date: Date;
  onDateToday: () => void;
  onDatePrev: () => void;
  onDateNext: () => void;
  onViewChange: (view: string) => void;
  view: string;
};

export const CalendarToolbar = (props: PropTypes) => {
  const {
    date,
    onDateNext,
    onDatePrev,
    onDateToday,
    onViewChange,
    view,
    ...other
  } = props;
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));

  const handleViewChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onViewChange?.(event.target.value);
    },
    [onViewChange]
  );

  const dateMonth = dayjs(date).format("MMMM");
  const dateYear = dayjs(date).format("YYYY");

  const availableViewOptions = useMemo(() => {
    return mdUp
      ? viewOptions
      : viewOptions.filter((option) =>
          ["timeGridDay", "listWeek"].includes(option.value)
        );
  }, [mdUp]);

  return (
    <Stack
      alignItems="center"
      flexWrap="wrap"
      justifyContent="space-between"
      flexDirection={{ xs: "column", md: "row" }}
      spacing={3}
      sx={{ px: 3, py: 2, borderRadius: 2, boxShadow: 1 }}
      {...other}
    >
      {/* Left - Date */}
      <Stack alignItems="center" direction="row" spacing={1}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {dateMonth}
        </Typography>
        <Typography sx={{ fontWeight: 400 }} variant="h5">
          {dateYear}
        </Typography>
      </Stack>

      {/* Right - Controls */}
      <Stack alignItems="center" direction="row" spacing={2}>
        {/* Date Navigation */}
        <IconButton
          onClick={onDatePrev}
          sx={{ borderRadius: "8px", border: "1px solid #ddd" }}
        >
          <SvgIcon>
            <ChevronLeft />
          </SvgIcon>
        </IconButton>
        <Button
          variant="contained"
          color="primary"
          onClick={onDateToday}
          sx={{ borderRadius: "8px", fontWeight: 600 }}
        >
          TODAY
        </Button>
        <IconButton
          onClick={onDateNext}
          sx={{ borderRadius: "8px", border: "1px solid #ddd" }}
        >
          <SvgIcon>
            <ChevronRight />
          </SvgIcon>
        </IconButton>

        {/* View Selector */}
        <TextField
          label="View"
          name="view"
          onChange={handleViewChange}
          select
          variant="outlined"
          slotProps={{ select: { native: true } }}
          size="small"
          sx={{
            minWidth: 140,
            "& .MuiOutlinedInput-root": { borderRadius: "8px" },
            order: { xs: -1, md: 0 },
          }}
          value={view}
        >
          {availableViewOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
      </Stack>
    </Stack>
  );
};
