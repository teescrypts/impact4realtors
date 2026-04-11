import { Box, Typography } from "@mui/material";
import { ContactType } from "../type";
import User01 from "@/app/icons/untitled-ui/duocolor/user01";
import Home from "@/app/icons/untitled-ui/duocolor/home";

interface ContactTypeBadgeProps {
  type: ContactType;
  sx?: object;
}

export function ContactTypeBadge({ type, sx }: ContactTypeBadgeProps) {
  const isBuyer = type.toLowerCase() === "buyer";

  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        px: 2.5,
        py: 0.5,
        borderRadius: "9999px",
        fontSize: "0.75rem",
        fontWeight: 500,
        bgcolor: isBuyer ? "stepEmailBg" : "stepMeetingBg", // define these in your theme.palette
        color: isBuyer ? "stepEmail" : "stepMeeting",
        ...sx,
      }}
    >
      {isBuyer ? <User01 /> : <Home />}
      <Typography component="span" variant="caption">
        {isBuyer ? "Buyer" : "Seller"}
      </Typography>
    </Box>
  );
}
