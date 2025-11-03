// app/component/schedule/DateHeader.tsx
import { Box, Typography, Alert, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { format, parseISO } from "date-fns";
import { DateItem } from "@/types";

type DateHeaderProps = {
  dates: DateItem[];
  currentIndex: number;
  fullZoneName: string | null;
  offset?: string;
  headingText?: string;
};

export function DateHeader({
  dates,
  currentIndex,
  fullZoneName,
  offset,
  headingText = "Select Date",
}: DateHeaderProps) {
  const theme = useTheme();
  const currentDate = dates[currentIndex];

  if (!currentDate) return null;

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: "blur(8px)",
        boxShadow: `0 2px 10px ${alpha(theme.palette.primary.main, 0.05)}`,
        textAlign: "center",
      }}
    >
      {/* Heading */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 2,
          color: theme.palette.text.primary,
        }}
      >
        {headingText}
      </Typography>

      {/* Timezone Info (Centered Alert) */}
      {fullZoneName && (
        <Alert
          severity="info"
          sx={{
            mb: 3,
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.info.light, 0.1),
            color: theme.palette.info.dark,
            "& .MuiAlert-icon": { color: theme.palette.info.main },
            "& .MuiAlert-message": {
              width: "100%",
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
            },
          }}
        >
          <Typography variant="body2" component="div">
            You’re booking in{" "}
            <strong>
              {fullZoneName} {offset ? `(${offset})` : ""}
            </strong>
            .
          </Typography>
        </Alert>
      )}

      {/* Current Month & Year */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: alpha(theme.palette.text.primary, 0.9),
        }}
      >
        {format(parseISO(currentDate.date), "MMMM yyyy")}
      </Typography>
    </Box>
  );
}
