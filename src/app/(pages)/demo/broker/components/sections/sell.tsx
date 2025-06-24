"use client";

import { sendSellRequest } from "@/app/actions/server-actions";
import { SubmitButton } from "@/app/component/submit-buttton";
import { ActionStateType } from "@/types";
import {
  Box,
  Card,
  Container,
  Grid2,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useActionState, useEffect, useState } from "react";
import ConnectSuccessModal from "../connect-success";

const initialValue: ActionStateType = null;

export default function SellWithExpert({ adminId }: { adminId?: string }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [state, formAction] = useActionState(sendSellRequest, initialValue);
  const [message, setMessage] = useState("");
  const theme = useTheme()

  useEffect(() => {
    if (state) {
      if (state?.error) {
        setMessage(state.error);
      }

      if (state?.message) {
        handleOpen();
      }
    }
  }, [state]);

  return (
    <>
      <Box
        component="section"
        sx={{
          position: "relative",
          py: { xs: 10, md: 14 },
          overflow: "hidden",
        }}
      >
        {/* Cursive Background SVG */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block" }}
          >
            <path
              fill={theme.palette.primary.alpha30}
              fillOpacity="1"
              d="M0,96L48,122.7C96,149,192,203,288,229.3C384,256,480,256,576,218.7C672,181,768,107,864,96C960,85,1056,139,1152,154.7C1248,171,1344,149,1392,138.7L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            />
          </svg>
        </Box>

        {/* Content */}
        <Container sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            gutterBottom
          >
            Sell Your Home with a Local Expert
          </Typography>
          <Typography
            variant="subtitle1"
            textAlign="center"
            maxWidth="600px"
            mx="auto"
            color="text.secondary"
            mb={5}
          >
            Ready to make a move? Fill out the form below and get connected to a
            trusted real estate expert in your area.
          </Typography>

          {message && (
            <Typography variant="subtitle2" color="error" textAlign={"center"}>
              {message}
            </Typography>
          )}

          <form action={formAction}>
            <Card
              sx={{
                // backgroundColor: "#fff",
                borderRadius: 3,
                boxShadow: 4,
                px: { xs: 3, sm: 6 },
                py: 5,
                maxWidth: "800px",
                mx: "auto",
              }}
            >
              <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <TextField
                    variant="outlined"
                    name="firstName"
                    type="text"
                    label="First Name"
                    fullWidth
                    required
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <TextField
                    variant="outlined"
                    name="lastName"
                    type="text"
                    label="Last Name"
                    fullWidth
                    required
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <TextField
                    variant="outlined"
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    required
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <TextField
                    variant="outlined"
                    name="phone"
                    type="tel"
                    label="Phone Number"
                    fullWidth
                    required
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <TextField
                    variant="outlined"
                    name="state"
                    type="text"
                    label="State"
                    fullWidth
                    required
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <TextField
                    variant="outlined"
                    name="zipCode"
                    type="number"
                    label="Zip Code"
                    fullWidth
                    required
                  />
                </Grid2>
              </Grid2>

              <input hidden defaultValue={adminId} name="admin" />

              <Stack alignItems="center" mt={4} spacing={2}>
                <SubmitButton
                  title={"Connect with an Expert"}
                  isFullWidth={true}
                />

                <Typography
                  variant="caption"
                  textAlign="center"
                  color="text.secondary"
                >
                  By submitting this form, you agree to be contacted via phone
                  and/or email by our local real estate experts.
                </Typography>
              </Stack>
            </Card>
          </form>
        </Container>
      </Box>

      <ConnectSuccessModal open={open} onClose={handleClose} />
    </>
  );
}
