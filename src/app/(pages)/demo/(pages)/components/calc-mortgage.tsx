"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Grid2,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Scrollbar } from "@/app/component/scrollbar";
import { propertyType } from "../listings/page";
import Link from "next/link";

interface MortgageEstimationModalProps {
  adminId?: string;
  open: boolean;
  onClose: () => void;
  listing: propertyType;
}

const MortgageEstimationModal: React.FC<MortgageEstimationModalProps> = ({
  adminId,
  open,
  onClose,
  listing,
}) => {
  // Customer override state
  const [downPayment, setDownPayment] = useState<number | "">("");
  const [mortgageRate, setMortgageRate] = useState<number | string>("");
  const [loanTerm, setLoanTerm] = useState<number | string>("");
  const [monthlyIncome, setMonthlyIncome] = useState<number | "">("");
  const [veteran, setVeteran] = useState<boolean>(false);
  const [calculated, setCalculated] = useState(false);
  const [result, setResult] = useState<{
    monthlyPI: number;
    downPaymentPercent: number;
    incomeRatio?: number;
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
    if (mortgageRate && loanTerm) {
      const dp = downPayment === "" ? listing.price * 0.2 : Number(downPayment);
      const downPaymentPercent = (dp / listing.price) * 100;

      // Mortgage principal is property price minus down payment.
      const principal = listing.price - dp;

      // Monthly interest rate and total months.
      const r = (mortgageRate as number) / 100 / 12;
      const n = (loanTerm as number) * 12;

      // Monthly Principal & Interest (P&I) calculation:
      const monthlyPI =
        (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

      let incomeRatio: number | undefined = undefined;
      if (monthlyIncome !== "" && Number(monthlyIncome) > 0) {
        incomeRatio = (monthlyPI / Number(monthlyIncome)) * 100;
      }

      setResult({
        monthlyPI,
        downPaymentPercent,
        incomeRatio,
      });
    }

    setCalculated(true);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            p: 0,
            bgcolor: "background.default",
            boxShadow: 10,
          },
        },
      }}
    >
      <Scrollbar>
        <Box sx={{ p: 4 }}>
          <DialogTitle sx={{ textAlign: "center", fontWeight: 700 }}>
            Mortgage Estimation for {listing.propertyTitle}
          </DialogTitle>

          <DialogContent>
            <Box component="form" noValidate>
              <Grid2 container spacing={3} mt={1}>
                {/* Price Display */}
                <Grid2 size={{ xs: 12 }}>
                  <Typography variant="subtitle1" color="text.secondary">
                    <strong>Property Price:</strong> $
                    {listing.price.toLocaleString()}
                  </Typography>
                </Grid2>

                {/* Down Payment */}
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Down Payment ($)"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={downPayment === "" ? "" : downPayment}
                    onChange={(e) =>
                      setDownPayment(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  />
                </Grid2>

                {/* Mortgage Rate */}
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Mortgage Rate (%)"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={mortgageRate}
                    onChange={(e) => setMortgageRate(Number(e.target.value))}
                  />
                </Grid2>

                {/* Loan Term */}
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Loan Term (years)"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                  />
                </Grid2>

                {/* Monthly Income */}
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Monthly Income (optional)"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={monthlyIncome === "" ? "" : monthlyIncome}
                    onChange={(e) =>
                      setMonthlyIncome(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  />
                </Grid2>

                {/* Veteran Checkbox */}
                <Grid2 size={{ xs: 12 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={veteran}
                        onChange={(e) => setVeteran(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="I am a veteran"
                  />
                </Grid2>
              </Grid2>

              {/* Action Button */}
              <Box textAlign="center" mt={4}>
                <Button
                  variant="contained"
                  onClick={handleCalculate}
                  sx={{ px: 4, py: 1 }}
                >
                  Calculate Mortgage
                </Button>
              </Box>

              {/* Results */}
              {calculated && result && (
                <Box
                  mt={4}
                  sx={{
                    bgcolor: "background.paper",
                    p: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Mortgage Estimation Results
                  </Typography>

                  <Typography variant="body2" mb={1}>
                    <strong>Down Payment:</strong> $
                    {downPayment === ""
                      ? (listing.price * 0.2).toLocaleString()
                      : Number(downPayment).toLocaleString()}{" "}
                    ({result.downPaymentPercent.toFixed(2)}% of price)
                  </Typography>

                  {result.downPaymentPercent < 20 && !veteran && (
                    <Typography variant="body2" color="error" mb={1}>
                      <strong>Note:</strong> A down payment under 20% may
                      require PMI.
                    </Typography>
                  )}

                  <Typography variant="body2" mb={1}>
                    <strong>Monthly Payment (P&I):</strong> $
                    {result.monthlyPI.toLocaleString()}
                  </Typography>

                  {result.incomeRatio !== undefined && (
                    <Typography variant="body2" mb={1}>
                      This is {result.incomeRatio.toFixed(2)}% of your monthly
                      income.
                    </Typography>
                  )}

                  <Box textAlign="center" mt={3}>
                    <Link
                      href={
                        adminId
                          ? `/demo/contact/mortgage?admin=${adminId}`
                          : "/demo/contact/mortgage"
                      }
                      passHref
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{
                          borderRadius: "50px",
                          textTransform: "none",
                          fontWeight: "bold",
                          px: 5,
                        }}
                      >
                        Contact Us About Mortgage
                      </Button>
                    </Link>
                  </Box>
                </Box>
              )}
            </Box>
          </DialogContent>

          <DialogActions sx={{ justifyContent: "center", p: 2 }}>
            <Button variant="outlined" color="error" onClick={handleClose}>
              Close
            </Button>
          </DialogActions>
        </Box>
      </Scrollbar>
    </Dialog>
  );
};

export default MortgageEstimationModal;
