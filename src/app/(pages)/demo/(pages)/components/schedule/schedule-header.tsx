// app/component/schedule/ScheduleHeader.tsx
import { DialogTitle, IconButton, Typography, Box } from "@mui/material";
import Close from "@/app/icons/untitled-ui/duocolor/close";

type ScheduleHeaderProps = {
  onClose: () => void;
};

export default function ScheduleHeader({ onClose }: ScheduleHeaderProps) {
  return (
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
  );
}
