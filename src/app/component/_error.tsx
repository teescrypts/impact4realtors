"use client"

import React from "react";
import { Box, Button, Alert } from "@mui/material";

interface ErrorComponentProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({
  message = "An unexpected error occurred.",
  onRetry,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      p={2}
    >
      <Alert severity="error">{message}</Alert>
      {onRetry && (
        <Button variant="contained" color="primary" onClick={onRetry}>
          Retry
        </Button>
      )}
    </Box>
  );
};

export default ErrorComponent;
