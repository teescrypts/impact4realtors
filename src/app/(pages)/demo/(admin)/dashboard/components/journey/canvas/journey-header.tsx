"use client";

import { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  IconButton,
  Paper,
  Menu,
  MenuItem,
  SvgIcon,
} from "@mui/material";

import LoadMore from "@/app/icons/untitled-ui/duocolor/load-more";
import PlayArrow from "@/app/icons/untitled-ui/duocolor/play-arrow";
import Automation from "@/app/icons/untitled-ui/duocolor/automation";
import Save from "@/app/icons/untitled-ui/duocolor/save";
import { IJourney } from "../types/api";

import ArrowBack from "@/app/icons/untitled-ui/duocolor/arrow-back";
import Delete from "@/app/icons/untitled-ui/duocolor/delete";

// Add to interface
interface JourneyHeaderProps {
  journey?: IJourney; // Add this
  onBack?: () => void; // Add this
  onSave?: () => void; // Add this
  onActivate?: () => void; // Add this
  onDelete?: () => void; // Add this
  saving?: boolean; // Add this
}

// Use in component
export function JourneyHeader({
  journey,
  onBack,
  onSave,
  onActivate,
  onDelete,
  saving = false,
}: JourneyHeaderProps) {
  console.log(saving);
  // const { journey, resetJourney } = useJourneyStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  // const handleSave = () => {
  //   toast.success("Journey saved successfully!");
  // };

  // const handleActivate = () => {
  //   toast.success(
  //     "Journey activated! New leads will now enter this automation.",
  //   );
  // };

  // const handleReset = () => {
  //   resetJourney();
  //   toast.info("Journey has been reset to default.");
  //   setAnchorEl(null);
  // };

  return (
    <Paper
      square
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Box px={3} py={2}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Left */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* <Workflow size={20} /> */}
              <Automation />
            </Box>

            {journey && (
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  {journey.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {journey.description ||
                    "Visual automation for lead follow-up"}
                </Typography>
              </Box>
            )}
          </Stack>

          {/* Right */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              size="small"
            >
              <LoadMore />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={onBack}>
                <SvgIcon sx={{ marginRight: 8 }}>
                  <ArrowBack />
                </SvgIcon>
                Back
              </MenuItem>
            </Menu>

            <Button
              variant="contained"
              color="error"
              startIcon={<Delete />}
              onClick={onDelete}
            >
              Delete
            </Button>

            <Button variant="outlined" startIcon={<Save />} onClick={onSave}>
              Save
            </Button>

            <Button
              variant="contained"
              color="secondary"
              startIcon={<PlayArrow />}
              onClick={onActivate}
            >
              Activate
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}
