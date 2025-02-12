"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  IconButton,
  Box,
  useTheme,
} from "@mui/material";
import Fade from "@mui/material/Fade";
import Close from "@/app/icons/untitled-ui/duocolor/close";

const NewsletterPopup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  // Show the popup after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slots={{ transition: Fade }}
      transitionDuration={500}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            p: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
            boxShadow: 10,
          },
        },
      }}
    >
      <Box display="flex" justifyContent="flex-end">
        <IconButton onClick={handleClose} sx={{ color: "white" }}>
          <Close />
        </IconButton>
      </Box>
      <DialogTitle sx={{ color: "white", textAlign: "center" }}>
        Subscribe to Our Newsletter
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" color="white" textAlign="center" mb={2}>
          Stay updated with the latest in real estate news, trends, and
          exclusive offers!
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Enter your email"
          slotProps={{
            inputLabel: { style: { color: "white" } },
          }}
          sx={{
            backgroundColor: "white",
            borderRadius: 1,
          }}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleClose}>
          Subscribe Now
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewsletterPopup;
