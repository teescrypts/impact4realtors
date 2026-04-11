import { motion } from "framer-motion";
import { Box, Paper, Stack, SvgIcon, Typography } from "@mui/material";
import ChevronRight from "@/app/icons/untitled-ui/duocolor/chevron-right";
import Timer from "@/app/icons/untitled-ui/duocolor/timer";
import Zap from "@/app/icons/untitled-ui/duocolor/zap";
import {
  JourneyNode,
  isEntryData,
  EntryData,
  entryActionLabels,
  isConditionData,
  ConditionData,
  conditionCheckLabels,  // ✅ UPDATED: Changed from conditionLabels
  isDelayData,
  DelayData,
  isTriggerData,
  TriggerData,
  isSendEmailData,
  SendEmailData,
  isMeetingReminderData,
  MeetingReminderData,
  isSmsReminderData,
  SmsReminderData,
} from "./type";
import Branch from "@/app/icons/untitled-ui/duocolor/branch";
import Visibility from "@/app/icons/untitled-ui/duocolor/visibility";
import MessageChatSquare from "@/app/icons/untitled-ui/duocolor/message-chat-square";
import Call from "@/app/icons/untitled-ui/duocolor/call";
import Calendar from "@/app/icons/untitled-ui/duocolor/calendar";
import Mail03 from "@/app/icons/untitled-ui/duocolor/mail-03";

interface JourneyNodeCardProps {
  node: JourneyNode;
  isSelected: boolean;
  onClick: () => void;
}

export function JourneyNodeCard({
  node,
  isSelected,
  onClick,
}: JourneyNodeCardProps) {
  const getIconColor = () => {
    switch (node.type) {
      case "entry":
        return "#22c55e"; // green
      case "condition":
        return "#3b82f6"; // blue
      case "delay":
        return "#facc15"; // yellow
      case "trigger":
        return "#a855f7"; // purple
      default:
        return "#f97316"; // action orange
    }
  };

  const getNodeIcon = () => {
    switch (node.type) {
      case "entry":
        return <Zap />;
      case "condition":
        return <Branch />;
      case "delay":
        return <Timer />;
      case "trigger":
        return <Visibility />;
      case "send_email":
        return <Mail03 />;
      case "meeting_reminder":
        return <Calendar />;
      case "sms_reminder":
        return <MessageChatSquare />;
      case "call_reminder":
        return <Call />;
      default:
        return null;
    }
  };

  const getNodeContent = () => {
    if (isEntryData(node.data)) {
      const data = node.data as EntryData;
      return {
        title: "Entry Point",
        subtitle: entryActionLabels[data.actionType],
      };
    }

    if (isConditionData(node.data)) {
      const data = node.data as ConditionData;
      return {
        title: "Email Opened?",  // ✅ UPDATED: Simplified title
        subtitle: conditionCheckLabels[data.checkType] || "Check email engagement",  // ✅ UPDATED: Use checkType
      };
    }

    if (isDelayData(node.data)) {
      const data = node.data as DelayData;
      return {
        title: "Time Delay",
        subtitle: `Wait ${data.duration} ${data.unit}`,
      };
    }

    if (isTriggerData(node.data)) {
      const data = node.data as TriggerData;
      return {
        title: "Wait for Tag",
        subtitle: `Wait for "${data.waitForTag || 'tag'}"`,  // ✅ UPDATED: Use waitForTag, show actual tag name
      };
    }

    if (isSendEmailData(node.data)) {
      const data = node.data as SendEmailData;
      return {
        title: "Send Email",
        subtitle: data.subject || "No subject set",
      };
    }

    if (isMeetingReminderData(node.data)) {
      const data = node.data as MeetingReminderData;
      return {
        title: "Meeting Reminder",
        subtitle: data.title || "Schedule a meeting",
      };
    }

    if (isSmsReminderData(node.data)) {
      const data = node.data as SmsReminderData;
      return {
        title: "SMS Reminder",
        subtitle: data.message
          ? `${data.message.slice(0, 30)}…`
          : "No message set",
      };
    }

    // Call reminder (default)
    return {
      title: "Call Reminder",
      subtitle: "Reminder to call lead",
    };
  };

  const content = getNodeContent();

  return (
    <Box
      component={motion.div}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      sx={{ cursor: "pointer" }}
    >
      <Paper
        elevation={isSelected ? 8 : 2}
        sx={{
          minWidth: 240,
          border: 2,
          borderColor: isSelected ? "primary.main" : "transparent",
          borderRadius: 3,
          overflow: "hidden",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: isSelected ? "primary.main" : "divider",
            boxShadow: 8,
          },
        }}
      >
        {/* Header bar */}
        <Box
          sx={{
            height: 4,
            bgcolor: getIconColor(),
          }}
        />

        {/* Content */}
        <Stack direction="row" spacing={2} p={2} alignItems="center">
          {/* Icon */}
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: "background.default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: getIconColor(),
              flexShrink: 0,
            }}
          >
            <SvgIcon sx={{ fontSize: 24 }}>{getNodeIcon()}</SvgIcon>
          </Box>

          {/* Text */}
          <Box flex={1} minWidth={0}>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              color="text.primary"
              noWrap
            >
              {content.title}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {content.subtitle}
            </Typography>
          </Box>

          {/* Arrow icon */}
          {isSelected && (
            <SvgIcon sx={{ color: "primary.main", fontSize: 20 }}>
              <ChevronRight />
            </SvgIcon>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}