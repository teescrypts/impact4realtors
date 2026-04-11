import { Stack, TextField, Paper, Typography } from "@mui/material";
import { ConditionData } from "../type";

function ConditionNodeEditor({
  data,
  onUpdate,
}: {
  data: ConditionData;
  onUpdate: (data: ConditionData) => void;
}) {
  // ✅ Defensive: Ensure data has default values
  const safeData: ConditionData = {
    checkType: data?.checkType ?? "email_opened",
    description: data?.description ?? "",
  };

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 2.5, bgcolor: "background.default", borderRadius: 2 }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          How it works:
        </Typography>

        <Stack spacing={2} mt={2}>
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <Typography
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
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Previous email was opened → follow &quot;Yes&quot; path
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <Typography
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
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email was NOT opened → follow &quot;No&quot; path
            </Typography>
          </Stack>
        </Stack>
      </Paper>

      <TextField
        label="Description (optional)"
        value={safeData.description || ""}
        onChange={(e) =>
          onUpdate({ ...safeData, description: e.target.value })
        }
        placeholder="Check if welcome email was opened"
        multiline
        rows={2}
        fullWidth
      />
    </Stack>
  );
}

export default ConditionNodeEditor;
