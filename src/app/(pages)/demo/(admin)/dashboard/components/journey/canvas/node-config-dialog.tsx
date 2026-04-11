import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  Paper,
  Box,
  Autocomplete,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  NodeType,
  DelayData,
  TriggerData,
  SendEmailData,
  MeetingReminderData,
  SmsReminderData,
  CallReminderData,
  DelayUnit,
} from "./type";
import { ITag } from "../../tag/types/tag";
import { QuillEditor } from "@/app/component/quil-editor";

interface NodeConfigDialogProps {
  isOpen: boolean;
  nodeType: Exclude<NodeType, "entry"> | null;
  onClose: () => void;
  onConfirm: (data: any) => void;
  tags: ITag[]; // ✅ Add tags prop
  tagsLoading?: boolean; // ✅ Add loading state
}

export function NodeConfigDialog({
  isOpen,
  nodeType,
  onClose,
  onConfirm,
  tags,
  tagsLoading = false,
}: NodeConfigDialogProps) {
  // Delay state
  const [delayDuration, setDelayDuration] = useState(1);
  const [delayUnit, setDelayUnit] = useState<DelayUnit>("days");

  // Trigger state
  const [waitForTag, setWaitForTag] = useState("");

  // Email state
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [fromName, setFromName] = useState("");

  // Meeting state
  const [meetingTitle, setMeetingTitle] = useState("Schedule a meeting");
  const [meetingMessage, setMeetingMessage] = useState("");

  // SMS state
  const [smsMessage, setSmsMessage] = useState("");

  // Call state
  const [callMessage, setCallMessage] = useState("");

  const handleConfirm = () => {
    let data: any;

    switch (nodeType) {
      case "delay":
        data = { duration: delayDuration, unit: delayUnit } as DelayData;
        break;
      case "trigger":
        data = { waitForTag, description: "" } as TriggerData;
        break;
      case "send_email":
        data = {
          subject: emailSubject,
          emailContent,
          fromName: fromName || undefined,
        } as SendEmailData;
        break;
      case "meeting_reminder":
        data = {
          title: meetingTitle,
          message: meetingMessage,
        } as MeetingReminderData;
        break;
      case "sms_reminder":
        data = { message: smsMessage } as SmsReminderData;
        break;
      case "call_reminder":
        data = { message: callMessage } as CallReminderData;
        break;
      default:
        data = {};
    }

    onConfirm(data);
    resetForm();
  };

  const resetForm = () => {
    setDelayDuration(1);
    setDelayUnit("days");
    setWaitForTag("");
    setEmailSubject("");
    setEmailContent("");
    setFromName("");
    setMeetingTitle("Schedule a meeting");
    setMeetingMessage("");
    setSmsMessage("");
    setCallMessage("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const isValid = () => {
    switch (nodeType) {
      case "delay":
        return delayDuration > 0;
      case "trigger":
        return waitForTag.trim().length > 0;
      case "send_email":
        return emailSubject.trim().length > 0 && emailContent.trim().length > 0;
      case "meeting_reminder":
        return (
          meetingTitle.trim().length > 0 && meetingMessage.trim().length > 0
        );
      case "sms_reminder":
        return smsMessage.trim().length > 0;
      case "call_reminder":
        return callMessage.trim().length > 0;
      default:
        return false;
    }
  };

  const getTitle = () => {
    switch (nodeType) {
      case "delay":
        return "Configure Time Delay";
      case "trigger":
        return "Configure Wait for Tag";
      case "send_email":
        return "Configure Email";
      case "meeting_reminder":
        return "Configure Meeting Reminder";
      case "sms_reminder":
        return "Configure SMS Reminder";
      case "call_reminder":
        return "Configure Call Reminder";
      default:
        return "Configure Step";
    }
  };

  if (!nodeType) return null;

  // Condition nodes don't need configuration (shouldn't reach here)
  if (nodeType === "condition") return null;

  // ✅ Separate system and custom tags
  const systemTags = tags.filter((t) => t.isSystem);
  const customTags = tags.filter((t) => !t.isSystem);

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{getTitle()}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} mt={1}>
          {/* DELAY */}
          {nodeType === "delay" && (
            <>
              <Stack direction="row" spacing={2}>
                <TextField
                  type="number"
                  label="Duration"
                  value={delayDuration}
                  inputProps={{ min: 1 }}
                  onChange={(e) =>
                    setDelayDuration(Number(e.target.value) || 1)
                  }
                  fullWidth
                  autoFocus
                />
                <TextField
                  select
                  label="Unit"
                  value={delayUnit}
                  onChange={(e) => setDelayUnit(e.target.value as DelayUnit)}
                  SelectProps={{ native: true }}
                  sx={{ minWidth: 120 }}
                >
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </TextField>
              </Stack>
              <Paper sx={{ p: 2, bgcolor: "info.50" }}>
                <Typography variant="body2" color="text.secondary">
                  Journey will pause for{" "}
                  <strong>
                    {delayDuration} {delayUnit}
                  </strong>{" "}
                  before continuing.
                </Typography>
              </Paper>
            </>
          )}

          {/* TRIGGER - ✅ Dynamic tag selection */}
          {nodeType === "trigger" && (
            <>
              {tagsLoading ? (
                <Box display="flex" justifyContent="center" py={2}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <>
                  {/* Show info about available tags */}
                  {tags.length > 0 && (
                    <Stack direction="row" spacing={1} mb={1}>
                      <Chip
                        label={`${systemTags.length} System Tags`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Chip
                        label={`${customTags.length} Custom Tags`}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    </Stack>
                  )}

                  {/* Tag Autocomplete */}
                  <Autocomplete
                    options={tags}
                    getOptionLabel={(tag) => tag.name}
                    groupBy={(tag) =>
                      tag.isSystem
                        ? "📋 System Pipeline Stages"
                        : "🏷️ Your Custom Tags"
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Wait for Tag"
                        placeholder="Select a tag..."
                        helperText={`Select from ${tags.length} available tags`}
                        required
                        autoFocus
                      />
                    )}
                    renderOption={(props, tag) => {
                      const { key, ...otherProps } = props;
                      return (
                        <li key={key} {...otherProps}>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Typography>{tag.name}</Typography>
                            {tag.isSystem && (
                              <Chip
                                label="System"
                                size="small"
                                sx={{
                                  height: 18,
                                  fontSize: "0.65rem",
                                  bgcolor: "primary.50",
                                  color: "primary.main",
                                }}
                              />
                            )}
                          </Stack>
                        </li>
                      );
                    }}
                    value={tags.find((t) => t.name === waitForTag) || null}
                    onChange={(_, tag) => setWaitForTag(tag?.name || "")}
                    isOptionEqualToValue={(option, value) =>
                      option.name === value.name
                    }
                    noOptionsText="No tags available. Please create tags in Tag Management."
                  />

                  {/* Empty state */}
                  {tags.length === 0 && (
                    <Paper sx={{ p: 2, bgcolor: "warning.50" }}>
                      <Typography variant="body2" color="text.secondary">
                        ⚠️ No tags available. Please create tags in the Tag
                        Management section first.
                      </Typography>
                    </Paper>
                  )}

                  {/* Selected tag preview */}
                  {waitForTag && (
                    <Paper sx={{ p: 2, bgcolor: "warning.50" }}>
                      <Typography variant="body2" color="text.secondary">
                        ⏸️ Journey will <strong>pause here</strong> until the
                        tag &quot;{waitForTag}&quot; is assigned to the lead.
                      </Typography>
                    </Paper>
                  )}
                </>
              )}
            </>
          )}

          {/* SEND EMAIL */}
          {nodeType === "send_email" && (
            <>
              <TextField
                label="From Name (optional)"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                placeholder="John Doe"
                fullWidth
              />
              <TextField
                label="Subject Line"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Your dream home awaits..."
                fullWidth
                required
                autoFocus
              />
              <Box>
                <QuillEditor
                  value={emailContent}
                  onChange={(value: string) => setEmailContent(value)}
                placeholder={`Hi {{firstName}},\n\nI wanted to reach out about...`}
                  sx={{ height: 350 }}
                />
                <input defaultValue={emailContent} hidden name="content" />
              </Box>
              <Paper sx={{ p: 1.5, bgcolor: "success.50" }}>
                <Typography variant="caption" color="text.secondary">
                  💡 Use {"{{firstName}}"}, {"{{lastName}}"}, {"{{email}}"} for
                  personalization
                </Typography>
              </Paper>
            </>
          )}

          {/* MEETING REMINDER */}
          {nodeType === "meeting_reminder" && (
            <>
              <TextField
                label="Meeting Title"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                placeholder="Schedule property viewing"
                fullWidth
                required
                autoFocus
              />
              <TextField
                label="Reminder Message"
                value={meetingMessage}
                onChange={(e) => setMeetingMessage(e.target.value)}
                placeholder="Reach out to schedule a property viewing"
                multiline
                minRows={4}
                fullWidth
                required
              />
              <Paper sx={{ p: 2, bgcolor: "secondary.50" }}>
                <Typography variant="body2" color="text.secondary">
                  📅 You&apos;ll receive a reminder to schedule a meeting
                </Typography>
              </Paper>
            </>
          )}

          {/* SMS REMINDER */}
          {nodeType === "sms_reminder" && (
            <>
              <TextField
                label="Reminder Message"
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                placeholder="Send SMS to follow up on property interest"
                multiline
                minRows={4}
                fullWidth
                required
                autoFocus
              />
              <Paper sx={{ p: 2, bgcolor: "secondary.50" }}>
                <Typography variant="body2" color="text.secondary">
                  💬 You&apos;ll receive a reminder to send an SMS
                </Typography>
              </Paper>
            </>
          )}

          {/* CALL REMINDER */}
          {nodeType === "call_reminder" && (
            <>
              <TextField
                label="Call Notes"
                value={callMessage}
                onChange={(e) => setCallMessage(e.target.value)}
                placeholder="Follow up on property inquiry, discuss financing..."
                multiline
                minRows={5}
                fullWidth
                required
                autoFocus
              />
              <Paper sx={{ p: 2, bgcolor: "secondary.50" }}>
                <Typography variant="body2" color="text.secondary">
                  📞 You&apos;ll receive a reminder to call the lead
                </Typography>
              </Paper>
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!isValid() || tagsLoading}
        >
          Add to Journey
        </Button>
      </DialogActions>
    </Dialog>
  );
}
