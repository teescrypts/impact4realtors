"use client";

import { demoLogin } from "@/app/actions/server-actions";
import { SubmitButton } from "@/app/component/submit-buttton";
import { Box, Grid2, TextField, Typography } from "@mui/material";
import React, { useActionState, useEffect, useState } from "react";

const initialValue = null;

function DemoLogin() {
  const [state, formAction] = useActionState(demoLogin, initialValue);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (state?.error) setMessage(state.error);
  }, [state]);

  return (
    <form action={formAction}>
      <Box
        sx={{
          mt: 1,
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "#f7f7f7",
        }}
      >
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12 }}>
            <Typography variant="subtitle2" color="error" textAlign={"center"}>
              {message}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <TextField
              required
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              variant="outlined"
              sx={{ backgroundColor: "white", borderRadius: 1 }}
            />
          </Grid2>
        </Grid2>
        <SubmitButton title="LOGIN" isFullWidth={true} />
      </Box>
    </form>
  );
}

export default DemoLogin;
