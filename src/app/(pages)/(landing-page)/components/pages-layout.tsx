"use client";

import CustomTheme from "@/app/component/custom-theme";
import { Box } from "@mui/material";
import React, { ReactNode } from "react";
import Footer from "./footer";
import LandingNavbar from "./landing-navbar";

function PagesLayout({ children }: { children: ReactNode }) {
  return (
    <CustomTheme>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {/* Navbar with logo, features dropdown, pricing and about */}
        <LandingNavbar />

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1 }}>
          {children}
        </Box>
        <Footer />
      </Box>
    </CustomTheme>
  );
}

export default PagesLayout;
