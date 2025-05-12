"use client";

import Instagram from "@/app/icons/untitled-ui/duocolor/instaagram";
import Linkedin from "@/app/icons/untitled-ui/duocolor/linkedin";
import Twitter from "@/app/icons/untitled-ui/duocolor/twitter";
import {
  Box,
  Container,
  Grid2,
  Link,
  Stack,
  Typography,
  IconButton,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function Footer() {
  const theme = useTheme();
  const [adminId, setAdminId] = useState<string | null>(null);

  useEffect(() => {
    const adminId = localStorage.getItem("adminId");
    setAdminId(adminId);
  }, []);

  const navItems = [
    {
      label: "Buy",
      href: adminId
        ? `/demo/broker/listings?category=${"For Sale"}&admin=${adminId}`
        : `/demo/broker/listings?category=${"For Sale"}`,
    },
    {
      label: "Rent",
      href: adminId
        ? `/demo/broker/listings?category=${"For Rent"}&admin=${adminId}`
        : `/demo/broker/listings?category=${"For Rent"}`,
    },
    {
      label: "Sell",
      href: adminId
        ? `/demo/broker/sell?admin=${adminId}`
        : "/demo/broker/sell",
    },
    {
      label: "Our Agents",
      href: adminId
        ? `/demo/broker/agents?admin=${adminId}`
        : "/demo/broker/agents",
    },
    {
      label: "Blog",
      href: adminId
        ? `/demo/broker/blog?admin=${adminId}`
        : "/demo/broker/blog",
    },
    {
      label: "About Us",
      href: adminId
        ? `/demo/broker/about?admin=${adminId}`
        : "/demo/broker/about",
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.primary.darkest,
        color: "#fff",
        pt: 8,
        pb: 4,
        mt: 10,
      }}
    >
      <Container>
        <Grid2 container spacing={4}>
          {/* Brand Section */}
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              RealEstately
            </Typography>
            <Typography variant="body2" color="grey.400">
              Helping you find your dream home with trust, transparency, and
              top-notch service.
            </Typography>
          </Grid2>

          {/* Navigation */}
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Explore
            </Typography>
            <Stack spacing={1}>
              {navItems.map(
                (nav) => (
                  <Link
                    key={nav.label}
                    href={nav.href}
                    underline="none"
                    color="grey.300"
                    sx={{
                      "&:hover": {
                        color: "white",
                      },
                    }}
                  >
                    {nav.label}
                  </Link>
                )
              )}
            </Stack>
          </Grid2>

          {/* Contact */}
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" color="grey.400">
              Email: hello@realestately.com
            </Typography>
            <Typography variant="body2" color="grey.400">
              Phone: +1 (555) 123-4567
            </Typography>

            <Stack direction="row" spacing={1} mt={2}>
              <IconButton sx={{ color: "grey.400" }} aria-label="Twitter">
                <Twitter />
              </IconButton>
              <IconButton sx={{ color: "grey.400" }} aria-label="Instagram">
                <Instagram />
              </IconButton>
              <IconButton sx={{ color: "grey.400" }} aria-label="LinkedIn">
                <Linkedin />
              </IconButton>
            </Stack>
          </Grid2>
        </Grid2>

        <Box
          mt={6}
          textAlign="center"
          borderTop={1}
          borderColor="white"
          pt={3}
        >
          <Typography variant="body2" color="grey.500">
            © {new Date().getFullYear()} RealEstately. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
