"use client";

import { demoLogin } from "@/app/actions/server-actions";
import { SubmitButton } from "@/app/component/submit-buttton";
import { ActionStateType } from "@/types";
import { Card, Grid2, TextField, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import React, { useActionState, useEffect, useState } from "react";

const initialValue: ActionStateType = null;

function DemoLogin() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const [state, formAction] = useActionState(demoLogin, initialValue);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (state) {
      if (state?.error) setMessage(state.error);
    }
  }, [state]);

  if (!type) throw new Error("Invalid operation");

  return (
    <form action={formAction}>
      <Card
        sx={{
          mt: 1,
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12 }}>
            <Typography variant="subtitle2" color="error" textAlign={"center"}>
              {message}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <input hidden defaultValue={type} name="type" />
            <TextField
              required
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              variant="outlined"
              sx={{ borderRadius: 1 }}
            />
          </Grid2>
        </Grid2>
        <SubmitButton title="LOGIN" isFullWidth={true} />
      </Card>
    </form>
  );
}

export default DemoLogin;
