import { Stack, TextField, Card, Typography } from "@mui/material";
import { DelayData, DelayUnit } from "../type";

function DelayNodeEditor({
  data,
  onUpdate,
}: {
  data: DelayData;
  onUpdate: (data: DelayData) => void;
}) {
  // ✅ Defensive: Ensure data has default values
  const safeData: DelayData = {
    duration: data?.duration ?? 1,
    unit: data?.unit ?? "days",
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2}>
        <TextField
          label="Duration"
          type="number"
          value={safeData.duration}
          onChange={(e) =>
            onUpdate({ ...safeData, duration: Number(e.target.value) || 1 })
          }
          inputProps={{ min: 1 }}
          fullWidth
        />
        <TextField
          select
          label="Unit"
          value={safeData.unit}
          onChange={(e) =>
            onUpdate({ ...safeData, unit: e.target.value as DelayUnit })
          }
          SelectProps={{ native: true }}
          sx={{ minWidth: 120 }}
        >
          <option value="minutes">Minutes</option>
          <option value="hours">Hours</option>
          <option value="days">Days</option>
        </TextField>
      </Stack>

      <Card sx={{ p: 2, bgcolor: "info.50" }}>
        <Typography variant="body2">
          Journey pauses for{" "}
          <strong>
            {safeData.duration} {safeData.unit}
          </strong>
          {" "}before continuing.
        </Typography>
      </Card>
    </Stack>
  );
}

export default DelayNodeEditor;
