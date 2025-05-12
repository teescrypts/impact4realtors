"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

interface ConfirmDeleteAgentModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  agentName?: string;
  loading: boolean;
}

export default function ConfirmDeleteAgentModal({
  open,
  onClose,
  onConfirm,
  agentName,
  loading,
}: ConfirmDeleteAgentModalProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Agent</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete{" "}
          <strong>{agentName || "this agent"}</strong>? This action cannot be
          undone. All associated data including appointments, leads, properties,
          and notifications will be permanently deleted.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          disabled={loading}
          onClick={onConfirm}
          variant="contained"
          color="error"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
