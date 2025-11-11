"use client";

import React, { useState, useEffect, useActionState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid2,
  TextField,
  MenuItem,
  IconButton,
  Typography,
  useTheme,
  Divider,
  Box,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { LeadType } from "@/app/model/lead";
import Close from "@/app/icons/untitled-ui/duocolor/close";
import { leadCategories } from "./data";
import { addLead, searchProperties } from "@/app/actions/server-actions";
import { SubmitButton } from "@/app/component/submit-buttton";
import { ActionStateType } from "@/types";
import notify from "@/app/utils/toast";

interface Property {
  _id: string;
  propertyTitle: string;
  location: string;
}

const initialState: ActionStateType = null;

export default function AddLeadDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const theme = useTheme();
  const [leadType, setLeadType] = useState<LeadType | "">("");
  const [leadStatus, setLeadStatus] = useState("");
  const [availableStatuses, setAvailableStatuses] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    source: "",
    note: "",
    propertyId: "",
  });
  const [openAutoComplete, setOpenAutoComplete] = useState(false);
  const [options, setOptions] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("");
  const [errMessage, setErrMsg] = useState("");

  const showPropertyField = leadType === "House Tour Leads";

  // Update available statuses when type changes
  useEffect(() => {
    if (leadType) {
      setAvailableStatuses([...leadCategories[leadType as LeadType]]);
      setLeadStatus("");
    } else {
      setAvailableStatuses([]);
    }
  }, [leadType]);

  useEffect(() => {
    if (!inputValue.trim()) {
      setOptions([]);
      return;
    }

    let active = true;
    setLoading(true);

    const fetchProperties = async () => {
      try {
        const res = await searchProperties(inputValue);
        if (active) {
          if (res.message) {
            setOptions(res.message);
          }

          if (res.error) {
            setMessage(res.error);
          }
        }
      } catch (err) {
        console.error(err);
        if (active) setOptions([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    const debounce = setTimeout(fetchProperties, 400);
    return () => {
      active = false;
      clearTimeout(debounce);
    };
  }, [inputValue]);

  const handleChange =
    (key: string | undefined) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (key) setFormData({ ...formData, [key]: e.target.value });
    };

  const addLeadWithData = addLead.bind(null, {
    ...formData,
    type: leadType as LeadType,
    status: leadStatus,
  });
  const [state, formAction] = useActionState(addLeadWithData, initialState);

  useEffect(() => {
    if (state) {
      if (state.error) setErrMsg(state.error);

      if (state.message) {
        notify(state.message);
        onClose();
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          source: "",
          note: "",
          propertyId: "",
        });

        setMessage("");
        setErrMsg("");
      }
    }
  }, [state, onClose]);

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              bgcolor: theme.palette.background.paper,
              boxShadow: theme.shadows[8],
            },
          },
        }}
      >
        <form action={formAction}>
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: `1px solid ${theme.palette.divider}`,
              pb: 2,
            }}
          >
            <Box>Add New Lead</Box>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent
            sx={{
              py: 3,
              px: 2,
            }}
          >
            {/* Section: Lead Type */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{ mb: 2, color: theme.palette.text.primary }}
              >
                Lead Information
              </Typography>

              {errMessage && (
                <Typography
                  textAlign={"center"}
                  color="error"
                  variant="subtitle2"
                >
                  {errMessage}
                </Typography>
              )}

              <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField
                    select
                    label="Lead Type"
                    variant="outlined"
                    required
                    value={leadType}
                    onChange={(e) => setLeadType(e.target.value as LeadType)}
                    fullWidth
                  >
                    <MenuItem value="House Tour Leads">
                      House Tour Leads
                    </MenuItem>
                    <MenuItem value="Home Seller Leads">
                      Home Seller Leads
                    </MenuItem>
                    <MenuItem value="Mortgage Inquiry Leads">
                      Mortgage Inquiry Leads
                    </MenuItem>
                    <MenuItem value="General Inquiry Leads">
                      General Inquiry Leads
                    </MenuItem>
                  </TextField>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField
                    select
                    label="Lead Status"
                    variant="outlined"
                    required
                    value={leadStatus}
                    onChange={(e) => setLeadStatus(e.target.value)}
                    fullWidth
                    disabled={!leadType}
                    helperText={!leadType ? "Select lead type first" : ""}
                  >
                    {availableStatuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid2>

                {showPropertyField && (
                  <Grid2 size={{ xs: 12 }}>
                    <Autocomplete
                      open={openAutoComplete}
                      onOpen={() => setOpenAutoComplete(true)}
                      onClose={() => setOpenAutoComplete(false)}
                      loading={loading}
                      options={options}
                      getOptionLabel={(option) => option.propertyTitle || ""}
                      isOptionEqualToValue={(option, value) =>
                        option._id === value._id
                      }
                      value={
                        options.find((p) => p._id === formData.propertyId) ||
                        null
                      }
                      onChange={(_, newValue) => {
                        setFormData({
                          ...formData,
                          propertyId: newValue?._id || "",
                        });
                        setOpenAutoComplete(false); // close on select
                      }}
                      noOptionsText="No matches found"
                      renderOption={(props, option) => {
                        const { ...rest } = props; // remove internal key
                        return (
                          <li
                            {...rest}
                            key={`${option._id}-${option.location}`}
                          >
                            <>
                              <strong>{option.propertyTitle}</strong> —{" "}
                              {option.location}
                            </>
                          </li>
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Property"
                          required
                          helperText={message ? message : ""}
                          onChange={(e) => setInputValue(e.target.value)}
                          slotProps={{
                            input: {
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {loading ? (
                                    <CircularProgress size={20} />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            },
                          }}
                        />
                      )}
                    />
                  </Grid2>
                )}
              </Grid2>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Section: Contact Info */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{ mb: 2, color: theme.palette.text.primary }}
              >
                Contact Details
              </Typography>
              <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="First Name"
                    placeholder="John"
                    variant="outlined"
                    required
                    fullWidth
                    value={formData.firstName}
                    onChange={handleChange("firstName")}
                  />
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Last Name"
                    placeholder="Doe"
                    required
                    variant="outlined"
                    fullWidth
                    value={formData.lastName}
                    onChange={handleChange("lastName")}
                  />
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Email"
                    placeholder="john.doe@example.com"
                    required
                    variant="outlined"
                    fullWidth
                    value={formData.email}
                    onChange={handleChange("email")}
                  />
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Phone"
                    required
                    placeholder="+1 (555) 123-4567"
                    variant="outlined"
                    fullWidth
                    value={formData.phone}
                    onChange={handleChange("phone")}
                  />
                </Grid2>
              </Grid2>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Section: Other Info */}
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{ mb: 2, color: theme.palette.text.primary }}
              >
                Additional Info
              </Typography>
              <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12 }}>
                  <TextField
                    label="Source"
                    variant="outlined"
                    placeholder="Website, Referral, Social Media, etc."
                    fullWidth
                    value={formData.source}
                    onChange={handleChange("source")}
                  />
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                  <TextField
                    label="Notes (Optional)"
                    placeholder="Add any extra details about this lead..."
                    fullWidth
                    multiline
                    variant="outlined"
                    minRows={3}
                    value={formData.note}
                    onChange={handleChange("note")}
                  />
                </Grid2>
              </Grid2>
            </Box>
          </DialogContent>

          <DialogActions
            sx={{
              borderTop: `1px solid ${theme.palette.divider}`,
              py: 2,
              px: 3,
            }}
          >
            <Button
              color="inherit"
              onClick={() => {
                setFormData({
                  firstName: "",
                  lastName: "",
                  email: "",
                  phone: "",
                  source: "",
                  note: "",
                  propertyId: "",
                });

                setMessage("");
                setErrMsg("");
              }}
            >
              Clear
            </Button>
            <SubmitButton title={"Add Lead"} isFullWidth={false} />
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
