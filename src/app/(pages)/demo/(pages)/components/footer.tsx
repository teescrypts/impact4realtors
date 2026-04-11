"use client";

import React, { useActionState, useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Grid2,
  IconButton,
  Stack,
  Divider,

} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import Twitter from "@/app/icons/untitled-ui/duocolor/twitter";
import Instagram from "@/app/icons/untitled-ui/duocolor/instaagram";
import Linkedin from "@/app/icons/untitled-ui/duocolor/linkedin";
import Whatsapp from "@/app/icons/untitled-ui/duocolor/whatsapp";
import { addNewsLetter } from "@/app/actions/server-actions";
import notify from "@/app/utils/toast";
import { ActionStateType } from "@/types";
import { SubmitButton } from "@/app/component/submit-buttton";
import Link from "next/link";
import Image from "next/image";

const initialState: ActionStateType = null;

const quickLinks = [
  { label: "Homes for Sale", href: "/demo/listings?category=For Sale" },
  { label: "Rentals", href: "/demo/listings?category=For Rent" },
  { label: "Sell Your Home", href: "/demo/sell" },
  { label: "Blog", href: "/demo/blog" },
  { label: "About Us", href: "/demo/about" },
  { label: "Contact", href: "/demo/contact" },
];

const socialLinks = [
  { icon: Whatsapp, label: "WhatsApp", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
];

const Footer = () => {
  const [state, formAction] = useActionState(addNewsLetter, initialState);
  const [message, setMessage] = useState("");
  const theme = useTheme();

  useEffect(() => {
    if (state?.error) setMessage(state.error);
    if (state?.message) notify(state.message);
  }, [state]);

  return (
    <Box
      component="footer"
      sx={{
        position: "relative",
        overflow: "hidden",
        bgcolor: theme.palette.primary.darkest ?? theme.palette.primary.dark,
        color: "white",
        pt: { xs: 7, md: 10 },
        pb: 4,
      }}
    >
      {/* Subtle background orbs */}
      <Box
        aria-hidden
        sx={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "-25%",
            right: "-10%",
            width: { xs: 240, md: 440 },
            height: { xs: 240, md: 440 },
            borderRadius: "50%",
            background: `radial-gradient(circle, ${alpha("#fff", 0.05)} 0%, transparent 70%)`,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "-20%",
            left: "-6%",
            width: { xs: 200, md: 360 },
            height: { xs: 200, md: 360 },
            borderRadius: "50%",
            background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 70%)`,
          }}
        />
      </Box>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Grid2 container spacing={{ xs: 5, md: 6 }}>
          {/* ── Brand + Newsletter ── */}
          <Grid2 size={{ xs: 12, md: 5 }}>
            <Stack spacing={3}>
              {/* Logo */}
              <Box>
                <Image
                  src="/images/demo-logo.png"
                  alt="RealtorDemo"
                  width={140}
                  height={44}
                  style={{
                    objectFit: "contain",
                    filter: "brightness(0) invert(1)",
                  }}
                />
              </Box>

              <Typography
                variant="body2"
                sx={{ opacity: 0.65, lineHeight: 1.75, maxWidth: 320 }}
              >
                Emperia Realty connects buyers, sellers, and renters with
                exceptional properties and expert guidance — making every
                property journey seamless.
              </Typography>

              {/* Newsletter */}
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                  letterSpacing="0.04em"
                  textTransform="uppercase"
                  sx={{ opacity: 0.5, fontSize: "0.7rem", mb: 1.25 }}
                >
                  Stay in the loop
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.75, mb: 1.75 }}>
                  New listings and market insights, straight to your inbox.
                </Typography>

                {message && (
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mb: 1,
                      color: theme.palette.error.light,
                      fontWeight: 600,
                    }}
                  >
                    {message}
                  </Typography>
                )}

                <form action={formAction}>
                  <Stack direction="row" spacing={1.25}>
                    <TextField
                      variant="outlined"
                      placeholder="your@email.com"
                      size="small"
                      name="email"
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: alpha("#fff", 0.1),
                          borderRadius: 1.5,
                          color: "white",
                          fontSize: "0.875rem",
                          "& fieldset": {
                            borderColor: alpha("#fff", 0.2),
                          },
                          "&:hover fieldset": {
                            borderColor: alpha("#fff", 0.4),
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: alpha("#fff", 0.6),
                          },
                          "& input::placeholder": {
                            color: alpha("#fff", 0.45),
                            opacity: 1,
                          },
                        },
                      }}
                    />
                    <SubmitButton title="Subscribe" isFullWidth={false} />
                  </Stack>
                </form>
              </Box>
            </Stack>
          </Grid2>

          {/* ── Quick Links ── */}
          <Grid2 size={{ xs: 6, md: 3 }}>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              letterSpacing="0.04em"
              textTransform="uppercase"
              sx={{ opacity: 0.5, fontSize: "0.7rem", mb: 2.5 }}
            >
              Quick Links
            </Typography>
            <Stack spacing={1.25}>
              {quickLinks.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  style={{ textDecoration: "none" }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.7,
                      color: "white",
                      transition: "opacity 0.15s ease",
                      "&:hover": { opacity: 1 },
                    }}
                  >
                    {label}
                  </Typography>
                </Link>
              ))}
            </Stack>
          </Grid2>

          {/* ── Contact + Socials ── */}
          <Grid2 size={{ xs: 6, md: 4 }}>
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                  letterSpacing="0.04em"
                  textTransform="uppercase"
                  sx={{ opacity: 0.5, fontSize: "0.7rem", mb: 2.5 }}
                >
                  Contact
                </Typography>
                <Stack spacing={1}>
                  <Link
                    href="tel:+11234567890"
                    style={{ textDecoration: "none" }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        opacity: 0.7,
                        color: "white",
                        "&:hover": { opacity: 1 },
                        transition: "opacity 0.15s",
                      }}
                    >
                      (123) 456-7890
                    </Typography>
                  </Link>
                  <Link
                    href="mailto:info@realtordemo.com"
                    style={{ textDecoration: "none" }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        opacity: 0.7,
                        color: "white",
                        "&:hover": { opacity: 1 },
                        transition: "opacity 0.15s",
                      }}
                    >
                      info@realtordemo.com
                    </Typography>
                  </Link>
                </Stack>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                  letterSpacing="0.04em"
                  textTransform="uppercase"
                  sx={{ opacity: 0.5, fontSize: "0.7rem", mb: 1.75 }}
                >
                  Follow Us
                </Typography>
                <Stack direction="row" spacing={0.75}>
                  {socialLinks.map(({ icon: Icon, label, href }) => (
                    <IconButton
                      key={label}
                      aria-label={label}
                      component={Link}
                      href={href}
                      size="small"
                      sx={{
                        color: "white",
                        bgcolor: alpha("#fff", 0.08),
                        border: `1px solid ${alpha("#fff", 0.12)}`,
                        borderRadius: 1.5,
                        p: 0.875,
                        "&:hover": {
                          bgcolor: alpha("#fff", 0.16),
                          borderColor: alpha("#fff", 0.25),
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.18s ease",
                      }}
                    >
                      <Icon />
                    </IconButton>
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Grid2>
        </Grid2>

        {/* ── Bottom bar ── */}
        <Divider sx={{ mt: 7, mb: 3, borderColor: alpha("#fff", 0.1) }} />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={1.5}
        >
          <Typography variant="caption" sx={{ opacity: 0.45 }}>
            © {new Date().getFullYear()} RealtorDemo. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={3}>
            {["Privacy Policy", "Terms of Service"].map((label) => (
              <Link key={label} href="#" style={{ textDecoration: "none" }}>
                <Typography
                  variant="caption"
                  sx={{
                    opacity: 0.45,
                    color: "white",
                    "&:hover": { opacity: 0.8 },
                    transition: "opacity 0.15s",
                  }}
                >
                  {label}
                </Typography>
              </Link>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
