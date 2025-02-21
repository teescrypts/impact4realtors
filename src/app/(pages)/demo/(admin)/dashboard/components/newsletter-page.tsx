"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from "@mui/material";
import { QuillEditor } from "@/app/component/quil-editor";

const recipientsList = ["All Subscribers", "Buyers", "Sellers", "Past Clients"];

const NewsletterPage = () => {
  const [subject, setSubject] = useState("");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [schedule, setSchedule] = useState("immediate");

  const handleSend = () => {
    console.log({ subject, recipients, content, schedule });
    // API call to send the newsletter
  };

  return (
    <Box>
      <TextField
        variant="outlined"
        label="Subject"
        fullWidth
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Recipients</InputLabel>
        <Select
          variant="outlined"
          label="Recipients"
          multiple
          value={recipients}
          onChange={(e) => setRecipients(e.target.value as string[])}
        >
          {recipientsList.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <QuillEditor
        value={content}
        onChange={(value: string) => setContent(value)}
        placeholder="Write something"
        sx={{ height: 500 }}
      />

      <FormControl fullWidth sx={{ my: 2 }}>
        <InputLabel>Schedule</InputLabel>
        <Select
          variant="outlined"
          label="Schedule"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
        >
          <MenuItem value="immediate">Send Now</MenuItem>
          <MenuItem value="schedule">Schedule for Later</MenuItem>
        </Select>
      </FormControl>

      <Button variant="contained" color="primary" onClick={handleSend}>
        Send Newsletter
      </Button>
    </Box>
  );
};

export default NewsletterPage;
