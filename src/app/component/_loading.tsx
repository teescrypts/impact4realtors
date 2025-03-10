import React from "react";
import { CircularProgress, Box, Typography } from "@mui/material";

const LoadingComponent = ({ message = "Loading..." }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <CircularProgress color="primary" />
      <Typography variant="body1" mt={2} color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingComponent;
