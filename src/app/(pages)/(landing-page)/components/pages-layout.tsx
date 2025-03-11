"use client";

import CustomTheme from "@/app/component/custom-theme";
import { Box, Container, Toolbar, Typography } from "@mui/material";
import Image from "next/image";
import React, { ReactNode } from "react";
import Footer from "./footer";

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
        {/* Navbar with Logo and Name */}
        <Box sx={{ bgcolor: "white", py: 2 }}>
          <Container maxWidth="lg">
            <Toolbar sx={{ justifyContent: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Image
                  src="/images/logo.png" // Replace with your logo path
                  alt="Company Logo"
                  width={40}
                  height={40}
                />
                <Typography
                  variant="h6"
                  component="div"
                  color="textPrimary"
                  sx={{ ml: 2, fontWeight: 700 }}
                >
                  iAgents
                </Typography>
              </Box>
            </Toolbar>
          </Container>
        </Box>

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
