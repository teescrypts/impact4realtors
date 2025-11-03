"use client";

import { updateAptStatus } from "@/app/actions/server-actions";
import { convertToAmPmFormat } from "@/app/utils/convert-to-am-pm";
import { formatCreatedAt } from "@/app/utils/format-created-at";
import notify from "@/app/utils/toast";
import { AppointmentResponse } from "@/types";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  SvgIcon,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import RescheduleAppointmentModal from "./reschedule-apt";
import ConfirmationModal from "./confirmation-modal";
import HomeSmile from "@/app/icons/untitled-ui/duocolor/home-smile";
import Call from "@/app/icons/untitled-ui/duocolor/call";
import EventAvailable from "@/app/icons/untitled-ui/duocolor/event-available";

function AptDetails({ appt }: { appt: AppointmentResponse }) {
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedApt, setSelectedApt] = useState<AppointmentResponse | null>(
    null
  );
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"call" | "house_touring">();
  const [customer, setCustomer] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [currentAptId, setCurrentAptId] = useState("");

  const [openConfirm, setOpenConfirm] = useState(false);
  const handleOpen = () => setOpenConfirm(true);
  const handleClose = () => setOpenConfirm(false);

  const handleCanceleBooking = useCallback((appt: AppointmentResponse) => {
    setUpdating(true);
    updateAptStatus("cancelled", appt._id).then((result) => {
      if (result?.error) {
        setMessage(result.error);
        setUpdating(false);
        handleClose();
      }
      if (result?.message) {
        notify(result.message);
        setUpdating(false);
        handleClose();
      }
    });
  }, []);

  const icon =
    appt.type === "house_touring" ? (
      <HomeSmile color="primary" />
    ) : (
      <Call color="primary" />
    );

  const formattedDate = formatCreatedAt(appt.date);
  const formattedTime = convertToAmPmFormat(appt.bookedTime.from);

  const statusColor =
    appt.status === "completed"
      ? "success"
      : appt.status === "cancelled"
      ? "error"
      : "info";

  return (
    <div>
      {" "}
      <Box>
        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            boxShadow: 2,
            mb: 2,
            transition: "0.3s ease",
            "&:hover": { boxShadow: 5, transform: "translateY(-2px)" },
          }}
        >
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
              {icon}
              <Typography variant="subtitle1" fontWeight={700}>
                {appt.type === "house_touring"
                  ? "House Touring Appointment"
                  : "Call Appointment"}
              </Typography>
              <Chip
                label={appt.status.toUpperCase()}
                color={statusColor}
                size="small"
                sx={{ ml: "auto", fontWeight: 600 }}
              />
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
              <SvgIcon sx={{ fontSize: 18, color: "text.secondary" }}>
                <EventAvailable />
              </SvgIcon>

              <Typography variant="body2" color="text.secondary">
                {formattedDate} at {formattedTime}
              </Typography>
            </Stack>

            {appt.reschedule?.isRescheduled && (
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <SvgIcon sx={{ fontSize: 18, color: "warning.main" }}>
                  <EventAvailable />
                </SvgIcon>

                <Typography variant="body2" color="warning.main">
                  Rescheduled {appt.reschedule.previousDates.length} times
                </Typography>
              </Stack>
            )}

            <Divider sx={{ my: 1.5 }} />

            {/* Customer Info */}
            <Typography variant="subtitle2" fontWeight={600}>
              Customer Details
            </Typography>
            <Typography variant="body2">
              {appt.customer.firstName} {appt.customer.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {appt.customer.email}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={1}>
              {appt.customer.phone}
            </Typography>

            {/* Property Details */}
            {appt.type === "house_touring" && appt.propertyId && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Property Details
                </Typography>
                <Typography variant="body2">
                  {appt.propertyId.propertyTitle}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Price: ${appt.propertyId.price.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {appt.propertyId.bedrooms} Beds • {appt.propertyId.bathrooms}{" "}
                  Baths • {appt.propertyId.squareMeters} m²
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {appt.propertyId.location.addressLine1},{" "}
                  {appt.propertyId.location.cityName},{" "}
                  {appt.propertyId.location.stateName},{" "}
                  {appt.propertyId.location.countryName}
                </Typography>
              </Box>
            )}

            {/* Call Reason */}
            {appt.type === "call" && appt.callReason && (
              <Typography variant="body2" mt={1}>
                <strong>Call Reason:</strong> {appt.callReason}
              </Typography>
            )}

            {/* Actions */}
            <Stack direction="row" spacing={1.5} mt={2}>
              {appt.status !== "completed" && appt.status !== "cancelled" && (
                <Button
                  variant="contained"
                  color="success"
                  disabled={updating}
                  onClick={async () => {
                    const result = await updateAptStatus("completed", appt._id);
                    if (result?.error) setMessage(result.error);
                    if (result?.message) notify(result.message);
                  }}
                >
                  Mark as Completed
                </Button>
              )}
              {(appt.status === "upcoming" ||
                appt.status === "rescheduled") && (
                <Button
                  color="error"
                  variant="outlined"
                  disabled={updating}
                  onClick={() => {
                    setSelectedApt(appt);
                    handleOpen();
                  }}
                >
                  Cancel
                </Button>
              )}
              {appt.status !== "completed" && appt.status !== "cancelled" && (
                <Button
                  color="primary"
                  variant="outlined"
                  disabled={updating}
                  onClick={() => {
                    setType(appt.type);
                    setOpen(true);
                    setCustomer(
                      `${appt.customer.firstName} ${appt.customer.lastName}`
                    );
                    setCurrentDate(`${formattedDate} at ${formattedTime}`);
                    setCurrentAptId(appt._id);
                  }}
                >
                  Reschedule
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>

        {message && (
          <Typography variant="subtitle2" color="error" textAlign={"center"}>
            {message}
          </Typography>
        )}

        {type && (
          <RescheduleAppointmentModal
            open={open}
            onClose={() => {
              setOpen(false);
              setType(undefined);
              setCustomer("");
              setCurrentDate("");
              setCurrentAptId("");
            }}
            type={type}
            customer={customer}
            currentDate={currentDate}
            currentAptId={currentAptId}
          />
        )}

        {selectedApt && (
          <ConfirmationModal
            open={openConfirm}
            message="Are you sure you want to cancel this appointment?"
            confirmText="Yes, Cancel"
            onClose={handleClose}
            loading={updating}
            cancelText="No, don't cancel"
            onConfirm={() => handleCanceleBooking(selectedApt)}
          />
        )}
      </Box>
    </div>
  );
}

export default AptDetails;
