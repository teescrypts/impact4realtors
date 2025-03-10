"use client";

import { useUserData } from "@/app/guards/auth-guard";
import {
  Box,
  Button,
  Container,
  Grid2,
  TextField,
  Typography,
} from "@mui/material";

const AccountSettings = () => {
  const { fname, lname, email } = useUserData();

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Account Settings
      </Typography>

      <Box sx={{ mt: 3 }}>
        {/* Personal Information */}
        <Typography variant="h6" sx={{ my: 2 }}>
          Personal Information
        </Typography>
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12 }}>
            <TextField
              variant="outlined"
              fullWidth
              label="Full Name"
              name="fullName"
              defaultValue={fname}
            />
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <TextField
              variant="outlined"
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              defaultValue={lname}
            />
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <TextField
              variant="outlined"
              fullWidth
              label="Phone Number"
              name="phone"
              defaultValue={email}
            />
          </Grid2>
        </Grid2>

        {/* Change Password */}
        <Typography variant="h6" sx={{ mt: 3 }}>
          Change Password
        </Typography>
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12 }}>
            <TextField
              variant="outlined"
              fullWidth
              label="Current Password"
              name="currentPassword"
              type="password"
            />
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <TextField
              variant="outlined"
              fullWidth
              label="New Password"
              name="newPassword"
              type="password"
            />
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <TextField
              variant="outlined"
              fullWidth
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
            />
          </Grid2>
        </Grid2>

        {/* Forgot Password & Save Changes */}
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <Button
            size="small"
            onClick={() =>
              alert("The account update feature is not available in this demo.")
            }
          >
            Forgot password
          </Button>
          <Button
            variant="contained"
            onClick={() =>
              alert("The account update feature is not available in this demo.")
            }
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AccountSettings;
