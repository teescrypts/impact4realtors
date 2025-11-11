"use client";

import React, { useActionState, useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Typography,
  Grid2,
  Alert,
  Fade,
  Container,
  Paper,
  useTheme,
} from "@mui/material";
import { ArrowRightIcon } from "@mui/x-date-pickers";
import ArrowBack from "@/app/icons/untitled-ui/duocolor/arrow-back";
import CheckCircle from "@/app/icons/untitled-ui/duocolor/checked-circle";
import Percentage from "@/app/icons/untitled-ui/duocolor/percentage";
import User01 from "@/app/icons/untitled-ui/duocolor/user01";
import { SubmitButton } from "@/app/component/submit-buttton";
import { valuationRequest } from "@/app/actions/server-actions";
import { ActionStateType } from "@/types";

const steps = ["Property Details", "Purpose", "Contact Info"];
const initialValue: ActionStateType = null;

export default function HomeEvaluation({ adminId }: { adminId: string }) {
  const theme = useTheme();

  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    address: "",
    bedrooms: "",
    bathrooms: "",
    yearBuilt: "",
    squareFootage: "",
    purpose: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    state: "",
    zipCode: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () =>
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const submitValuation = valuationRequest.bind(null, adminId, formData);
  const [state, formAction] = useActionState(submitValuation, initialValue);

  useEffect(() => {
    if (state) {
      if (state.error) setMessage(state.error);
      if (state.message) {
        setSubmitted(true);
        setTimeout(() => {
          setOpen(false);
          setActiveStep(0);
          setSubmitted(false);
          setFormData({
            address: "",
            bedrooms: "",
            bathrooms: "",
            yearBuilt: "",
            squareFootage: "",
            purpose: "",
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            state: "",
            zipCode: "",
          });
        }, 5000);
      }
    }
  }, [state]);

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
        py: { xs: 8, md: 10 },
        px: 2,
        color: theme.palette.primary.contrastText,
        textAlign: "center",
      }}
    >
      <Container maxWidth="md">
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

        {/* --- DIALOG --- */}
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <form action={formAction}>
            <DialogTitle>
              Complete the form to receive your free home value report
            </DialogTitle>

            {message && (
              <Typography
                variant="subtitle2"
                color="error"
                textAlign={"center"}
              >
                {message}
              </Typography>
            )}

            <DialogContent dividers sx={{ minHeight: 420 }}>
              <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {/* Step 1 */}
              <Fade in={activeStep === 0} unmountOnExit>
                <Box>
                  <Grid2 container spacing={2}>
                    <Grid2 size={{ xs: 12 }}>
                      <TextField
                        label="Property Address"
                        fullWidth
                        variant="outlined"
                        name="address"
                        required
                        value={formData.address}
                        onChange={(e) =>
                          handleChange("address", e.target.value)
                        }
                      />
                    </Grid2>
                    <Grid2 size={{ xs: 6 }}>
                      <TextField
                        label="Zip code"
                        fullWidth
                        variant="outlined"
                        name="zipCode"
                        required
                        value={formData.zipCode}
                        onChange={(e) =>
                          handleChange("zipCode", e.target.value)
                        }
                      />
                    </Grid2>
                    <Grid2 size={{ xs: 6 }}>
                      <TextField
                        label="State"
                        fullWidth
                        variant="outlined"
                        name="state"
                        required
                        value={formData.state}
                        onChange={(e) => handleChange("state", e.target.value)}
                      />
                    </Grid2>
                    <Grid2 size={{ xs: 6 }}>
                      <TextField
                        label="Bedrooms"
                        fullWidth
                        variant="outlined"
                        name="bedrooms"
                        required
                        value={formData.bedrooms}
                        onChange={(e) =>
                          handleChange("bedrooms", e.target.value)
                        }
                      />
                    </Grid2>
                    <Grid2 size={{ xs: 6 }}>
                      <TextField
                        label="Bathrooms"
                        fullWidth
                        variant="outlined"
                        name="bathrooms"
                        required
                        value={formData.bathrooms}
                        onChange={(e) =>
                          handleChange("bathrooms", e.target.value)
                        }
                      />
                    </Grid2>
                    <Grid2 size={{ xs: 6 }}>
                      <TextField
                        label="Year Built"
                        fullWidth
                        variant="outlined"
                        name="yearBuilt"
                        required
                        value={formData.yearBuilt}
                        onChange={(e) =>
                          handleChange("yearBuilt", e.target.value)
                        }
                      />
                    </Grid2>
                    <Grid2 size={{ xs: 6 }}>
                      <TextField
                        label="Square Footage"
                        fullWidth
                        variant="outlined"
                        name="squareFootage"
                        required
                        value={formData.squareFootage}
                        onChange={(e) =>
                          handleChange("squareFootage", e.target.value)
                        }
                      />
                    </Grid2>
                  </Grid2>
                </Box>
              </Fade>

              {/* Step 2 */}
              <Fade in={activeStep === 1} unmountOnExit>
                <Box>
                  <TextField
                    label="Purpose of Request"
                    fullWidth
                    select
                    variant="outlined"
                    name="purpose"
                    required
                    value={formData.purpose}
                    onChange={(e) => handleChange("purpose", e.target.value)}
                    slotProps={{ select: { native: true } }}
                  >
                    <option value="">Select</option>
                    <option value="selling">Selling</option>
                    <option value="refinancing">Refinancing</option>
                    <option value="curiosity">Just Curious</option>
                    <option value="buying">Thinking of Buying</option>
                    <option value="investment">Investment</option>
                  </TextField>

                  <Paper
                    elevation={0}
                    sx={{
                      mt: 4,
                      p: 2,
                      bgcolor: theme.palette.grey[100],
                      borderRadius: 2,
                      color: theme.palette.text.secondary,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="medium">
                      What happens next?
                    </Typography>
                    <Typography variant="body2">
                      • Receive a detailed home value report via email <br />
                      • Compare your home with recent sales in your area <br />•
                      Get insights on current market trends
                    </Typography>
                  </Paper>
                </Box>
              </Fade>

              {/* Step 3 */}
              <Fade in={activeStep === 2} unmountOnExit>
                <Box>
                  <Grid2 container spacing={2}>
                    <Grid2 size={{ xs: 6 }}>
                      <TextField
                        label="First Name"
                        fullWidth
                        variant="outlined"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={(e) =>
                          handleChange("firstName", e.target.value)
                        }
                      />
                    </Grid2>
                    <Grid2 size={{ xs: 6 }}>
                      <TextField
                        label="Last Name"
                        fullWidth
                        variant="outlined"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={(e) =>
                          handleChange("lastName", e.target.value)
                        }
                      />
                    </Grid2>
                    <Grid2 size={{ xs: 12 }}>
                      <TextField
                        label="Email"
                        fullWidth
                        variant="outlined"
                        name="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                      />
                    </Grid2>
                    <Grid2 size={{ xs: 12 }}>
                      <TextField
                        label="Phone"
                        fullWidth
                        variant="outlined"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                      />
                    </Grid2>
                  </Grid2>

                  <Paper
                    elevation={0}
                    sx={{
                      mt: 3,
                      p: 2,
                      bgcolor: theme.palette.grey[100],
                      borderRadius: 2,
                      color: theme.palette.text.secondary,
                    }}
                  >
                    <Typography variant="body2">
                      By submitting this form, you agree to receive updates and
                      marketing communications from us. You can unsubscribe at
                      any time.
                    </Typography>
                  </Paper>
                </Box>
              </Fade>
            </DialogContent>

            {/* Dialog Footer */}
            <DialogActions sx={{ justifyContent: "space-between", p: 3 }}>
              {activeStep > 0 && (
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  onClick={prevStep}
                  sx={{
                    borderColor: theme.palette.divider,
                    color: theme.palette.text.primary,
                  }}
                >
                  Back
                </Button>
              )}

              {activeStep < steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={nextStep}
                  endIcon={<ArrowRightIcon />}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    "&:hover": { backgroundColor: theme.palette.primary.dark },
                  }}
                >
                  Next
                </Button>
              ) : (
                <SubmitButton title={"Submit"} isFullWidth={false} />
              )}
            </DialogActions>

            {submitted && (
              <Alert
                severity="success"
                sx={{
                  m: 3,
                  backgroundColor: theme.palette.success.light,
                  color: theme.palette.success.contrastText,
                }}
              >
                Request submitted! We’ll email your report shortly.
              </Alert>
            )}
          </form>
        </Dialog>

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
