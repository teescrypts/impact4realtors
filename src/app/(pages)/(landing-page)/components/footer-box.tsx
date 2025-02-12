"use client";

import { Box, useTheme } from "@mui/material";
import React, { ReactNode } from "react";

function FooterBox({ children }: { children: ReactNode }) {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        py: 4,
        mt: "auto",
      }}
    >
      {children}
    </Box>
  );
}

export default FooterBox;
