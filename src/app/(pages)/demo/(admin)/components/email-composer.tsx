import React, { useState } from "react";
import {
  Box,
  TextField,
  Stack,
  Button,
  Typography,
} from "@mui/material";
import { QuillEditor } from "@/app/component/quil-editor";

interface EmailComposerProps {
  to?: string;
  subject?: string;
  body?: string;
  onSend?: (email: { to: string; subject: string; body: string }) => void;
  onCancel?: () => void;
}

export default function EmailComposer({
  to: initialTo = "",
  subject: initialSubject = "",
  body: initialBody = "",
  onSend,
  onCancel,
}: EmailComposerProps) {


  const [to, setTo] = useState(initialTo);
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);

  const handleSend = () => {
    if (!to || !subject || !body) return;
    onSend?.({ to, subject, body });
  };

  return (
    <Stack spacing={2} sx={{ width: "100%", p: 2 }}>
      {/* To Field */}
      <TextField
        label="To"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        fullWidth
      />

      {/* Subject Field */}
      <TextField
        label="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        fullWidth
      />

      {/* Body Editor */}
      <Box sx={{ height: 300 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Body
        </Typography>
        <QuillEditor value={body} onChange={setBody} />
      </Box>

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSend}>
          Send
        </Button>
      </Stack>
    </Stack>
  );
}
