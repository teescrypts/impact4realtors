"use client";

import { Box, Container, Typography } from "@mui/material";
import Image from "next/image";

const Footer = () => {
  return (
    <Box
      sx={{
        py: 3,
        borderTop: "1px solid",
        borderColor: "divider",
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          {/* Logo + Brand */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Image
              src="/images/logo.png"
              alt="Company Logo"
              width={32}
              height={32}
              style={{ borderRadius: 6 }}
            />
            <Typography
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "text.primary",
              }}
            >
              Impact Illustration
            </Typography>
          </Box>

          {/* Copyright */}
          <Typography sx={{ fontSize: "0.8rem", color: "text.disabled" }}>
            © {new Date().getFullYear()} All rights reserved.
          </Typography>

          {/* Powered-by pill */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              px: 1.5,
              py: 0.5,
              borderRadius: "20px",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: "success.main",
                animation: "pulse 2s ease-in-out infinite",
                "@keyframes pulse": {
                  "0%, 100%": { opacity: 1, transform: "scale(1)" },
                  "50%": { opacity: 0.4, transform: "scale(0.7)" },
                },
              }}
            />
            <Typography
              sx={{
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "text.secondary",
              }}
            >
              Powered by{" "}
              <Box
                component="span"
                sx={{ fontWeight: 700, color: "primary.main" }}
              >
                Impact Illustration
              </Box>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
