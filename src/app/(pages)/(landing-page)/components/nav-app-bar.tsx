"use client";

import { AppBar, useTheme } from "@mui/material";
import React, { ReactNode } from "react";

function NavAppBar({ children }: { children: ReactNode }) {
  const theme = useTheme();

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: theme.palette.background.paper }}
    >
      {children}
    </AppBar>
  );
}

export default NavAppBar;
