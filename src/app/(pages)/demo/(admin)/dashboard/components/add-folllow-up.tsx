import React, { useState } from "react";
import {
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import EmailComposer from "../../components/email-composer";

type FollowUpType = "Email" | "SMS" | "Meeting";

interface AddManualFollowUpModalProps {
  open: boolean;
  onClose: () => void;
  onAddFollowUp: (followUp: {
    type: FollowUpType;
    subject?: string;
    body?: string;
    scheduledAt: Date;
  }) => void;
  defaultScheduledAt?: Date;
  defaultToEmail?: string;
}

export default function AddManualFollowUpModal({
  open,
  onClose,
  onAddFollowUp,
  defaultScheduledAt,
  defaultToEmail = "",
}: AddManualFollowUpModalProps) {
  const [type, setType] = useState<FollowUpType>("Email");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [scheduledAt, setScheduledAt] = useState(
    defaultScheduledAt ? defaultScheduledAt.toISOString().slice(0, 16) : "",
  );

  const handleAdd = () => {
    if (!scheduledAt) return;
    onAddFollowUp({
      type,
      subject: type === "Email" ? subject : undefined,
      body,
      scheduledAt: new Date(scheduledAt),
    });
    // Reset form
    setType("Email");
    setSubject("");
    setBody("");
    setScheduledAt("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Manual Follow-up</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          {/* Follow-up Type */}
          <TextField
            select
            label="Follow-up Type"
            value={type}
            onChange={(e) => setType(e.target.value as FollowUpType)}
            fullWidth
          >
            <MenuItem value="Email">Email</MenuItem>
            <MenuItem value="SMS">SMS</MenuItem>
            <MenuItem value="Meeting">Meeting</MenuItem>
          </TextField>

          {/* Scheduled Date/Time */}
          <TextField
            label="Scheduled Date & Time"
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          {/* Email Composer */}
          {type === "Email" && (
            <EmailComposer
              to={defaultToEmail}
              subject={subject}
              body={body}
              onSend={({ subject: s, body: b }) => {
                setSubject(s);
                setBody(b);
              }}
              onCancel={() => {
                setSubject("");
                setBody("");
              }}
            />
          )}

          {/* SMS/Meeting Notes */}
          {type !== "Email" && (
            <TextField
              label="Notes"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Add Follow-up
        </Button>
      </DialogActions>
    </Dialog>
  );
}
