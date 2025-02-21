"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Link,
} from "@mui/material";

const AccountSettings = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation for password match
    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      setErrors({
        newPassword: "Passwords do not match",
        confirmPassword: "Passwords do not match",
      });
      return;
    }

    // Clear errors & submit data
    setErrors({ newPassword: "", confirmPassword: "" });
    console.log("Updated Account Info:", formData);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Account Settings
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        {/* Personal Information */}
        <Typography variant="h6">Personal Information</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        {/* Change Password */}
        <Typography variant="h6" sx={{ mt: 3 }}>
          Change Password
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Current Password"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="New Password"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              error={!!errors.newPassword}
              helperText={errors.newPassword}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
          </Grid>
        </Grid>

        {/* Forgot Password & Save Changes */}
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <Link href="/forgot-password" underline="hover">
            Forgot Password?
          </Link>
          <Button type="submit" variant="contained">
            Save Changes
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AccountSettings;
