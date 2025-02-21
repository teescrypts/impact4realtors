"use client";

import { Button, CircularProgress, Box } from "@mui/material";
import { ReactNode } from "react";
import { useFormStatus } from "react-dom";

export function SubmitButton({
  title,
  isFullWidth,
  icon,
}: {
  title: string;
  isFullWidth: boolean;
  icon?: ReactNode;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      type="submit"
      fullWidth={isFullWidth}
      variant="contained"
      startIcon={!pending ? icon : undefined}
      sx={{
        position: "relative",
        minWidth: "120px", // Ensures consistent width
        height: "40px",
        my: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          position: "absolute",
          opacity: pending ? 0 : 1,
          transition: "opacity 0.2s ease-in-out",
        }}
      >
        {title}
      </Box>
      {pending && <CircularProgress size={24} />}
    </Button>
  );
}
