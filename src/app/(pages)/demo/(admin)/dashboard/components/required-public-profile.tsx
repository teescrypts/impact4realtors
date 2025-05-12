"use client";

import User01 from "@/app/icons/untitled-ui/duocolor/user01";
import { Button, Paper, Stack, Typography } from "@mui/material";
import { useRouter } from "nextjs-toploader/app";

type RequirePublicProfileNoticeProps = {
  message?: string;
};

export default function RequirePublicProfileNotice({
  message = "You need a public profile to perform this action.",
}: RequirePublicProfileNoticeProps) {
  const router = useRouter();
  return (
    <Paper
      elevation={3}
      sx={{ p: 4, textAlign: "center", maxWidth: 500, mx: "auto" }}
    >
      <Stack spacing={2} alignItems="center">
        <User01 fontSize="large" color="action" />
        <Typography variant="h6" fontWeight={500}>
          Public Profile Required
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/demo/dashboard/profile")}
          sx={{ mt: 2 }}
        >
          Create Public Profile
        </Button>
      </Stack>
    </Paper>
  );
}
