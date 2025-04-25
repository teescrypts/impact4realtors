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
  Divider,
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
            borderRadius: 3,
            p: 3,
          },
        },
      }}
    >
      <Scrollbar>
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          Mortgage Estimation for {listing.propertyTitle}
        </DialogTitle>

        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <Grid2 container spacing={2}>
              {/* Agent Provided Values Display */}
              <Grid2 size={{ xs: 12 }}>
                <Typography variant="body2">
                  <strong>Property Price:</strong> $
                  {listing.price.toLocaleString()}
                </Typography>
              </Grid2>

              {/* Down Payment Input */}
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <TextField
                  variant="outlined"
                  label="Down Payment ($)"
                  type="number"
                  fullWidth
                  value={downPayment === "" ? "" : downPayment}
                  onChange={(e) =>
                    setDownPayment(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                />
              </Grid2>

              {/* Mortgage Rate Input */}
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <TextField
                  variant="outlined"
                  label="Mortgage Rate (%)"
                  type="number"
                  fullWidth
                  value={mortgageRate}
                  onChange={(e) => {
                    const rate = Number(e.target.value);
                    setMortgageRate(rate);
                  }}
                />
              </Grid2>

              {/* Loan Term Input */}
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <TextField
                  variant="outlined"
                  label="Loan Term (years)"
                  type="number"
                  fullWidth
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                />
              </Grid2>

              {/* Monthly Income Input */}
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <TextField
                  variant="outlined"
                  label="Monthly Income (optional)"
                  type="number"
                  fullWidth
                  value={monthlyIncome === "" ? "" : monthlyIncome}
                  onChange={(e) =>
                    setMonthlyIncome(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                />
              </Grid2>

              {/* Veteran Checkbox */}
              <Grid2 size={{ xs: 12, sm: 6 }}>
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
            <Box textAlign="center" mt={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCalculate}
              >
                Calculate Mortgage
              </Button>
            </Box>
            {calculated && result && (
              <Box
                sx={{ bgcolor: "#fff", p: 3, borderRadius: 2, boxShadow: 2 }}
              >
                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Mortgage Estimation Results
                </Typography>

                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Down Payment:</strong> $
                  {downPayment === ""
                    ? (listing.price * 0.2).toLocaleString()
                    : Number(downPayment).toLocaleString()}{" "}
                  ({result.downPaymentPercent.toFixed(2)}% of property price)
                </Typography>

                {result.downPaymentPercent < 20 && !veteran && (
                  <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                    <strong>Warning:</strong> A down payment of less than 20%
                    may require PMI.
                  </Typography>
                )}

                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Principal & Interest:</strong> $
                  {result.monthlyPI.toLocaleString()} per month
                </Typography>

                {result.incomeRatio !== undefined && (
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    This payment represents {result.incomeRatio.toFixed(2)}% of
                    your monthly income.
                  </Typography>
                )}

                {/* Call-to-action Section */}
                <Box textAlign="center">
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
                        mt: 2,
                        borderRadius: "50px",
                        textTransform: "none",
                        fontWeight: "bold",
                        px: 4,
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

        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button variant="outlined" onClick={handleClose} color="error">
            Close
          </Button>
        </DialogActions>
      </Scrollbar>
    </Dialog>
  );
};

export default MortgageEstimationModal;
