"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Grid2,
  Container,
  Paper,
  useTheme,
} from "@mui/material";
import { ArrowRightIcon } from "@mui/x-date-pickers";
import CheckCircle from "@/app/icons/untitled-ui/duocolor/checked-circle";
import Percentage from "@/app/icons/untitled-ui/duocolor/percentage";
import User01 from "@/app/icons/untitled-ui/duocolor/user01";
import EvaluationDialogue from "../evaluation-dialogue";

export default function HomeEvaluation({ adminId }: { adminId?: string }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.darkest}, ${theme.palette.primary.dark})`,
        py: { xs: 8, md: 10 },
        px: 2,
        color: theme.palette.primary.contrastText,
        textAlign: "center",
      }}
    >
      <Container maxWidth="md">
        <Box>
          <Typography
            variant="h3"
            fontWeight="bold"
            gutterBottom
            sx={{ color: theme.palette.primary.contrastText }}
          >
            What’s Your Home Worth?
          </Typography>

          <Typography
            variant="h6"
            sx={{
              opacity: 0.9,
              mb: 4,
              color: theme.palette.primary.contrastText,
            }}
          >
            Get a free, no-obligation home value report based on current market
            data and recent sales in your area.
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => setOpen(true)}
            endIcon={<ArrowRightIcon />}
            sx={{
              px: 6,
              py: 2,
              fontSize: "1.1rem",
              borderRadius: 3,
              boxShadow: theme.shadows[6],
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.secondary.contrastText,
              "&:hover": {
                backgroundColor: theme.palette.secondary.dark,
              },
            }}
          >
            Get Started
          </Button>
        </Box>

        {/* --- DIALOG --- */}
        <EvaluationDialogue
          adminId={adminId}
          open={open}
          onClose={handleClose}
        />

        {/* --- Feature Cards --- */}
        <Grid2 container spacing={3} sx={{ mt: 8 }}>
          {[
            {
              title: "Fast & Free",
              desc: "Get your home value report in minutes, completely free.",
              icon: <CheckCircle color="secondary" />,
            },
            {
              title: "Accurate Data",
              desc: "Based on real market data and recent comparable sales.",
              icon: <Percentage color="secondary" />,
            },
            {
              title: "Expert Support",
              desc: "Our team is here to answer any questions you have.",
              icon: <User01 color="secondary" />,
            },
          ].map((f, i) => (
            <Grid2 size={{ xs: 12, md: 4 }} key={i}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  textAlign: "center",
                  height: "100%",
                  bgcolor: theme.palette.background.paper,
                  boxShadow: theme.shadows[2],
                }}
              >
                <Box sx={{ mb: 2 }}>{f.icon}</Box>
                <Typography variant="h6" fontWeight="bold">
                  {f.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {f.desc}
                </Typography>
              </Paper>
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </Box>
  );
}
