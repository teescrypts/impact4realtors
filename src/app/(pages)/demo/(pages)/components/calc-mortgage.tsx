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
  Grid,
  Divider,
  Checkbox,
  FormControlLabel,
  useTheme,
} from "@mui/material";
import { Scrollbar } from "@/app/component/scrollbar";

export interface Listing {
  id: number;
  title: string;
  price: number;
  name?: string;
  location?: string;
  type: "sale" | "rent";
  hoa?: number; // monthly HOA fee
  bedrooms: number;
  toilets: number;
  size: number;
  image: string;
  status: string;
  localTaxRate?: number; // annual local tax rate in percent
  agentInsurance?: number; // annual insurance estimate in $
  agentMortgageRate?: number; // annual interest rate in percent
  agentLoanTerm?: number; // loan term in years
}

interface MortgageEstimationModalProps {
  open: boolean;
  onClose: () => void;
  listing: Listing;
}

const MortgageEstimationModal: React.FC<MortgageEstimationModalProps> = ({
  open,
  onClose,
  listing,
}) => {
  // Agent provided defaults:
  const defaultHOA = listing.hoa ?? 200;
  const defaultLocalTaxRate = listing.localTaxRate ?? 1.25; // %
  const defaultInsurance = listing.agentInsurance ?? 1200; // annual ($)
  const defaultMortgageRate = listing.agentMortgageRate ?? 3.5; // %
  const defaultLoanTerm = listing.agentLoanTerm ?? 30; // years

  // Customer override state
  const [downPayment, setDownPayment] = useState<number | "">(""); // user can input a down payment amount
  const [insurance, setInsurance] = useState<number>(defaultInsurance);
  const [mortgageRate, setMortgageRate] = useState<number>(defaultMortgageRate);
  const [loanTerm, setLoanTerm] = useState<number>(defaultLoanTerm);
  const [monthlyIncome, setMonthlyIncome] = useState<number | "">("");
  const [veteran, setVeteran] = useState<boolean>(false);
  const [calculated, setCalculated] = useState(false);
  const [result, setResult] = useState<{
    monthlyPI: number;
    monthlyTax: number;
    monthlyInsurance: number;
    totalMonthly: number;
    downPaymentPercent: number;
    incomeRatio?: number;
  } | null>(null);

  const handleCalculate = () => {
    // Determine down payment: if user hasn't provided one, assume 20% of price.
    const dp = downPayment === "" ? listing.price * 0.2 : Number(downPayment);
    const downPaymentPercent = (dp / listing.price) * 100;

    // Mortgage principal is property price minus down payment.
    const principal = listing.price - dp;

    // Monthly interest rate and total months.
    const r = mortgageRate / 100 / 12;
    const n = loanTerm * 12;

    // Monthly Principal & Interest (P&I) calculation:
    const monthlyPI =
      (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    // Monthly Property Tax:
    const monthlyTax = (listing.price * (defaultLocalTaxRate / 100)) / 12;

    // Monthly Insurance:
    const monthlyInsurance = insurance / 12;

    // Monthly HOA fee:
    const monthlyHOA = defaultHOA;

    // Total monthly payment:
    const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyHOA;

    let incomeRatio: number | undefined = undefined;
    if (monthlyIncome !== "" && Number(monthlyIncome) > 0) {
      incomeRatio = (totalMonthly / Number(monthlyIncome)) * 100;
    }

    setResult({
      monthlyPI,
      monthlyTax,
      monthlyInsurance,
      totalMonthly,
      downPaymentPercent,
      incomeRatio,
    });
    setCalculated(true);
  };

  const theme = useTheme();

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
            background: `linear-gradient(135deg, ${theme.palette.primary.main},  ${theme.palette.primary.light})`,
            boxShadow: 10,
          },
        },
      }}
    >
      <Scrollbar>
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          Mortgage Estimation for {listing.title}
        </DialogTitle>

        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {/* Agent Provided Values Display */}
              <Grid item xs={12}>
                <Typography variant="body2">
                  <strong>Property Price:</strong> $
                  {listing.price.toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  <strong>Monthly HOA:</strong> ${defaultHOA}
                </Typography>
                <Typography variant="body2">
                  <strong>Local Tax Rate (annual):</strong>{" "}
                  {defaultLocalTaxRate}%
                </Typography>
              </Grid>

              {/* Down Payment Input */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Down Payment ($)"
                  type="number"
                  fullWidth
                  value={downPayment === "" ? "" : downPayment}
                  onChange={(e) =>
                    setDownPayment(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  helperText="Enter your down payment or leave empty to use 20% of price"
                  InputProps={{
                    sx: { backgroundColor: "#fff", borderRadius: 1 },
                  }}
                />
              </Grid>

              {/* Insurance Input */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Annual Insurance ($)"
                  type="number"
                  fullWidth
                  value={insurance}
                  onChange={(e) => setInsurance(Number(e.target.value))}
                  helperText="Provide your value or use our estimate"
                  InputProps={{
                    sx: { backgroundColor: "#fff", borderRadius: 1 },
                  }}
                />
              </Grid>

              {/* Mortgage Rate Input */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Mortgage Rate (%)"
                  type="number"
                  fullWidth
                  value={mortgageRate}
                  onChange={(e) => setMortgageRate(Number(e.target.value))}
                  helperText="Enter your rate or use our estimate"
                  InputProps={{
                    sx: { backgroundColor: "#fff", borderRadius: 1 },
                  }}
                />
              </Grid>

              {/* Loan Term Input */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Loan Term (years)"
                  type="number"
                  fullWidth
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  helperText="Enter your preferred loan term"
                  InputProps={{
                    sx: { backgroundColor: "#fff", borderRadius: 1 },
                  }}
                />
              </Grid>

              {/* Monthly Income Input */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Monthly Income (optional)"
                  type="number"
                  fullWidth
                  value={monthlyIncome === "" ? "" : monthlyIncome}
                  onChange={(e) =>
                    setMonthlyIncome(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  helperText="Optional for income ratio insight"
                  InputProps={{
                    sx: { backgroundColor: "#fff", borderRadius: 1 },
                  }}
                />
              </Grid>

              {/* Veteran Checkbox */}
              <Grid item xs={12} sm={6}>
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
              </Grid>
            </Grid>
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
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom>
                  Mortgage Estimation Results
                </Typography>
                <Typography variant="body2">
                  <strong>Down Payment:</strong> $
                  {downPayment === ""
                    ? (listing.price * 0.2).toFixed(2)
                    : Number(downPayment).toFixed(2)}{" "}
                  ({result.downPaymentPercent.toFixed(2)}% of property price)
                </Typography>
                {result.downPaymentPercent < 20 && !veteran && (
                  <Typography variant="body2" color="error" mt={1}>
                    Warning: A down payment of less than 20% may require PMI.
                  </Typography>
                )}
                <Typography variant="body2" mt={1}>
                  <strong>Principal & Interest:</strong> $
                  {result.monthlyPI.toFixed(2)} per month
                </Typography>
                <Typography variant="body2">
                  <strong>Property Tax:</strong> ${result.monthlyTax.toFixed(2)}{" "}
                  per month
                </Typography>
                <Typography variant="body2">
                  <strong>Insurance:</strong> $
                  {result.monthlyInsurance.toFixed(2)} per month
                </Typography>
                <Typography variant="body2">
                  <strong>HOA:</strong> ${defaultHOA} per month
                </Typography>
                <Typography variant="body2" mt={1}>
                  <strong>Total Payment:</strong> $
                  {result.totalMonthly.toFixed(2)} per month
                </Typography>
                {result.incomeRatio !== undefined && (
                  <Typography variant="body2" mt={1}>
                    This payment represents {result.incomeRatio.toFixed(2)}% of
                    your monthly income.
                  </Typography>
                )}
                {result.downPaymentPercent < 20 && !veteran && (
                  <Box textAlign="center" mt={2}>
                    <Button variant="outlined" color="secondary">
                      Contact Us for More Info
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        </DialogActions>
      </Scrollbar>
    </Dialog>
  );
};

export default MortgageEstimationModal;
