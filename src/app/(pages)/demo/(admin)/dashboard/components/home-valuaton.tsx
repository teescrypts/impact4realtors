"use client";
import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid2,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Button,
  useTheme,
  Container,
} from "@mui/material";
import HomeSmile from "@/app/icons/untitled-ui/duocolor/home-smile";
import CheckDone01 from "@/app/icons/untitled-ui/duocolor/check-done-01";
import CheckCircle from "@/app/icons/untitled-ui/duocolor/checked-circle";
import { ValuationRequest } from "../valuation/page";
import { updateValuationReq } from "@/app/actions/server-actions";
import notify from "@/app/utils/toast";
import EmptyState from "../../../(pages)/components/empty-state";

export default function EvaluationList({
  requests,
}: {
  requests: ValuationRequest[];
}) {
  const theme = useTheme();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const markAsDone = (id: string, status: "Pending" | "Done") => {
    setLoading(true);
    updateValuationReq(id, status).then((res) => {
      if (res) {
        if (res.error) {
          setMessage(res.error);
          setLoading(false);
        }
        if (res.message) {
          notify(res.message);
          setLoading(false);
        }
      }
    });
  };

  const getPurposeColor = (purpose: string) => {
    switch (purpose) {
      case "selling":
        return "primary";
      case "refinancing":
        return "secondary";
      case "curiosity":
        return "default";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: Date) =>
    new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${theme.palette.background.default}, ${theme.palette.action.hover})`,
        py: 6,
      }}
    >
      <Container maxWidth="xl">
        <Box>
          {/* Header */}
          <Typography variant="h4" fontWeight={700} color="text.primary" mb={1}>
            Home Valuation Requests
          </Typography>

          {/* Stats */}
          <Grid2 container spacing={3} mb={4}>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Card>
                <CardHeader title="Total Requests" />
                <CardContent>
                  <Typography variant="h4">{requests.length}</Typography>
                </CardContent>
              </Card>
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Card>
                <CardHeader title="Completed" />
                <CardContent>
                  <Typography variant="h4">
                    {requests.filter((r) => r.status === "Done").length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Card>
                <CardHeader title="Pending" />
                <CardContent>
                  <Typography variant="h4">
                    {requests.filter((r) => r.status === "Pending").length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          </Grid2>

          {/* Table */}
          {message && (
            <Typography color="error" textAlign={"center"} variant="subtitle2">
              {message}
            </Typography>
          )}
          <Card>
            <CardHeader
              avatar={<HomeSmile color="primary" />}
              title="Valuation Requests"
              subheader="All requests submitted through the website"
            />
            <CardContent>
              {requests.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Property</TableCell>
                        <TableCell>Purpose</TableCell>
                        <TableCell>Contact</TableCell>
                        <TableCell>Submitted</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {requests.map((req) => (
                        <TableRow
                          key={req._id}
                          sx={{
                            opacity: req.status === "Done" ? 0.6 : 1,
                            "&:hover": {
                              backgroundColor: theme.palette.action.hover,
                            },
                          }}
                        >
                          <TableCell>
                            <Typography fontWeight={600}>
                              {req.address}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {req.bedrooms} bed • {req.bathrooms} bath •{" "}
                              {req.squareFootage} sq ft
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Built {req.yearBuilt}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={req.purpose}
                              color={getPurposeColor(req.purpose)}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {req.firstName} {req.lastName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {req.email}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {req.phone}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(req.createdAt)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            {req.status === "Done" ? (
                              <Chip
                                icon={<CheckDone01 />}
                                label="Done"
                                color="success"
                                variant="outlined"
                              />
                            ) : (
                              <Chip
                                label="Pending"
                                color="warning"
                                variant="outlined"
                              />
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              size="small"
                              variant={
                                req.status === "Done" ? "outlined" : "contained"
                              }
                              color={
                                req.status === "Done" ? "inherit" : "success"
                              }
                              startIcon={<CheckCircle />}
                              disabled={loading || req.status === "Done"}
                              onClick={() =>
                                markAsDone(
                                  req._id,
                                  req.status === "Done" ? "Pending" : "Done"
                                )
                              }
                            >
                              {req.status === "Done"
                                ? "Report Sent"
                                : "Mark Done"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <EmptyState
                  title={"No Home valuation request"}
                  description="Home valuation requests will appear hear"
                />
              )}
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}
