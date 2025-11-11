import { sendEvaluationReq } from "@/app/actions/server-actions";
import { SubmitButton } from "@/app/component/submit-buttton";
import ArrowBack from "@/app/icons/untitled-ui/duocolor/arrow-back";
import { ActionStateType } from "@/types";
import {
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  Stepper,
  Step,
  StepLabel,
  Fade,
  Box,
  Grid2,
  TextField,
  Paper,
  DialogActions,
  Button,
  Alert,
  useTheme,
} from "@mui/material";
import { ArrowRightIcon } from "@mui/x-date-pickers";
import React, { useActionState, useEffect, useState } from "react";

const steps = ["Property Details", "Purpose", "Contact Info"];
const initialState: ActionStateType = null;

function EvaluationDialogue({
  open,
  onClose,
  adminId,
}: {
  open: boolean;
  onClose: () => void;
  adminId?: string;
}) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    address: "",
    bedrooms: "",
    bathrooms: "",
    yearBuilt: "",
    squareFootage: "",
    purpose: "",
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () =>
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const bindFormData = sendEvaluationReq.bind(null, adminId, formData);
  const [state, formAction] = useActionState(bindFormData, initialState);

  useEffect(() => {
    if (state) {
      if (state?.error) setMessage(state.error);
      if (state?.message) {
        setSubmitted(true);
        setTimeout(() => {
          onClose();
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
          });
        }, 5000);
      }
    }
  }, [state, onClose]);

  return (
    <div>
      {" "}
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Complete the form to receive your free home value report
        </DialogTitle>

        <form action={formAction}>
          <input hidden name="admin" defaultValue={adminId} />
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
                      required
                      name="address"
                      type="text"
                      defaultValue={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 6 }}>
                    <TextField
                      label="Bedrooms"
                      fullWidth
                      variant="outlined"
                      required
                      name="bedrooms"
                      type="number"
                      defaultValue={formData.bedrooms}
                      onChange={(e) => handleChange("bedrooms", e.target.value)}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 6 }}>
                    <TextField
                      label="Bathrooms"
                      fullWidth
                      variant="outlined"
                      required
                      name="bathrooms"
                      type="number"
                      defaultValue={formData.bathrooms}
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
                      required
                      name="yearBuilt"
                      type="number"
                      defaultValue={formData.yearBuilt}
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
                      required
                      name="squareFootage"
                      type="number"
                      defaultValue={formData.squareFootage}
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
                  required
                  name="purpose"
                  slotProps={{ select: { native: true } }}
                  defaultValue={formData.purpose}
                  onChange={(e) => handleChange("purpose", e.target.value)}
                >
                  <option disabled value="">
                    Select
                  </option>
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
                      required
                      name="firstName"
                      type="text"
                      defaultValue={formData.firstName}
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
                      required
                      name="lastName"
                      type="text"
                      defaultValue={formData.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12 }}>
                    <TextField
                      label="Email"
                      fullWidth
                      variant="outlined"
                      required
                      name="email"
                      type="email"
                      defaultValue={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12 }}>
                    <TextField
                      label="Phone"
                      fullWidth
                      variant="outlined"
                      required
                      name="phone"
                      type="tel"
                      defaultValue={formData.phone}
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
                    marketing communications from us. You can unsubscribe at any
                    time.
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
              <SubmitButton title={"Confirm"} isFullWidth={false} />
            )}
          </DialogActions>
        </form>

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

        {message && (
          <Alert
            severity="error"
            sx={{
              m: 3,
              backgroundColor: theme.palette.error.main,
              color: theme.palette.error.contrastText,
            }}
          >
            {message}
          </Alert>
        )}
      </Dialog>
    </div>
  );
}

export default EvaluationDialogue;
