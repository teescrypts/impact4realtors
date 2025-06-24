"use client";

import {
  Avatar,
  Box,
  Button,
  Container,
  FormControl,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import notify from "@/app/utils/toast";
import { Country, State } from "country-state-city";
import {
  updateAgentProfile,
  uploadProfilePic,
} from "@/app/actions/server-actions";
import { AgentType } from "../profile/page";

export default function AgentAccountPage({ agent }: { agent: AgentType }) {
  const [currentAgent, setCurrentAgent] = useState<AgentType | undefined>();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [countryCode, setCountryCode] = useState<string>("");
  const [stateCode, setStateCode] = useState<string>("");
  const [licensedStates, setLicensedStates] = useState<
    { country: string; state: string; postalCode?: string }[]
  >([]);
  const [newLicensedState, setNewLicensedState] = useState<{
    country: string;
    state: string;
    postalCode?: string;
  }>({ country: "", state: "", postalCode: "" });

  const [message, setMessage] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCurrentAgent(agent);
    setLicensedStates(agent.licensedStates || []);
  }, [agent]);

  const toggleProfileEdit = () => {
    setIsEditingProfile((prev) => !prev);
  };

  const handleProfileChange = <K extends keyof AgentType>(
    field: K,
    value: AgentType[K]
  ) => {
    setCurrentAgent((prev) => {
      if (prev) {
        return { ...prev, [field]: value };
      }
    });
  };

  const handleAddLicensedState = () => {
    if (!countryCode || !stateCode) {
      notify("Please select both country and state");
      return;
    }

    const country = Country.getCountryByCode(countryCode)?.name || "";
    const state =
      State.getStateByCodeAndCountry(stateCode, countryCode)?.name || "";

    const newEntry = {
      country,
      state,
      postalCode: newLicensedState.postalCode,
    };

    setLicensedStates((prev) => [...prev, newEntry]);

    // Reset form
    setCountryCode("");
    setStateCode("");
    setNewLicensedState({ country: "", state: "", postalCode: "" });
  };

  const handleSaveChanges = () => {
    // TODO: Call your update API here
    toggleProfileEdit();
    if (currentAgent) {
      updateAgentProfile({ ...currentAgent, licensedStates }).then((res) => {
        if (res.error) setMsg(res.error);
        if (res.message) notify(res.message);
      });
    }
  };

  if (!currentAgent) return null;

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Agent Account Management
      </Typography>

      {/* Profile Section */}
      <Box mt={4}>
        <Stack direction="row" alignItems="center" spacing={3} mb={3}>
          <Avatar
            src={currentAgent.profilePictureUrl}
            sx={{ width: 80, height: 80 }}
          />
          <Stack spacing={1}>
            <Button disabled={loading} variant="outlined" component="label">
              Upload New Picture
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  setLoading(true);
                  const file = e.target.files?.[0];
                  if (file) {
                    const formData = new FormData();
                    formData.append("file", file);

                    uploadProfilePic(formData).then((result) => {
                      if (result.error) {
                        setMessage(result.error);
                        setLoading(false);
                      }

                      if (result.message) {
                        notify(result.message);
                        setLoading(false);
                      }
                    });
                  }
                }}
              />
            </Button>
            <Typography variant="caption" color="text.secondary">
              Recommended size: 300×300px. JPG or PNG.
            </Typography>
            {message && (
              <Typography variant="body2" color="error">
                {message}
              </Typography>
            )}
          </Stack>
        </Stack>

        {msg && (
          <Typography variant="subtitle2" textAlign={"center"} color="error">
            {msg}
          </Typography>
        )}

        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
              variant="outlined"
              label="First Name"
              fullWidth
              disabled={!isEditingProfile}
              value={currentAgent.firstName}
              onChange={(e) => handleProfileChange("firstName", e.target.value)}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
              variant="outlined"
              label="Last Name"
              fullWidth
              disabled={!isEditingProfile}
              value={currentAgent.lastName}
              onChange={(e) => handleProfileChange("lastName", e.target.value)}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
              variant="outlined"
              label="Phone"
              fullWidth
              disabled={!isEditingProfile}
              value={currentAgent.phone}
              onChange={(e) => handleProfileChange("phone", e.target.value)}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
              variant="outlined"
              label="License Number"
              fullWidth
              disabled={!isEditingProfile}
              value={currentAgent.licenseNumber}
              onChange={(e) =>
                handleProfileChange("licenseNumber", e.target.value)
              }
            />
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <TextField
              variant="outlined"
              label="Bio"
              fullWidth
              multiline
              rows={4}
              disabled={!isEditingProfile}
              value={currentAgent.bio}
              onChange={(e) => handleProfileChange("bio", e.target.value)}
            />
          </Grid2>
        </Grid2>
      </Box>

      {/* Licensed States Section */}
      <Box mt={4}>
        {/* Licensed States List */}
        <Box mb={4}>
          <Typography variant="subtitle1" gutterBottom>
            Licensed States
          </Typography>
          <Stack spacing={2}>
            {licensedStates.map((item, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                p={2}
                border="1px solid #e0e0e0"
                borderRadius={2}
              >
                <Box>
                  <Typography>
                    {item.state}, {item.country} —{" "}
                    {item.postalCode || "No postal code"}
                  </Typography>
                </Box>
                <Button
                  color="error"
                  onClick={() => {
                    setLicensedStates((prev) =>
                      prev.filter((_, i) => i !== index)
                    );
                  }}
                >
                  Delete
                </Button>
              </Box>
            ))}
            {licensedStates.length === 0 && (
              <Typography color="text.secondary">
                No licensed states added.
              </Typography>
            )}
          </Stack>
        </Box>

        <Stack direction={"column"} spacing={2}>

          <FormControl sx={{ minWidth: 200, mr: 2 }}>
            <InputLabel>Country</InputLabel>
            <Select
              variant="outlined"
              value={countryCode}
              label="Country"
              onChange={(e) => {
                setCountryCode(e.target.value);
                setStateCode(""); // Reset state when country changes
              }}
              disabled={!isEditingProfile}
            >
              {Country.getAllCountries().map((c) => (
                <MenuItem key={c.isoCode} value={c.isoCode}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200, mr: 2 }}>
            <InputLabel>State</InputLabel>
            <Select
              variant="outlined"
              value={stateCode}
              label="State"
              onChange={(e) => setStateCode(e.target.value)}
              disabled={!countryCode || !isEditingProfile}
            >
              {State.getStatesOfCountry(countryCode).map((s) => (
                <MenuItem key={s.isoCode} value={s.isoCode}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            variant="outlined"
            label="Postal Code"
            value={newLicensedState.postalCode || ""}
            onChange={(e) =>
              setNewLicensedState({
                ...newLicensedState,
                postalCode: e.target.value,
              })
            }
            disabled={!isEditingProfile}
          />

        </Stack>

        <Button
          disabled={!isEditingProfile}
          variant="contained"
          onClick={handleAddLicensedState}
          sx={{ my: 4 }}
        >
          Add
        </Button>
      </Box>

      <Box>
        <Button
          variant={isEditingProfile ? "contained" : "outlined"}
          onClick={isEditingProfile ? handleSaveChanges : toggleProfileEdit}
        >
          {isEditingProfile ? "Save Changes" : "Edit Profile"}
        </Button>
      </Box>
    </Container>
  );
}
