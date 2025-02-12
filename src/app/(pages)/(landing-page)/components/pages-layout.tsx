import CustomTheme from "@/app/component/custom-theme";
import {
  Box,
  Button,
  Container,
  Link,
  Toolbar,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React, { ReactNode } from "react";
import NavAppBar from "./nav-app-bar";
import FooterBox from "./footer-box";

function PagesLayout({ children }: { children: ReactNode }) {
  return (
    <CustomTheme colorPreset="blue">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {/* Navbar */}
        <NavAppBar>
          <Container maxWidth="lg">
            <Toolbar sx={{ justifyContent: "space-between" }}>
              {/* Logo */}
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
                  sx={{
                    ml: 2,
                  }}
                >
                  Realtor Demo
                </Typography>
              </Box>

              {/* Navigation Links */}
              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 4 }}>
                <Link href="/" color="primary" underline="none">
                  <Typography variant="h6">Home</Typography>
                </Link>
                <Link href="/demo" color="primary" underline="none">
                  <Typography variant="h6">Demo</Typography>
                </Link>
                <Link href="/contact" color="primary" underline="none">
                  <Typography variant="h6">Contact</Typography>
                </Link>
              </Box>

              {/* CTA Button */}
              <Button variant="contained">Get Started</Button>
            </Toolbar>
          </Container>
        </NavAppBar>

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1 }}>
          {children}
        </Box>

        {/* Footer */}
        <FooterBox>
          <Container maxWidth="lg">
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
              }}
            >
              {/* Footer Logo and Text */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Image
                  src="/images/logo.png" // Replace with your logo path
                  alt="Company Logo"
                  width={30}
                  height={30}
                />
                <Typography
                  variant="body1"
                  sx={{
                    ml: 2,
                  }}
                >
                  Realtor Demo
                </Typography>
              </Box>

              {/* Footer Links */}
              <Box sx={{ display: "flex", gap: 4 }}>
                <Link href="/privacy" color="inherit" underline="none">
                  <Typography>Privacy Policy</Typography>
                </Link>
                <Link href="/terms" color="inherit" underline="none">
                  <Typography>Terms of Service</Typography>
                </Link>
                <Link href="/contact" color="inherit" underline="none">
                  <Typography>Contact Us</Typography>
                </Link>
              </Box>

              {/* Social Media Links */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <Link href="https://twitter.com" target="_blank" rel="noopener">
                  <Image
                    src="/images/twitter-icon.png" // Replace with your social media icon
                    alt="Twitter"
                    width={24}
                    height={24}
                  />
                </Link>
                <Link
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener"
                >
                  <Image
                    src="/images/facebook-icon.png" // Replace with your social media icon
                    alt="Facebook"
                    width={24}
                    height={24}
                  />
                </Link>
                <Link
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener"
                >
                  <Image
                    src="/images/linkedin-icon.png" // Replace with your social media icon
                    alt="LinkedIn"
                    width={24}
                    height={24}
                  />
                </Link>
              </Box>
            </Box>
          </Container>
        </FooterBox>
      </Box>
    </CustomTheme>
  );
}

export default PagesLayout;
