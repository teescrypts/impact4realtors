import { StepType } from "./type";
import StackedEmail from "@/app/icons/untitled-ui/duocolor/stacked-email";
import Call from "@/app/icons/untitled-ui/duocolor/call";
import MessageChatSquare from "@/app/icons/untitled-ui/duocolor/message-chat-square";

import { SvgIcon, SxProps, Theme } from "@mui/material";
import { Box } from "@mui/material";
import Calendar from "@/app/icons/untitled-ui/duocolor/calendar";

interface StepIconProps {
  type: StepType;
  size?: "sm" | "md" | "lg";
  sx?: SxProps<Theme>;
}

const iconConfig = {
  email: { icon: StackedEmail, bgColor: "#E0F2FE", color: "#0284C7" }, // Tailwind bg-step-email-bg / text-step-email
  call: { icon: Call, bgColor: "#FEE2E2", color: "#DC2626" }, // bg-step-call-bg / text-step-call
  meeting: { icon: Calendar, bgColor: "#EDE9FE", color: "#7C3AED" }, // bg-step-meeting-bg / text-step-meeting
  sms: { icon: MessageChatSquare, bgColor: "#ECFDF5", color: "#059669" }, // bg-step-sms-bg / text-step-sms
};

const sizeConfig = {
  sm: 32, // px
  md: 40,
  lg: 48,
};

export function StepIcon({ type, size = "md", sx }: StepIconProps) {
  const { icon: Icon, bgColor, color } = iconConfig[type];
  const dimension = sizeConfig[size];

  return (
    <Box
      sx={{
        width: dimension,
        height: dimension,
        bgcolor: bgColor,
        color: color,
        borderRadius: 2, // roughly matches rounded-lg
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        ...sx,
      }}
    >
      <SvgIcon
        style={{
          width: Number(dimension * 0.5),
          height: Number(dimension * 0.5),
        }}
      >
        <Icon />
      </SvgIcon>
    </Box>
  );
}
