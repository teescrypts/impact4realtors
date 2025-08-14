import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface ConfirmationModalProps {
  open: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  errMsg?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  onClose,
  onConfirm,
  confirmText = "Yes, Delete",
  cancelText = "Cancel",
  loading = false,
  errMsg,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={loading}>
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={loading}
        >
          {loading ? "loading..." : confirmText}
        </Button>
        {errMsg && (
          <Typography color="error" variant="subtitle2">
            {errMsg}
          </Typography>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
