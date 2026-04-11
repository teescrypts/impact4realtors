import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Button,
  Card,
  Typography,
  Stack,
  useTheme,
  Divider,
} from "@mui/material";
import Timer from "@/app/icons/untitled-ui/duocolor/timer";
import { NodeType } from "./type";
import Branch from "@/app/icons/untitled-ui/duocolor/branch";
import Visibility from "@/app/icons/untitled-ui/duocolor/visibility";
import Add from "@/app/icons/untitled-ui/duocolor/add";
import Close from "@/app/icons/untitled-ui/duocolor/close";
import StackedEmail from "@/app/icons/untitled-ui/duocolor/stacked-email";
import Calendar from "@/app/icons/untitled-ui/duocolor/calendar";
import MessageChatSquare from "@/app/icons/untitled-ui/duocolor/message-chat-square";
import Call from "@/app/icons/untitled-ui/duocolor/call";

interface AddStepButtonProps {
  onAddNode: (nodeType: Exclude<NodeType, "entry">) => void;
  className?: string;
}

interface StepOption {
  type: Exclude<NodeType, "entry">;
  label: string;
  description: string;
  icon: React.ComponentType;
  color: string;
}

const ruleOptions: StepOption[] = [
  {
    type: "condition",
    label: "If / Else Condition",
    description: "Branch based on email opens or replies",
    icon: Branch,
    color: "warning.main",
  },
  {
    type: "delay",
    label: "Time Delay",
    description: "Wait before continuing the journey",
    icon: Timer,
    color: "info.main",
  },
  {
    type: "trigger",
    label: "Wait for Trigger",
    description: "Pause until a specific event occurs",
    icon: Visibility,
    color: "success.main",
  },
];

const actionOptions: StepOption[] = [
  {
    type: "send_email",
    label: "Send Email",
    description: "Send an automated email to the lead",
    icon: StackedEmail,
    color: "action.main",
  },
  {
    type: "meeting_reminder",
    label: "Meeting Reminder",
    description: "Create a reminder to schedule a meeting",
    icon: Calendar,
    color: "action.main",
  },
  {
    type: "sms_reminder",
    label: "SMS Reminder",
    description: "Create a reminder to send an SMS",
    icon: MessageChatSquare,
    color: "action.main",
  },
  {
    type: "call_reminder",
    label: "Call Reminder",
    description: "Create a reminder to call the lead",
    icon: Call,
    color: "action.main",
  },
];

export function AddStepButton({ onAddNode, className }: AddStepButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const theme = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const allOptions = useMemo(() => {
    return [...ruleOptions, ...actionOptions];
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelect = useCallback((type: Exclude<NodeType, "entry">) => {
    onAddNode(type);
    setIsOpen(false);
    setFocusedIndex(0);
  }, [onAddNode]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Escape":
          setIsOpen(false);
          buttonRef.current?.focus();
          break;
        case "ArrowDown":
          event.preventDefault();
          setFocusedIndex((prev) => Math.min(prev + 1, allOptions.length - 1));
          break;
        case "ArrowUp":
          event.preventDefault();
          setFocusedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          event.preventDefault();
          handleSelect(allOptions[focusedIndex].type);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, focusedIndex, allOptions, handleSelect]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setFocusedIndex(0);
    }
  };

  // Render rule option as compact grid card
  const renderRuleCard = (option: StepOption, index: number) => {
    const Icon = option.icon;
    const isFocused = index === focusedIndex;

    return (
      <motion.div key={option.type} whileHover={{ scale: 1.02 }}>
        <Button
          onClick={() => handleSelect(option.type)}
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textTransform: "none",
            borderRadius: 2,
            p: 2,
            gap: 1,
            bgcolor: isFocused ? theme.palette.action.hover : "transparent",
            border: `1px solid ${theme.palette.divider}`,
            "&:hover": {
              bgcolor: theme.palette.action.hover,
              borderColor: theme.palette.primary.main,
            },
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "background.paper",
              color: option.color,
              boxShadow: theme.shadows[1],
            }}
          >
            <Icon />
          </Box>

          {/* Text */}
          <Box textAlign="center">
            <Typography
              variant="body2"
              fontWeight={500}
              color="text.primary"
              sx={{ lineHeight: 1.3 }}
            >
              {option.label}
            </Typography>
          </Box>
        </Button>
      </motion.div>
    );
  };

  // Render action option as list item
  const renderActionButton = (option: StepOption, index: number) => {
    const Icon = option.icon;
    const isFocused = index === focusedIndex;

    return (
      <motion.div key={option.type} whileHover={{ x: 4 }}>
        <Button
          onClick={() => handleSelect(option.type)}
          fullWidth
          sx={{
            alignItems: "flex-start",
            justifyContent: "flex-start",
            textTransform: "none",
            borderRadius: 2,
            px: 1.5,
            py: 1.25,
            gap: 1.5,
            bgcolor: isFocused ? theme.palette.action.hover : "transparent",
            "&:hover": {
              bgcolor: theme.palette.action.hover,
            },
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "background.paper",
              color: option.color,
              boxShadow: theme.shadows[1],
              flexShrink: 0,
            }}
          >
            <Icon />
          </Box>

          {/* Text */}
          <Box textAlign="left">
            <Typography variant="body2" fontWeight={500} color="text.primary">
              {option.label}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {option.description}
            </Typography>
          </Box>
        </Button>
      </motion.div>
    );
  };

  return (
    <Box position="relative" className={className}>
      {/* Trigger button */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          ref={buttonRef}
          variant={isOpen ? "outlined" : "contained"}
          color="primary"
          onClick={handleToggle}
          startIcon={isOpen ? <Close /> : <Add />}
          sx={{
            textTransform: "none",
            fontWeight: 500,
            borderRadius: 999,
            px: 2.5,
            py: 1,
            ...(isOpen && {
              bgcolor: theme.palette.action.hover,
              borderColor: "primary.main",
            }),
          }}
        >
          {isOpen ? "Cancel" : "Add Step"}
        </Button>
      </motion.div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              marginTop: theme.spacing(1.5),
              zIndex: 50,
            }}
          >
            <Card
              elevation={8}
              sx={{
                minWidth: 320,
                maxWidth: 400,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                p: 1,
              }}
            >
              {/* Rules Section */}
              <Typography
                variant="caption"
                sx={{
                  px: 1.5,
                  py: 1,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "text.secondary",
                }}
              >
                Rules
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 1,
                  px: 0.5,
                  pb: 1,
                }}
              >
                {ruleOptions.map((option, index) =>
                  renderRuleCard(option, index),
                )}
              </Box>

              {/* Divider */}
              <Divider sx={{ my: 1.5 }} />

              {/* Actions Section */}
              <Typography
                variant="caption"
                sx={{
                  px: 1.5,
                  py: 1,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "text.secondary",
                }}
              >
                Actions
              </Typography>

              <Stack spacing={0.5}>
                {actionOptions.map((option, index) =>
                  renderActionButton(option, ruleOptions.length + index),
                )}
              </Stack>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
