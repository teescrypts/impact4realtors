import React from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
} from "@mui/material";
import Motion from "./motion";

const RealtorLogin = () => {
  return (
    <Container
      maxWidth="xs"
      sx={{ mt: 8, mb: 8, fontFamily: "Poppins, sans-serif" }}
    >
      <Motion>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight="bold">
            Realtor Login
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Sign in to access your dashboard.
          </Typography>
        </Box>
      </Motion>
      <Box
        sx={{
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "#f7f7f7",
        }}
      >
        <TextField
          required
          fullWidth
          label="Email Address"
          name="email"
          type="email"
          margin="normal"
          variant="outlined"
          sx={{ backgroundColor: "white", borderRadius: 1 }}
        />
        <TextField
          required
          fullWidth
          label="Password"
          name="password"
          type="password"
          margin="normal"
          variant="outlined"
          sx={{ backgroundColor: "white", borderRadius: 1 }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2, py: 1.5 }}
        >
          Login
        </Button>
        <Typography variant="body2" align="center">
          Don't have an account?{" "}
          <Link href="/register" underline="hover">
            Sign Up
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default RealtorLogin;
