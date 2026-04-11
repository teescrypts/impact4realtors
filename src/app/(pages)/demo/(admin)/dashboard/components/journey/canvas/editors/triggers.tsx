import { Stack, TextField, Paper, Typography } from "@mui/material";
import { TriggerData } from "../type";

function TriggerNodeEditor({
  data,
  onUpdate,
}: {
  data: TriggerData;
  onUpdate: (data: TriggerData) => void;
}) {
  // ✅ Defensive: Ensure data has default values
  const safeData: TriggerData = {
    waitForTag: data?.waitForTag ?? "",
    description: data?.description ?? "",
  };

  return (
    <Stack spacing={3}>
      <TextField
        label="Tag Name"
        value={safeData.waitForTag}
        onChange={(e) => onUpdate({ ...safeData, waitForTag: e.target.value })}
        placeholder="e.g., Meeting Booked"
        helperText="Journey will pause until this tag is assigned to the lead"
        fullWidth
        required
      />

      <TextField
        label="Description (optional)"
        value={safeData.description || ""}
        onChange={(e) =>
          onUpdate({ ...safeData, description: e.target.value })
        }
        placeholder="Wait for meeting confirmation"
        multiline
        rows={2}
        fullWidth
      />

      <Paper
        sx={{
          p: 2.5,
          bgcolor: "warning.50",
          borderColor: "warning.main",
          border: 1,
          borderRadius: 2,
        }}
      >
        <Typography variant="body2">
          ⏸️ Journey will <strong>pause here</strong> until the tag &quot;
          {safeData.waitForTag || "..."}&quot; is assigned to the lead.
        </Typography>
      </Paper>
    </Stack>
  );
}

export default TriggerNodeEditor;
