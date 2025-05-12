"use client";

import { useActionState, useEffect, useState } from "react";
import { Box, TextField, Typography, Stack, Paper } from "@mui/material";
import { SubmitButton } from "@/app/component/submit-buttton";
import { ActionStateType } from "@/types";
import { agentSignUp } from "@/app/actions/server-actions";

type AgentSignupFormProps = {
  email: string;
  formId: string;
};

const initialValue: ActionStateType = null;

export default function AgentSignupForm({
  email,
  formId,
}: AgentSignupFormProps) {
  const [state, formAction] = useActionState(agentSignUp, initialValue);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (state) {
      if (state?.error) setMessage(state.error);
    }
  }, [state]);
  return (
    <Box sx={{ mt: 8}} p={4} maxWidth="600px" mx="auto">
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight="bold" mb={2}>
          Agent Signup
        </Typography>
        <form action={formAction}>
          <Stack spacing={3}>
            {message && (
              <Typography
                variant="subtitle2"
                color="error"
                textAlign={"center"}
              >
                {message}
              </Typography>
            )}
            <input name="formId" defaultValue={formId} hidden />
            <TextField
              variant="outlined"
              name="email"
              label="Email"
              defaultValue={email}
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              fullWidth
            />
            <TextField
              variant="outlined"
              name="firstName"
              type="text"
              label="First Name"
              fullWidth
              required
            />
            <TextField
              variant="outlined"
              name="lastName"
              type="text"
              label="Last Name"
              fullWidth
              required
            />
            <TextField
              variant="outlined"
              type="tel"
              label="Phone Number"
              name="phone"
              fullWidth
              required
            />
            <TextField
              variant="outlined"
              type="text"
              label="License Number"
              name="licenseNumber"
              fullWidth
              required
            />
            <TextField
              variant="outlined"
              type="password"
              label="Password"
              name="password"
              fullWidth
              required
            />
            <TextField
              variant="outlined"
              type="password"
              label="Confirm Password"
              name="cPassword"
              fullWidth
              required
            />
            <SubmitButton title={"Submit"} isFullWidth={true} />
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
