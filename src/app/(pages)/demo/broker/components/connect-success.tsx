"use client";

import CheckDone01 from "@/app/icons/untitled-ui/duocolor/check-done-01";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";

interface ConnectSuccessModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ConnectSuccessModal({
  open,
  onClose,
}: ConnectSuccessModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <CheckDone01 color="success" />
          <Typography variant="h6" component="div">
            You&apos;re Matched with Local Experts!
          </Typography>
        </Box>
      </DialogTitle>

      {/* Animate the content using motion.div */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <DialogContent>
          <Typography variant="body1" color="text.secondary" mt={1}>
            Thank you for reaching out. We&apos;ve matched you with local real estate
            professionals in your area. One of our experts will contact you
            shortly to help start your journey.
          </Typography>
        </DialogContent>
      </motion.div>

      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Got it
        </Button>
      </DialogActions>
    </Dialog>
  );
}
