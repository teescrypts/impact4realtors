import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
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
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { format } from "date-fns";
import Mail04 from "@/app/icons/untitled-ui/duocolor/mail-04";
import { Scrollbar } from "@/app/component/scrollbar";
import Close from "@/app/icons/untitled-ui/duocolor/close";
import {
  deleteNotification,
  fetchNotifications,
  markNotificationAsRead,
} from "@/app/actions/server-actions";
import { NotificationResType } from "@/types";
import Time from "@/app/icons/untitled-ui/duocolor/time";
import notify from "@/app/utils/toast";

interface PropsType {
  anchorEl: HTMLDivElement | null;
  onClose: () => void;
  open: boolean;
  setUreadNotifictaionsCount: Dispatch<SetStateAction<number>>;
}

const renderContent = (notification: NotificationResType) => {
  const createdAt = format(notification.createdAt, "MMM dd, h:mm a");
  const isUnread = !notification.isRead; // Determine if it's unread

  return (
    <>
      <ListItemAvatar sx={{ mt: 0.5 }}>
        <Avatar
          sx={{
            bgcolor: isUnread ? "primary.main" : "grey.400", // Change avatar color based on read status
          }}
        >
          <SvgIcon>
            {notification.type === "new_appointment" ? <Time /> : <Mail04 />}
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
            {/* Read/Unread Indicator */}
            <Box
              sx={{
                width: 8,
                height: 8,
                bgcolor: isUnread ? "error.main" : "grey.500",
                borderRadius: "50%",
                display: "inline-block",
                mr: 1,
              }}
            />
            {/* Notification Type */}
            <Typography variant="subtitle2" sx={{ mr: 0.5 }}>
              {notification.type === "new_appointment"
                ? "New Appointment!"
                : "New Subscription!"}
            </Typography>
            {/* Message */}
            <Typography variant="body2">{notification.message}</Typography>
          </Box>
        }
        secondary={
          <Typography color="text.secondary" variant="caption">
            {createdAt}
          </Typography>
        }
        sx={{
          my: 0,
          opacity: isUnread ? 1 : 0.6, // Reduce opacity for read notifications
        }}
      />
    </>
  );
};

function NotificationPopover({
  anchorEl,
  onClose,
  open = false,
  setUreadNotifictaionsCount,
  ...other
}: PropsType) {
  const [notifications, setNotifications] = useState<NotificationResType[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [lastCreatedAt, setLastCreatedAt] = useState<Date | undefined>(
    undefined
  );
  const [message, setMessaage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true); // Reset loading state
      setLastCreatedAt(undefined); // Reset pagination
      setNotifications([]); // Clear previous notifications

      fetchNotifications(undefined).then((result) => {
        if (result?.error) {
          setMessaage(result.error);
          setLoading(false);
        }
        if (result?.data) {
          setNotifications(result.data.notifications);
          setHasMore(result.data.hasMore);
          if (result.data.lastCreatedAt) {
            setLastCreatedAt(result.data.lastCreatedAt);
          }
          setLoading(false);
        }
      });
    }
  }, [open]);

  const handleLoadMore = useCallback(async () => {
    setIsLoadingMore(true);
    const result = await fetchNotifications(lastCreatedAt);

    if (result?.error) {
      setMessaage(result.error);
      setIsLoadingMore(false);
    }
    if (result?.data) {
      setNotifications((prev) => [...prev, ...result.data.notifications]);
      setHasMore(result.data.hasMore);
      if (result.data.lastCreatedAt) {
        setLastCreatedAt(result.data.lastCreatedAt);
      }
      setIsLoadingMore(false);
    }
  }, [lastCreatedAt]);

  const handleMarkRead = useCallback(() => {
    const unreadNotificationsId = notifications
      .filter((notification) => !notification.isRead)
      .map((notification) => notification._id);

    if (unreadNotificationsId.length > 0) {
      unreadNotificationsId.forEach((id) => {
        markNotificationAsRead(id!).then((result) => {
          if (result?.error) setMessaage(result.error);
        });
      });

      const updatedNotification = notifications.map((notification) => {
        if (!notification.isRead) {
          return { ...notification, isRead: true };
        } else {
          return notification;
        }
      });

      setNotifications(updatedNotification);
      setUreadNotifictaionsCount(0);
    } else {
      alert("All notifications have been marked as read");
    }
  }, [notifications, setUreadNotifictaionsCount]);

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
          <IconButton onClick={handleMarkRead} size="small" color="inherit">
            <SvgIcon>
              <Mail04 />
            </SvgIcon>
          </IconButton>
        </Tooltip>
      </Stack>

      {loading && (
        <Stack justifyContent={"center"} alignItems={"center"} sx={{ my: 4 }}>
          <CircularProgress />
        </Stack>
      )}

      {isEmpty && !loading ? (
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
                key={notification._id}
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
                      onClick={() => {
                        deleteNotification(notification._id).then((result) => {
                          if (result?.error) setMessaage(result.error);
                          if (result?.message) notify(result.message);

                          const updatedNotification = notifications.filter(
                            (prevNotification) =>
                              prevNotification._id !== notification._id
                          );

                          setNotifications(updatedNotification);
                        });
                      }}
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

      {message && (
        <Typography color="error" textAlign={"center"} variant="subtitle2">
          {message}
        </Typography>
      )}

      {hasMore && (
        <Button
          disabled={isLoadingMore}
          color="inherit"
          sx={{
            position: "relative",
            minWidth: "120px", // Ensures consistent width
            height: "40px",
            my: 4,
          }}
          onClick={handleLoadMore}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              position: "absolute",
              opacity: isLoadingMore ? 0 : 1,
              transition: "opacity 0.2s ease-in-out",
            }}
          >
            Load More
          </Box>
          {isLoadingMore && <CircularProgress size={24} />}
        </Button>
      )}
    </Popover>
  );
}

export default NotificationPopover;
