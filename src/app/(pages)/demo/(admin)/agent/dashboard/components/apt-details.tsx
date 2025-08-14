"use client";

import { updateAptStatus } from "@/app/actions/server-actions";
import { convertToAmPmFormat } from "@/app/utils/convert-to-am-pm";
import { formatCreatedAt } from "@/app/utils/format-created-at";
import notify from "@/app/utils/toast";
import { AppointmentResponse } from "@/types";
import { Box, Paper, Typography, Button } from "@mui/material";
import React, { useCallback, useState } from "react";
import RescheduleAppointmentModal from "./reschedule-apt";
import ConfirmationModal from "./confirmation-modal";

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

  return (
    <div>
      {" "}
      <Box>
        <Paper
          sx={{
            p: 2,
            mb: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            {appt.type === "house_touring"
              ? "House Touring Appointment"
              : "Call Appointment"}
          </Typography>
          <Typography variant="body2">
            {formatCreatedAt(appt.date)} at{" "}
            {convertToAmPmFormat(appt.bookedTime.from)}
          </Typography>
          {appt.reschedule?.isRescheduled && (
            <Typography variant="body2" color="warning.main">
              Rescheduled {appt.reschedule.previousDates.length} times
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            Status: {appt.status}
          </Typography>

          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" fontWeight="bold">
              Customer Detais
            </Typography>
            <Typography variant="body2">{`${appt.customer.firstName} ${appt.customer.lastName}`}</Typography>
            <Typography variant="body2">{appt.customer.email}</Typography>
            <Typography variant="body2">{appt.customer.phone}</Typography>
          </Box>

          {/* House Tour Details */}
          {appt.type === "house_touring" && appt.propertyId && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" fontWeight="bold">
                Property: {appt.propertyId.propertyTitle}
              </Typography>
              <Typography variant="body2">
                Price: ${appt.propertyId.price.toLocaleString()}
              </Typography>
              <Typography variant="body2">
                {appt.propertyId.bedrooms} Beds | {appt.propertyId.bathrooms}{" "}
                Baths | {appt.propertyId.squareMeters} m²
              </Typography>
              <Typography variant="body2">
                Location: {appt.propertyId.location.addressLine1},{" "}
                {appt.propertyId.location.cityName},{" "}
                {appt.propertyId.location.stateName},{" "}
                {appt.propertyId.location.countryName}
              </Typography>
            </Box>
          )}

          {/* Call Reason Details */}
          {appt.type === "call" && appt.callReason && (
            <Typography variant="body2">
              Call Reason: {appt.callReason}
            </Typography>
          )}

          <Box sx={{ mt: 2 }}>
            {appt.status !== "completed" && appt.status !== "cancelled" && (
              <Button
                disabled={updating}
                onClick={async () => {
                  setUpdating(true);
                  const result = await updateAptStatus("completed", appt._id);

                  if (result?.error) setMessage(result.error);
                  if (result?.message) notify(result.message);
                  setUpdating(false);
                }}
                sx={{ mr: 1 }}
              >
                Mark as Completed
              </Button>
            )}
            {(appt.status === "upcoming" || appt.status === "rescheduled") && (
              <Button
                color="error"
                disabled={updating}
                onClick={() => {
                  setSelectedApt(appt);
                  handleOpen();
                }}
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
            )}

            {appt.status !== "completed" && appt.status !== "cancelled" && (
              <Button
                disabled={updating}
                color="primary"
                onClick={() => {
                  setType(appt.type);
                  setOpen(true);
                  setCustomer(
                    `${appt.customer.firstName} ${appt.customer.lastName}`
                  );
                  setCurrentDate(
                    `${formatCreatedAt(appt.date)} at ${convertToAmPmFormat(
                      appt.bookedTime.from
                    )}`
                  );
                  setCurrentAptId(appt._id);
                }}
              >
                Reschedule
              </Button>
            )}
          </Box>
        </Paper>

        {message && (
          <Typography variant="subtitle2" color="error" textAlign={"center"}>
            {message}
          </Typography>
        )}

        {type && (
          <RescheduleAppointmentModal
            open={open}
            onClose={() => setOpen(false)}
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
