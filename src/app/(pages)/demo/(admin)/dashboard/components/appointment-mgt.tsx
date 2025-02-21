"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

const initialAppointments = [
  {
    id: "1",
    name: "John Doe",
    date: "2025-02-10",
    time: "10:00 AM",
    status: "Upcoming",
  },
  {
    id: "2",
    name: "Jane Smith",
    date: "2025-02-12",
    time: "02:30 PM",
    status: "Completed",
  },
  {
    id: "3",
    name: "Michael Brown",
    date: "2025-02-15",
    time: "11:00 AM",
    status: "Canceled",
  },
];

export default function AppointmentManagement() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [filter, setFilter] = useState("All");

  const handleStatusChange = (id: string, newStatus: string) => {
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === id ? { ...appt, status: newStatus } : appt
      )
    );
  };

  const filteredAppointments =
    filter === "All"
      ? appointments
      : appointments.filter((appt) => appt.status === filter);

  return (
    <Box sx={{ p: 3 }}>
      {/* Filter Options */}
      <FormControl sx={{ mt: 2, mb: 2, minWidth: 200 }}>
        <InputLabel>Filter by Status</InputLabel>
        <Select
          variant="outlined"
          value={filter}
          label={"Filter by Status"}
          onChange={(e) => setFilter(e.target.value)}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Upcoming">Upcoming</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
          <MenuItem value="Canceled">Canceled</MenuItem>
        </Select>
      </FormControl>

      {/* Appointment List */}
      {filteredAppointments.map((appt) => (
        <Paper
          key={appt.id}
          sx={{
            p: 2,
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {appt.name}
            </Typography>
            <Typography variant="body2">
              {appt.date} at {appt.time}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Status: {appt.status}
            </Typography>
          </Box>
          <Box>
            {appt.status !== "Completed" && (
              <Button
                onClick={() => handleStatusChange(appt.id, "Completed")}
                sx={{ mr: 1 }}
              >
                Mark as Completed
              </Button>
            )}
            {appt.status !== "Canceled" && (
              <Button
                color="error"
                onClick={() => handleStatusChange(appt.id, "Canceled")}
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
            )}
            {appt.status === "Upcoming" && (
              <Button
                color="primary"
                onClick={() => handleStatusChange(appt.id, "Rescheduled")}
              >
                Reschedule
              </Button>
            )}
          </Box>
        </Paper>
      ))}
    </Box>
  );
}
