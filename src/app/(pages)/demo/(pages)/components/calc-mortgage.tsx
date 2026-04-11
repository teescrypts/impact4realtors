"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Button,
  TextField,
  Typography,
  Box,
  Grid2,
  Checkbox,
  FormControlLabel,
  Stack,
  IconButton,
  Divider,
  InputAdornment,
  Chip,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { Scrollbar } from "@/app/component/scrollbar";
import { propertyType } from "../listings/page";
import Link from "next/link";
import Close from "@/app/icons/untitled-ui/duocolor/close";

interface MortgageEstimationModalProps {
  adminId?: string;
  open: boolean;
  onClose: () => void;
  listing: propertyType;
}

const ResultRow = ({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => {
  const theme = useTheme();
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        py: 1.25,
        px: 2,
        borderRadius: 1.5,
        bgcolor: highlight
          ? alpha(theme.palette.primary.main, 0.07)
          : "transparent",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="body2"
        fontWeight={highlight ? 800 : 600}
        color={highlight ? "primary.main" : "text.primary"}
      >
        {value}
      </Typography>
    </Stack>
  );
};

const MortgageEstimationModal: React.FC<MortgageEstimationModalProps> = ({
  adminId,
  open,
  onClose,
  listing,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;

  const [downPayment, setDownPayment] = useState<number | "">("");
  const [mortgageRate, setMortgageRate] = useState<number | string>("");
  const [loanTerm, setLoanTerm] = useState<number | string>("");
  const [monthlyIncome, setMonthlyIncome] = useState<number | "">("");
  const [veteran, setVeteran] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [result, setResult] = useState<{
    monthlyPI: number;
    downPaymentPercent: number;
    incomeRatio?: number;
    loanAmount: number;
    totalPaid: number;
  } | null>(null);

  const handleClose = () => {
    setDownPayment("");
    setMortgageRate("");
    setLoanTerm("");
    setMonthlyIncome("");
    setVeteran(false);
    setCalculated(false);
    setResult(null);
    onClose();
  };

  const handleCalculate = () => {
    if (!mortgageRate || !loanTerm) return setCalculated(true);

    const dp = downPayment === "" ? listing.price * 0.2 : Number(downPayment);
    const downPaymentPercent = (dp / listing.price) * 100;
    const principal = listing.price - dp;
    const r = (mortgageRate as number) / 100 / 12;
    const n = (loanTerm as number) * 12;
    const monthlyPI =
      (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPaid = monthlyPI * n + dp;

    let incomeRatio: number | undefined;
    if (monthlyIncome !== "" && Number(monthlyIncome) > 0) {
      incomeRatio = (monthlyPI / Number(monthlyIncome)) * 100;
    }

    setResult({
      monthlyPI,
      downPaymentPercent,
      incomeRatio,
      loanAmount: principal,
      totalPaid,
    });
    setCalculated(true);
  };

  const effectiveDown =
    downPayment === "" ? listing.price * 0.2 : Number(downPayment);
  const needsPMI = result && result.downPaymentPercent < 20 && !veteran;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            bgcolor: isDark ? "grey.900" : "background.paper",
            boxShadow: `0 24px 64px ${alpha("#000", 0.18)}`,
            overflow: "hidden",
          },
        },
      }}
    >
      <Scrollbar>
        {/* ── Header ── */}
        <Box
          sx={{
            px: 3.5,
            pt: 3,
            pb: 2.5,
            borderBottom: "1px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              fontWeight={800}
              letterSpacing="-0.02em"
              lineHeight={1.2}
            >
              Mortgage Estimator
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              mt={0.5}
            >
              {listing.propertyTitle}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center" flexShrink={0}>
            <Chip
              label={`$${listing.price.toLocaleString()}`}
              size="small"
              sx={{
                bgcolor: alpha(primary, 0.1),
                color: "primary.main",
                fontWeight: 800,
                fontSize: "0.8rem",
                border: `1px solid ${alpha(primary, 0.2)}`,
                borderRadius: 1.5,
              }}
            />
            <IconButton
              size="small"
              onClick={handleClose}
              sx={{
                bgcolor: "action.hover",
                borderRadius: 1.5,
                "&:hover": { bgcolor: "action.selected" },
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Stack>
        </Box>

        <DialogContent sx={{ px: 3.5, pt: 3, pb: 3.5 }}>
          <Stack spacing={3}>
            {/* ── Input Fields ── */}
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Down Payment"
                  type="number"
                  fullWidth
                  size="small"
                  value={downPayment === "" ? "" : downPayment}
                  onChange={(e) =>
                    setDownPayment(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  placeholder={`${(listing.price * 0.2).toLocaleString()} (20%)`}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography variant="body2" color="text.disabled">
                            $
                          </Typography>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Interest Rate"
                  type="number"
                  fullWidth
                  size="small"
                  value={mortgageRate}
                  onChange={(e) => setMortgageRate(Number(e.target.value))}
                  placeholder="e.g. 6.5"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography variant="body2" color="text.disabled">
                            %
                          </Typography>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Loan Term"
                  type="number"
                  fullWidth
                  size="small"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  placeholder="e.g. 30"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography variant="body2" color="text.disabled">
                            yrs
                          </Typography>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Monthly Income (optional)"
                  type="number"
                  fullWidth
                  size="small"
                  value={monthlyIncome === "" ? "" : monthlyIncome}
                  onChange={(e) =>
                    setMonthlyIncome(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography variant="body2" color="text.disabled">
                            $
                          </Typography>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={veteran}
                      onChange={(e) => setVeteran(e.target.checked)}
                      color="primary"
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="body2" color="text.secondary">
                      I am a veteran{" "}
                      <Box component="span" sx={{ color: "text.disabled" }}>
                        (VA loan — no PMI required)
                      </Box>
                    </Typography>
                  }
                />
              </Grid2>
            </Grid2>

            <Button
              variant="contained"
              fullWidth
              onClick={handleCalculate}
              size="large"
              sx={{
                fontWeight: 700,
                borderRadius: 2,
                py: 1.375,
                boxShadow: `0 6px 20px ${alpha(primary, 0.28)}`,
                "&:hover": { boxShadow: `0 8px 28px ${alpha(primary, 0.38)}` },
                transition: "box-shadow 0.2s ease",
              }}
            >
              Calculate Mortgage
            </Button>

            {/* ── Results ── */}
            {calculated && result && (
              <Box
                sx={{
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: isDark
                    ? alpha("#fff", 0.08)
                    : alpha("#000", 0.07),
                  overflow: "hidden",
                }}
              >
                {/* Results header */}
                <Box
                  sx={{
                    px: 2.5,
                    py: 2,
                    bgcolor: isDark
                      ? alpha("#fff", 0.03)
                      : alpha(primary, 0.04),
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    color="text.primary"
                  >
                    Estimation Results
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    Based on a {loanTerm}-year fixed-rate mortgage
                  </Typography>
                </Box>

                <Stack sx={{ px: 1, py: 1.5 }} spacing={0.25}>
                  <ResultRow
                    label="Down Payment"
                    value={`$${effectiveDown.toLocaleString()} (${result.downPaymentPercent.toFixed(1)}%)`}
                  />
                  <ResultRow
                    label="Loan Amount"
                    value={`$${result.loanAmount.toLocaleString()}`}
                  />
                  <Divider sx={{ my: 0.5 }} />
                  <ResultRow
                    label="Monthly Payment (P&I)"
                    value={`$${result.monthlyPI.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    highlight
                  />
                  <ResultRow
                    label="Total Amount Paid"
                    value={`$${result.totalPaid.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                  />
                  {result.incomeRatio !== undefined && (
                    <ResultRow
                      label="% of Monthly Income"
                      value={`${result.incomeRatio.toFixed(1)}%`}
                    />
                  )}
                </Stack>

                {/* PMI warning */}
                {needsPMI && (
                  <Box
                    sx={{
                      mx: 2,
                      mb: 2,
                      mt: 0.5,
                      px: 2,
                      py: 1.25,
                      borderRadius: 1.5,
                      bgcolor: alpha(theme.palette.warning.main, 0.08),
                      border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="warning.main"
                      fontWeight={600}
                    >
                      ⚠ A down payment under 20% typically requires Private
                      Mortgage Insurance (PMI).
                    </Typography>
                  </Box>
                )}

                {/* Income ratio warning */}
                {result.incomeRatio !== undefined &&
                  result.incomeRatio > 36 && (
                    <Box
                      sx={{
                        mx: 2,
                        mb: 2,
                        px: 2,
                        py: 1.25,
                        borderRadius: 1.5,
                        bgcolor: alpha(theme.palette.error.main, 0.07),
                        border: `1px solid ${alpha(theme.palette.error.main, 0.18)}`,
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="error.main"
                        fontWeight={600}
                      >
                        ⚠ Monthly payment exceeds 36% of your income — lenders
                        typically recommend staying below this threshold.
                      </Typography>
                    </Box>
                  )}

                {/* CTA */}
                <Box sx={{ px: 2.5, pb: 2.5, pt: 1 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    component={Link}
                    href={
                      adminId
                        ? `/demo/contact/mortgage?admin=${adminId}`
                        : "/demo/contact/mortgage"
                    }
                    sx={{
                      borderRadius: 2,
                      fontWeight: 700,
                      py: 1.125,
                    }}
                  >
                    Speak to a Mortgage Advisor →
                  </Button>
                </Box>
              </Box>
            )}

            {/* Empty state — fields missing */}
            {calculated && !result && (
              <Box
                sx={{
                  textAlign: "center",
                  py: 2,
                  px: 3,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.error.main, 0.06),
                  border: `1px solid ${alpha(theme.palette.error.main, 0.15)}`,
                }}
              >
                <Typography variant="body2" color="error" fontWeight={600}>
                  Please enter an interest rate and loan term to calculate.
                </Typography>
              </Box>
            )}
          </Stack>
        </DialogContent>
      </Scrollbar>
    </Dialog>
  );
};

export default MortgageEstimationModal;
