"use client";

import {
  EnquiryIntent,
  EnquiryState,
  submitEnquiry,
} from "@/app/actions/landing-enquiry";
import CheckCircle from "@/app/icons/untitled-ui/duocolor/checked-circle";
import HomeSmile from "@/app/icons/untitled-ui/duocolor/home-smile";
import Visibility from "@/app/icons/untitled-ui/duocolor/visibility";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid2,
  Stack,
  SvgIcon,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useActionState, useState } from "react";

const intents: {
  value: EnquiryIntent;
  label: string;
  body: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "start",
    label: "Get started",
    body: "I'm ready to have my site built.",
    icon: <HomeSmile />,
  },
  {
    value: "demo",
    label: "Explore the demo",
    body: "I'd like a walkthrough first.",
    icon: <Visibility />,
  },
];

const initialState: EnquiryState = { status: "idle" };

export default function GetStartedForm({
  defaultIntent = "start",
}: {
  defaultIntent?: EnquiryIntent;
}) {
  const theme = useTheme();
  const [intent, setIntent] = useState<EnquiryIntent>(defaultIntent);
  const [state, formAction, isPending] = useActionState(
    submitEnquiry,
    initialState,
  );

  // ── Success ──
  if (state.status === "success") {
    return (
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: "20px",
          border: "1.5px solid",
          borderColor: "primary.main",
          bgcolor: theme.palette.primary.alpha8,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            mx: "auto",
            mb: 2.5,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: theme.palette.primary.alpha12,
          }}
        >
          <SvgIcon sx={{ fontSize: 28, color: "success.main" }}>
            <CheckCircle />
          </SvgIcon>
        </Box>

        <Typography
          sx={{
            fontSize: { xs: "1.375rem", md: "1.625rem" },
            fontWeight: 800,
            color: "text.primary",
            letterSpacing: "-0.02em",
            mb: 1.5,
          }}
        >
          You&apos;re on the list
        </Typography>

        <Typography
          sx={{
            fontSize: "1rem",
            color: "text.secondary",
            lineHeight: 1.7,
            maxWidth: 420,
            mx: "auto",
          }}
        >
          {state.message}
        </Typography>
      </Box>
    );
  }

  // ── Form ──
  return (
    <Box
      component="form"
      action={formAction}
      sx={{
        p: { xs: 2.5, md: 4 },
        borderRadius: "20px",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        boxShadow: `0 20px 60px ${alpha("#000", 0.06)}`,
      }}
    >
      {/* Intent picker — doubles as the submitted value */}
      <input type="hidden" name="intent" value={intent} />

      <Typography
        sx={{
          fontSize: "0.72rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "text.disabled",
          mb: 1.75,
        }}
      >
        What are you after?
      </Typography>

      <Grid2 container spacing={1.5} sx={{ mb: 4 }}>
        {intents.map(({ value, label, body, icon }) => {
          const selected = intent === value;
          return (
            <Grid2 size={{ xs: 12, sm: 6 }} key={value}>
              <Stack
                role="radio"
                aria-checked={selected}
                tabIndex={0}
                onClick={() => setIntent(value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setIntent(value);
                  }
                }}
                direction="row"
                alignItems="center"
                spacing={1.75}
                sx={{
                  height: "100%",
                  px: 2,
                  py: 1.75,
                  borderRadius: "12px",
                  cursor: "pointer",
                  border: selected ? "1.5px solid" : "1px solid",
                  borderColor: selected ? "primary.main" : "divider",
                  bgcolor: selected
                    ? theme.palette.primary.alpha8
                    : "background.default",
                  transition: "border-color 0.2s ease, background-color 0.2s ease",
                  "&:hover": { borderColor: "primary.main" },
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "10px",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: theme.palette.primary.alpha12,
                  }}
                >
                  <SvgIcon sx={{ fontSize: 18, color: "primary.main" }}>
                    {icon}
                  </SvgIcon>
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: "0.9375rem",
                      fontWeight: 700,
                      color: "text.primary",
                      lineHeight: 1.3,
                    }}
                  >
                    {label}
                  </Typography>
                  <Typography
                    sx={{ fontSize: "0.8125rem", color: "text.secondary" }}
                  >
                    {body}
                  </Typography>
                </Box>
              </Stack>
            </Grid2>
          );
        })}
      </Grid2>

      {/* Fields */}
      <Grid2 container spacing={2.5}>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField
            name="firstName"
            label="First name"
            required
            fullWidth
            autoComplete="given-name"
            error={Boolean(state.errors?.firstName)}
            helperText={state.errors?.firstName}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField
            name="lastName"
            label="Last name"
            required
            fullWidth
            autoComplete="family-name"
            error={Boolean(state.errors?.lastName)}
            helperText={state.errors?.lastName}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField
            name="email"
            type="email"
            label="Email"
            required
            fullWidth
            autoComplete="email"
            error={Boolean(state.errors?.email)}
            helperText={state.errors?.email}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField
            name="phone"
            label="Phone"
            fullWidth
            autoComplete="tel"
            helperText="Optional"
          />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <TextField
            name="brokerage"
            label="Brokerage or team"
            fullWidth
            autoComplete="organization"
            helperText="Optional"
          />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <TextField
            name="message"
            label="Anything you'd like us to know?"
            fullWidth
            multiline
            minRows={3}
            helperText="Optional"
          />
        </Grid2>
      </Grid2>

      {/* Honeypot — hidden from people, catnip for bots */}
      <Box
        component="input"
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        sx={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      />

      {state.status === "error" && state.message && (
        <Alert severity="error" sx={{ mt: 3, borderRadius: "10px" }}>
          {state.message}
        </Alert>
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        disabled={isPending}
        startIcon={
          isPending ? (
            <CircularProgress size={18} color="inherit" />
          ) : undefined
        }
        sx={{
          mt: 3.5,
          fontWeight: 700,
          borderRadius: "10px",
          py: 1.75,
          textTransform: "none",
          fontSize: "1rem",
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        }}
      >
        {isPending
          ? "Sending…"
          : intent === "demo"
            ? "Send me the demo →"
            : "Get started →"}
      </Button>

      <Typography
        sx={{
          mt: 2,
          fontSize: "0.75rem",
          color: "text.disabled",
          textAlign: "center",
          lineHeight: 1.6,
        }}
      >
        We&apos;ll only use your details to reply about RealtyIllustrations. No
        lists, no spam.
      </Typography>
    </Box>
  );
}
