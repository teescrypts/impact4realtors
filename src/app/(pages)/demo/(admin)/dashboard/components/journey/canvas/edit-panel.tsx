import { motion } from "framer-motion";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Button,
  Divider,
  TextField,
  useTheme,
  Paper,
  Autocomplete,
  Chip,
  CircularProgress,
} from "@mui/material";

import { JSX } from "react";
import Timer from "@/app/icons/untitled-ui/duocolor/timer";
import Zap from "@/app/icons/untitled-ui/duocolor/zap";
import { useJourneyStore } from "./journey-store";
import {
  ConditionData,
  DEFAULT_CONDITION_WAIT,
  WAIT_OPTIONS,
  waitToMinutes,
  formatWait,
  DelayData,
  TriggerData,
  SendEmailData,
  MeetingReminderData,
  SmsReminderData,
  CallReminderData,
  DelayUnit,
} from "./type";
import Branch from "@/app/icons/untitled-ui/duocolor/branch";
import Visibility from "@/app/icons/untitled-ui/duocolor/visibility";
import StackedEmail from "@/app/icons/untitled-ui/duocolor/stacked-email";
import Calendar from "@/app/icons/untitled-ui/duocolor/calendar";
import MessageChatSquare from "@/app/icons/untitled-ui/duocolor/message-chat-square";
import Call from "@/app/icons/untitled-ui/duocolor/call";
import Delete from "@/app/icons/untitled-ui/duocolor/delete";
import Close from "@/app/icons/untitled-ui/duocolor/close";
import { ITag } from "../../tag/types/tag";
import { EmailContentEditor } from "./email-content-editor";

interface EditPanelProps {
  node: any;
  onClose: () => void;
  tags: ITag[];
  tagsLoading?: boolean;
}

export function EditPanel({
  node,
  onClose,
  tags,
  tagsLoading = false,
}: EditPanelProps) {
  const theme = useTheme();
  const { updateNode, deleteNode, journey } = useJourneyStore();
  const isEntryNode = node.id === journey.entryNodeId;

  // ✅ Safety check: Ensure node has data
  if (!node || !node.data) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          Error: Node data not found. Please try reloading the journey.
        </Typography>
      </Box>
    );
  }

  const iconMap: Record<string, JSX.Element> = {
    entry: <Zap />,
    condition: <Branch />,
    delay: <Timer />,
    trigger: <Visibility />,
    send_email: <StackedEmail />,
    meeting_reminder: <Calendar />,
    sms_reminder: <MessageChatSquare />,
    call_reminder: <Call />,
  };

  const titleMap: Record<string, string> = {
    entry: "Entry Point",
    condition: "Email Opened?",
    delay: "Time Delay",
    trigger: "Wait for Tag",
    send_email: "Send Email",
    meeting_reminder: "Meeting Reminder",
    sms_reminder: "SMS Reminder",
    call_reminder: "Call Reminder",
  };

  return (
    <Box
      component={motion.div}
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      sx={{
        position: "fixed",
        top: 0,
        right: 0,
        height: "100vh",
        width: 500,
        bgcolor: "background.paper",
        borderLeft: `1px solid ${theme.palette.divider}`,
        zIndex: 1300,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} p={2.5}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            bgcolor: "action.hover",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {iconMap[node.type]}
        </Box>

        <Box flex={1}>
          <Typography variant="h6" fontWeight={600}>
            {titleMap[node.type]}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Configure this step
          </Typography>
        </Box>

        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </Stack>

      <Divider />

      {/* Content */}
      <Box flex={1} p={2.5} overflow="auto">
        {node.type === "entry" && <EntryNodeEditor />}

        {node.type === "condition" && (
          <ConditionNodeEditor
            data={node.data as ConditionData}
            onUpdate={(data) => updateNode(node.id, { data })}
          />
        )}

        {node.type === "delay" && (
          <DelayNodeEditor
            data={node.data as DelayData}
            onUpdate={(data) => updateNode(node.id, { data })}
          />
        )}

        {node.type === "trigger" && (
          <TriggerNodeEditor
            data={node.data as TriggerData}
            onUpdate={(data) => updateNode(node.id, { data })}
            tags={tags}
            tagsLoading={tagsLoading}
          />
        )}

        {node.type === "send_email" && (
          <SendEmailNodeEditor
            data={node.data as SendEmailData}
            onUpdate={(data) => updateNode(node.id, { data })}
          />
        )}

        {node.type === "meeting_reminder" && (
          <MeetingReminderNodeEditor
            data={node.data as MeetingReminderData}
            onUpdate={(data) => updateNode(node.id, { data })}
          />
        )}

        {node.type === "sms_reminder" && (
          <SmsReminderNodeEditor
            data={node.data as SmsReminderData}
            onUpdate={(data) => updateNode(node.id, { data })}
          />
        )}

        {node.type === "call_reminder" && (
          <CallReminderNodeEditor
            data={node.data as CallReminderData}
            onUpdate={(data) => updateNode(node.id, { data })}
          />
        )}
      </Box>

      {/* Footer */}
      {!isEntryNode && (
        <>
          <Divider />
          <Box p={2.5}>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={() => {
                deleteNode(node.id);
                onClose();
              }}
            >
              Delete Step
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}

function EntryNodeEditor() {
  return (
    <Stack spacing={2}>
      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          bgcolor: "primary.50",
          borderColor: "primary.main",
        }}
      >
        <Typography variant="body2">
          This is the starting point of your journey. Leads enter here based on
          the entry conditions you set when creating the journey.
        </Typography>
      </Paper>
    </Stack>
  );
}

// ✅ UPDATED: Simplified condition editor (only email_opened)
function ConditionNodeEditor({
  data,
  onUpdate,
}: {
  data: ConditionData;
  onUpdate: (data: ConditionData) => void;
}) {
  // Nodes saved before the wait window was configurable have no `waitFor`;
  // show the default the engine will actually apply.
  const waitFor = data.waitFor ?? DEFAULT_CONDITION_WAIT;
  const waitMinutes = waitToMinutes(waitFor);

  // A window saved outside the preset list (or written in different units)
  // still needs something selected, so offer it alongside the presets.
  const options = WAIT_OPTIONS.some(
    (option) => waitToMinutes(option.value) === waitMinutes,
  )
    ? WAIT_OPTIONS
    : [{ label: formatWait(waitFor), value: waitFor }, ...WAIT_OPTIONS];

  const selectWait = (minutes: number) => {
    const chosen = options.find(
      (option) => waitToMinutes(option.value) === minutes,
    );
    if (chosen) onUpdate({ ...data, waitFor: { ...chosen.value } });
  };

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 2.5, bgcolor: "background.default", borderRadius: 2 }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          How it works:
        </Typography>

        <Stack spacing={2} mt={2}>
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                bgcolor: "success.main",
                color: "white",
                borderRadius: 1,
                fontSize: "0.75rem",
                fontWeight: 600,
                minWidth: 40,
                textAlign: "center",
              }}
            >
              YES
            </Box>
            <Typography variant="body2" color="text.secondary">
              They open your email → they carry on down the &quot;Yes&quot;
              path
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                bgcolor: "error.main",
                color: "white",
                borderRadius: 1,
                fontSize: "0.75rem",
                fontWeight: 600,
                minWidth: 40,
                textAlign: "center",
              }}
            >
              NO
            </Box>
            <Typography variant="body2" color="text.secondary">
              They don&apos;t open it in time → they carry on down the
              &quot;No&quot; path
            </Typography>
          </Stack>
        </Stack>
      </Paper>

      {/* How long to give the lead before treating it as "not opened" */}
      <TextField
        select
        label="How long should we give them?"
        value={waitMinutes}
        onChange={(e) => selectWait(Number(e.target.value))}
        SelectProps={{ native: true }}
        helperText="Most agents give it a couple of days."
        fullWidth
      >
        {options.map((option) => (
          <option
            key={option.label}
            value={waitToMinutes(option.value)}
          >
            {option.label}
          </option>
        ))}
      </TextField>

      <Paper
        variant="outlined"
        sx={{ p: 2.5, bgcolor: "info.50", borderColor: "info.main" }}
      >
        <Typography variant="body2">
          We&apos;ll wait <strong>{formatWait(waitFor)}</strong> for them to
          open it. If they open it sooner, they move on straight away — no need
          to wait out the full time.
        </Typography>
      </Paper>

      <Paper
        variant="outlined"
        sx={{ p: 2.5, bgcolor: "warning.50", borderColor: "warning.main" }}
      >
        <Typography variant="body2">
          Worth knowing: some email apps don&apos;t tell us when a message is
          opened. A few people may take the &quot;No&quot; path even though
          they read your email, so it&apos;s best to keep that path friendly.
        </Typography>
      </Paper>

      <TextField
        label="Description (optional)"
        value={data.description || ""}
        onChange={(e) => onUpdate({ ...data, description: e.target.value })}
        placeholder="Check if welcome email was opened"
        multiline
        rows={2}
        fullWidth
      />
    </Stack>
  );
}

// ✅ UPDATED: Uses correct field names
function DelayNodeEditor({
  data,
  onUpdate,
}: {
  data: DelayData;
  onUpdate: (data: DelayData) => void;
}) {
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2}>
        <TextField
          type="number"
          label="Duration"
          value={data.duration}
          inputProps={{ min: 1 }}
          onChange={(e) =>
            onUpdate({ ...data, duration: Number(e.target.value) || 1 })
          }
          fullWidth
        />

        <TextField
          select
          label="Unit"
          value={data.unit}
          onChange={(e) =>
            onUpdate({ ...data, unit: e.target.value as DelayUnit })
          }
          SelectProps={{ native: true }}
          sx={{ minWidth: 120 }}
        >
          <option value="minutes">Minutes</option>
          <option value="hours">Hours</option>
          <option value="days">Days</option>
        </TextField>
      </Stack>

      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          bgcolor: "info.50",
          borderColor: "info.main",
        }}
      >
        <Typography variant="body2">
          Journey pauses for{" "}
          <strong>
            {data.duration} {data.unit}
          </strong>{" "}
          before continuing.
        </Typography>
      </Paper>
    </Stack>
  );
}

// ✅ UPDATED: Uses waitForTag field with dynamic tag selection
function TriggerNodeEditor({
  data,
  onUpdate,
  tags,
  tagsLoading = false,
}: {
  data: TriggerData;
  onUpdate: (data: TriggerData) => void;
  tags: ITag[];
  tagsLoading?: boolean;
}) {
  // ✅ Defensive: Ensure data has default values
  const safeData: TriggerData = {
    waitForTag: data?.waitForTag ?? "",
    description: data?.description ?? "",
  };

  // ✅ Separate system and custom tags
  const systemTags = tags.filter((t) => t.isSystem);
  const customTags = tags.filter((t) => !t.isSystem);

  return (
    <Stack spacing={3}>
      {tagsLoading ? (
        <Box display="flex" justifyContent="center" py={2}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <>
          {/* Show tag count info */}
          {tags.length > 0 && (
            <Stack direction="row" spacing={1}>
              <Chip
                label={`${systemTags.length} System`}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Chip
                label={`${customTags.length} Custom`}
                size="small"
                color="secondary"
                variant="outlined"
              />
            </Stack>
          )}

          {/* ✅ Dynamic tag autocomplete */}
          <Autocomplete
            options={tags}
            getOptionLabel={(tag) => tag.name}
            groupBy={(tag) =>
              tag.isSystem ? "📋 System Pipeline Stages" : "🏷️ Your Custom Tags"
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tag Name"
                helperText="Journey will pause until this tag is assigned to the lead"
                required
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
                    width="100%"
                  >
                    <Typography flex={1}>{tag.name}</Typography>
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
            value={tags.find((t) => t.name === safeData.waitForTag) || null}
            onChange={(_, tag) =>
              onUpdate({ ...safeData, waitForTag: tag?.name || "" })
            }
            isOptionEqualToValue={(option, value) => option.name === value.name}
            noOptionsText="No tags available. Please create tags in Tag Management."
          />

          {/* Empty state */}
          {tags.length === 0 && (
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: "warning.50",
                borderColor: "warning.main",
              }}
            >
              <Typography variant="body2">
                ⚠️ No tags available. Please create tags in the Tag Management
                section first.
              </Typography>
            </Paper>
          )}
        </>
      )}

      <TextField
        label="Description (optional)"
        value={safeData.description || ""}
        onChange={(e) => onUpdate({ ...safeData, description: e.target.value })}
        placeholder="Wait for meeting confirmation"
        multiline
        rows={2}
        fullWidth
      />

      {safeData.waitForTag && (
        <Paper
          variant="outlined"
          sx={{
            p: 2.5,
            bgcolor: "warning.50",
            borderColor: "warning.main",
          }}
        >
          <Typography variant="body2">
            ⏸️ Journey will <strong>pause here</strong> until the tag &quot;
            {safeData.waitForTag}&quot; is assigned to the lead.
          </Typography>
        </Paper>
      )}
    </Stack>
  );
}

// ✅ UPDATED: Uses emailContent field
function SendEmailNodeEditor({
  data,
  onUpdate,
}: {
  data: SendEmailData;
  onUpdate: (data: SendEmailData) => void;
}) {
  return (
    <Stack spacing={3}>
      <TextField
        label="From Name (optional)"
        value={data.fromName || ""}
        onChange={(e) => onUpdate({ ...data, fromName: e.target.value })}
        placeholder="John Doe"
        fullWidth
      />

      <TextField
        label="Subject Line"
        value={data.subject}
        onChange={(e) => onUpdate({ ...data, subject: e.target.value })}
        placeholder="Your dream home awaits..."
        fullWidth
        required
      />

      <EmailContentEditor
        value={data.emailContent}
        blocks={data.emailBlocks}
        onChange={(value: string) =>
          onUpdate({ ...data, emailContent: value })
        }
        onBlocksChange={(emailBlocks) => onUpdate({ ...data, emailBlocks })}
      />

      <Paper variant="outlined" sx={{ p: 2, bgcolor: "success.50" }}>
        <Typography variant="caption" color="text.secondary">
          💡 You can use placeholders like {"{{firstName}}"}, {"{{lastName}}"},{" "}
          {"{{email}}"} that will be replaced with lead data. The preview fills
          them in with sample details so you can see how it reads.
        </Typography>
      </Paper>
    </Stack>
  );
}

// ✅ UPDATED: Uses message field
function MeetingReminderNodeEditor({
  data,
  onUpdate,
}: {
  data: MeetingReminderData;
  onUpdate: (data: MeetingReminderData) => void;
}) {
  return (
    <Stack spacing={3}>
      <TextField
        label="Meeting Title"
        value={data.title}
        onChange={(e) => onUpdate({ ...data, title: e.target.value })}
        placeholder="Schedule property viewing"
        fullWidth
      />

      <TextField
        label="Reminder Message"
        value={data.message}
        onChange={(e) => onUpdate({ ...data, message: e.target.value })}
        placeholder="Reach out to schedule a property viewing with this lead"
        multiline
        minRows={4}
        fullWidth
      />

      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          bgcolor: "secondary.50",
          borderColor: "secondary.main",
        }}
      >
        <Typography variant="body2">
          📅 You&lsquo;ll receive a reminder to schedule a meeting with this lead.
        </Typography>
      </Paper>
    </Stack>
  );
}

// ✅ UPDATED: Correct field
function SmsReminderNodeEditor({
  data,
  onUpdate,
}: {
  data: SmsReminderData;
  onUpdate: (data: SmsReminderData) => void;
}) {
  return (
    <Stack spacing={3}>
      <TextField
        label="Reminder Message"
        value={data.message}
        onChange={(e) => onUpdate({ ...data, message: e.target.value })}
        placeholder="Send SMS to follow up on property interest"
        multiline
        minRows={4}
        fullWidth
      />

      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          bgcolor: "secondary.50",
          borderColor: "secondary.main",
        }}
      >
        <Typography variant="body2">
          💬 You&lsquo;ll receive a reminder to send an SMS to this lead.
        </Typography>
      </Paper>
    </Stack>
  );
}

// ✅ UPDATED: Uses message field
function CallReminderNodeEditor({
  data,
  onUpdate,
}: {
  data: CallReminderData;
  onUpdate: (data: CallReminderData) => void;
}) {
  return (
    <Stack spacing={3}>
      <TextField
        label="Call Notes"
        value={data.message}
        onChange={(e) => onUpdate({ ...data, message: e.target.value })}
        placeholder="Follow up on property inquiry, discuss financing options"
        multiline
        minRows={5}
        fullWidth
      />

      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          bgcolor: "secondary.50",
          borderColor: "secondary.main",
        }}
      >
        <Typography variant="body2">
          📞 You&lsquo;ll receive a reminder to call this lead.
        </Typography>
      </Paper>
    </Stack>
  );
}
