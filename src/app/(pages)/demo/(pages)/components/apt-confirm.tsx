import React from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  Modal,
  Divider,
  SvgIcon,
} from "@mui/material";
import { format, parse } from "date-fns";
import CheckCircle from "@/app/icons/untitled-ui/duocolor/checked-circle";
import { AppointmentData } from "@/types";

interface AppointmentSuccessModalProps {
  open: boolean;
  onClose: () => void;
  aptData: AppointmentData | null;
}

const AppointmentSuccessModal: React.FC<AppointmentSuccessModalProps> = ({
  open,
  onClose,
  aptData,
}) => {
  if (!aptData?.date || !aptData?.bookedTime?.from) return null;

  // Format date and time
  const formattedDate = format(new Date(aptData.date), "EEEE, MMMM d, yyyy");
  const parsedTime = parse(aptData.bookedTime.from, "HH:mm", new Date());
  const formattedTime = format(parsedTime, "h:mm a");

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="appointment-success-modal"
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: 4,
          boxShadow: 8,
          width: "90%",
          maxWidth: 420,
          p: 4,
          textAlign: "center",
          outline: "none",
        }}
      >
        <SvgIcon color="success" sx={{ fontSize: 64, mb: 2 }}>
          <CheckCircle />
        </SvgIcon>

        <Typography variant="h5" fontWeight={700} gutterBottom>
          Appointment Booked Successfully 🎉
        </Typography>

        <Typography variant="body1" color="text.secondary" mb={3}>
          Your call with our real estate agent has been scheduled. We look
          forward to speaking with you!
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Stack spacing={1} mb={3}>
          <Typography variant="body1">
            <strong>Date:</strong> {formattedDate}
          </Typography>
          <Typography variant="body1">
            <strong>Time:</strong> {formattedTime}
          </Typography>
        </Stack>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={onClose}
          sx={{ borderRadius: 2, textTransform: "none", py: 1.2 }}
        >
          Okay, got it
        </Button>
      </Box>
    </Modal>
  );
};

export default AppointmentSuccessModal;
