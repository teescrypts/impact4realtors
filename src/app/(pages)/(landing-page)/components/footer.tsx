"use client";

import { Box, Container, Typography } from "@mui/material";
import Image from "next/image";

const Footer = () => {
  return (
    <Box sx={{ bgcolor: "white", py: 3, borderTop: "1px solid #ddd" }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          {/* Logo */}
          <Image
            src="/images/logo.png" // Replace with your logo path
            alt="Company Logo"
            width={40}
            height={40}
          />

          {/* Text */}
          <Typography variant="body2" color="textSecondary">
            This demo was developed by <strong>Impact Illustration</strong>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
