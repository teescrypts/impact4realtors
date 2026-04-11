import { Stack, Paper, Typography } from "@mui/material";

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

      <Typography variant="caption" color="text.secondary">
        The entry action cannot be changed. All new leads will start here.
      </Typography>
    </Stack>
  );
}

export default EntryNodeEditor;
