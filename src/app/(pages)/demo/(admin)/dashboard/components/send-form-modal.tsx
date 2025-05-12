import { sendAgentForm } from "@/app/actions/server-actions";
import Close from "@/app/icons/untitled-ui/duocolor/close";
import notify from "@/app/utils/toast";
import {
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  Typography,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import React, { Dispatch, useState } from "react";

function SendFormModal({
  openSendModal,
  setOpenSendModal,
}: {
  openSendModal: boolean;
  setOpenSendModal: Dispatch<React.SetStateAction<boolean>>;
}) {
  const [emailInput, setEmailInput] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendForm = () => {
    if (emailInput) {
      setLoading(true);
      sendAgentForm(emailInput).then((res) => {
        if (res.error) {
          setMessage(res.error);
          setEmailInput("");
          setLoading(false);
        }

        if (res.message) {
          notify(res.message);
          setEmailInput("");
          setOpenSendModal(false);
          setLoading(false);
        }
      });
    }
  };

  return (
    <div>
      <Dialog
        open={openSendModal}
        onClose={() => setOpenSendModal(false)}
        fullWidth
        maxWidth="sm" // Wider modal
        slotProps={{
          paper: {
            sx: {
              borderRadius: 4,
              p: 3,
            },
          },
        }}
      >
        <DialogTitle
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          Send Agent Form
          <IconButton onClick={() => setOpenSendModal(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {message && (
            <Typography variant="subtitle2" textAlign={"center"} color="error">
              {message}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" mb={2}>
            Enter the agent&apos;s email address below to send them the onboarding
            form.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Agent Email"
            type="email"
            fullWidth
            variant="outlined"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "flex-end" }}>
          <Button onClick={() => setOpenSendModal(false)}>Cancel</Button>

          <Button
            disabled={loading}
            variant="contained"
            onClick={handleSendForm}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SendFormModal;
