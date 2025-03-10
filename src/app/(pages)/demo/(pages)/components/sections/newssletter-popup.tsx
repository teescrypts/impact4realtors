"use client";

import React, { useState, useEffect, useActionState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  IconButton,
  Box,
  useTheme,
} from "@mui/material";
import Fade from "@mui/material/Fade";
import Close from "@/app/icons/untitled-ui/duocolor/close";
import { addNewsLetter } from "@/app/actions/server-actions";
import { ActionStateType } from "@/types";
import notify from "@/app/utils/toast";
import { SubmitButton } from "@/app/component/submit-buttton";

const initialState: ActionStateType = null;

const NewsletterPopup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  // Show the popup after 3 seconds
  useEffect(() => {
    const isOpened = localStorage.getItem("newsletterOpened");

    if (!isOpened) {
      const timer = setTimeout(() => {
        setOpen(true);
        localStorage.setItem("newsletterOpened", "true");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const [state, formAction] = useActionState(addNewsLetter, initialState);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (state) {
      if (state?.error) setMessage(state.error);
      if (state?.message) {
        notify(state.message);
        handleClose();
      }
    }
  }, [state]);

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
            background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.alpha50})`,
            boxShadow: 10,
          },
        },
      }}
    >
      <form action={formAction}>
        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={handleClose} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </Box>
        <DialogTitle sx={{ color: "white", textAlign: "center" }}>
          Subscribe to Our Newsletter
        </DialogTitle>
        <DialogContent>
          {message && (
            <Typography variant="subtitle2" color="error" textAlign={"center"}>
              {message}
            </Typography>
          )}
          <Typography variant="body1" color="white" textAlign="center" mb={2}>
            Stay updated with the latest in real estate news, trends, and
            exclusive offers!
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter your email"
            name="email"
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
          <SubmitButton title="SUBSCRIBE" isFullWidth={false} />
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default NewsletterPopup;
