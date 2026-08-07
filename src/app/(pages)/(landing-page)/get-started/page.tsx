import { EnquiryIntent } from "@/app/actions/landing-enquiry";
import CheckCircle from "@/app/icons/untitled-ui/duocolor/checked-circle";
import { Box, Container, Grid2, Stack, SvgIcon, Typography } from "@mui/material";
import { Metadata } from "next";
import React from "react";
import GetStartedForm from "../components/get-started/get-started-form";

export const metadata: Metadata = {
  title: "Get Started | RealtyIllustrations",
  description:
    "Tell us a little about your business and we'll get you set up — a custom-built real estate website with lead capture, follow-up, listings, appointments and a dashboard, for $30/month.",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const assurances = [
  "A site designed around your brand, not a template",
  "Every feature included — no tiers, no add-ons",
  "$30 a month, hosting and maintenance included",
  "We reply within one business day",
];

const Page = async ({ searchParams }: Props) => {
  const intentParam = (await searchParams).intent;
  const defaultIntent: EnquiryIntent = intentParam === "demo" ? "demo" : "start";

  return (
    <Box sx={{ bgcolor: "background.default", py: { xs: 7, md: 11 } }}>
      <Container maxWidth="lg">
        <Grid2 container spacing={{ xs: 5, md: 8 }} alignItems="flex-start">
          {/* ── Copy ── */}
          <Grid2 size={{ xs: 12, md: 5 }}>
            <Box sx={{ position: { md: "sticky" }, top: { md: 110 } }}>
              <Typography
                component="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "2rem", md: "2.75rem" },
                  lineHeight: 1.15,
                  letterSpacing: "-0.03em",
                  color: "text.primary",
                  mb: 2.5,
                }}
              >
                {defaultIntent === "demo"
                  ? "Take a look around first"
                  : "Let's build your site"}
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: "1rem", md: "1.0625rem" },
                  color: "text.secondary",
                  lineHeight: 1.75,
                  mb: 4,
                }}
              >
                {defaultIntent === "demo"
                  ? "Leave your details and we'll walk you through a live site — every feature working, nothing mocked up. No pressure to commit to anything."
                  : "Tell us a little about your business and we'll come back with what your site would look like. It takes about a minute."}
              </Typography>

              <Stack spacing={1.75}>
                {assurances.map((item) => (
                  <Stack
                    key={item}
                    direction="row"
                    alignItems="flex-start"
                    spacing={1.5}
                  >
                    <SvgIcon
                      sx={{
                        fontSize: 18,
                        color: "success.main",
                        flexShrink: 0,
                        mt: "2px",
                      }}
                    >
                      <CheckCircle />
                    </SvgIcon>
                    <Typography
                      sx={{
                        fontSize: "0.9375rem",
                        color: "text.primary",
                        lineHeight: 1.6,
                      }}
                    >
                      {item}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Grid2>

          {/* ── Form ── */}
          <Grid2 size={{ xs: 12, md: 7 }}>
            <GetStartedForm defaultIntent={defaultIntent} />
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
};

export default Page;
