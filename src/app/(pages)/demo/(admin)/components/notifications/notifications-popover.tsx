
import {
    Avatar,
  Box,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover,
  Stack,
  SvgIcon,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { format } from "date-fns";
import User01 from "@/app/icons/untitled-ui/duocolor/user01";
import MessageChatSquare from "@/app/icons/untitled-ui/duocolor/message-chat-square";
import Mail04 from "@/app/icons/untitled-ui/duocolor/mail-04";
import { Scrollbar } from "@/app/component/scrollbar";
import Close from "@/app/icons/untitled-ui/duocolor/close";

type Notification = {
  id: string;
  author?: string;
  avatar?: string;
  createdAt: number;
  job?: string;
  description?: string;
  company?: string;
  read: boolean;
  type: "job_add" | "new_feature" | "company_created"; // Union type for the different possible values of 'type'
};

interface PropsType {
  anchorEl: HTMLDivElement | null;
  notifications: Notification[];
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onRemoveOne: (prop: string) => void;
  open: boolean;
}

const renderContent = (notification: Notification) => {
  switch (notification.type) {
    case "job_add": {
      const createdAt = format(notification.createdAt, "MMM dd, h:mm a");

      return (
        <>
          <ListItemAvatar sx={{ mt: 0.5 }}>
            <Avatar src={notification.avatar}>
              <SvgIcon>
                <User01 />
              </SvgIcon>
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                <Typography sx={{ mr: 0.5 }} variant="subtitle2">
                  {notification.author}
                </Typography>
                <Typography sx={{ mr: 0.5 }} variant="body2">
                  added a new job
                </Typography>
                <Link href="#" underline="always" variant="body2">
                  {notification.job}
                </Link>
              </Box>
            }
            secondary={
              <Typography color="text.secondary" variant="caption">
                {createdAt}
              </Typography>
            }
            sx={{ my: 0 }}
          />
        </>
      );
    }
    case "new_feature": {
      const createdAt = format(notification.createdAt, "MMM dd, h:mm a");

      return (
        <>
          <ListItemAvatar sx={{ mt: 0.5 }}>
            <Avatar>
              <SvgIcon>
                <MessageChatSquare />
              </SvgIcon>
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                <Typography variant="subtitle2" sx={{ mr: 0.5 }}>
                  New feature!
                </Typography>
                <Typography variant="body2">
                  {notification.description}
                </Typography>
              </Box>
            }
            secondary={
              <Typography color="text.secondary" variant="caption">
                {createdAt}
              </Typography>
            }
            sx={{ my: 0 }}
          />
        </>
      );
    }
    case "company_created": {
      const createdAt = format(notification.createdAt, "MMM dd, h:mm a");

      return (
        <>
          <ListItemAvatar sx={{ mt: 0.5 }}>
            <Avatar src={notification.avatar}>
              <SvgIcon>
                <User01 />
              </SvgIcon>
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                  flexWrap: "wrap",
                  m: 0,
                }}
              >
                <Typography sx={{ mr: 0.5 }} variant="subtitle2">
                  {notification.author}
                </Typography>
                <Typography sx={{ mr: 0.5 }} variant="body2">
                  created
                </Typography>
                <Link href="#" underline="always" variant="body2">
                  {notification.company}
                </Link>
              </Box>
            }
            secondary={
              <Typography color="text.secondary" variant="caption">
                {createdAt}
              </Typography>
            }
            sx={{ my: 0 }}
          />
        </>
      );
    }
    default:
      return null;
  }
};

function NotificationPopover({
  anchorEl,
  notifications,
  onClose,
  onMarkAllAsRead,
  onRemoveOne,
  open = false,
  ...other
}: PropsType) {
  const isEmpty = notifications.length === 0;

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "left",
        vertical: "bottom",
      }}
      disableScrollLock
      onClose={onClose}
      open={open}
      slotProps={{
        paper: {
          sx: { width: 380 },
        },
      }}
      {...other}
    >
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{
          px: 3,
          py: 2,
        }}
      >
        <Typography color="inherit" variant="h6">
          Notifications
        </Typography>
        <Tooltip title="Mark all as read">
          <IconButton onClick={onMarkAllAsRead} size="small" color="inherit">
            <SvgIcon>
              <Mail04 />
            </SvgIcon>
          </IconButton>
        </Tooltip>
      </Stack>

      {isEmpty ? (
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2">
            There are no notifications
          </Typography>
        </Box>
      ) : (
        <Scrollbar sx={{ maxHeight: 400 }}>
          <List disablePadding>
            {notifications.map((notification) => (
              <ListItem
                divider
                key={notification.id}
                sx={{
                  alignItems: "flex-start",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                  "& .MuiListItemSecondaryAction-root": {
                    top: "24%",
                  },
                }}
                secondaryAction={
                  <Tooltip title="Remove">
                    <IconButton
                      edge="end"
                      onClick={() => onRemoveOne?.(notification.id)}
                      size="small"
                    >
                      <SvgIcon>
                        <Close />
                      </SvgIcon>
                    </IconButton>
                  </Tooltip>
                }
              >
                {renderContent(notification)}
              </ListItem>
            ))}
          </List>
        </Scrollbar>
      )}
    </Popover>
  );
}

export default NotificationPopover;
