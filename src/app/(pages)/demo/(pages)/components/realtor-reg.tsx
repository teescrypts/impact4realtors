import React from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Link,
} from "@mui/material";
import Motion from "./motion";

function RealtorRegistration({ token }: { token: string }) {
  console.log(token);
  return (
    <Container
      maxWidth="sm"
      sx={{ mt: 8, mb: 8, fontFamily: "Poppins, sans-serif" }}
    >
      <Motion>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight="bold">
            Create Your Account
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Register to access your dashboard and manage your listings.
          </Typography>
        </Box>
      </Motion>
      <Box
        sx={{
          mt: 1,
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "#f7f7f7",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Full Name"
              name="fullName"
              variant="outlined"
              sx={{ backgroundColor: "white", borderRadius: 1 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              variant="outlined"
              sx={{ backgroundColor: "white", borderRadius: 1 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Phone Number"
              name="phone"
              variant="outlined"
              sx={{ backgroundColor: "white", borderRadius: 1 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="License Number"
              name="licenseNumber"
              variant="outlined"
              sx={{ backgroundColor: "white", borderRadius: 1 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              sx={{ backgroundColor: "white", borderRadius: 1 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              variant="outlined"
              sx={{ backgroundColor: "white", borderRadius: 1 }}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, py: 1.5 }}
        >
          Sign Up
        </Button>
        <Typography variant="body2" align="center">
          Already have an account?{" "}
          <Link href="/login" underline="hover">
            Log in
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default RealtorRegistration;
