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
import { SubmitButton } from "@/app/component/submit-buttton";
import { login } from "@/app/actions/server-actions";

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
      <form action={login}>
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
          <SubmitButton title="LOGIN" isFullWidth={true} />
        </Box>
      </form>
    </Container>
  );
};

export default RealtorLogin;
