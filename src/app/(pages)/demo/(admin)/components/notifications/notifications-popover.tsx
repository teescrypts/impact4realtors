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
  alpha,
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
import { motion, AnimatePresence } from "framer-motion";

interface PropsType {
  anchorEl: HTMLDivElement | null;
  onClose: () => void;
  open: boolean;
  setUreadNotifictaionsCount: Dispatch<SetStateAction<number>>;
}

const renderContent = (notification: NotificationResType) => {
  const createdAt = format(notification.createdAt, "MMM dd, h:mm a");
  const isUnread = !notification.isRead;

  return (
    <>
      <ListItemAvatar sx={{ mt: 0.5 }}>
        <Avatar
          sx={{
            bgcolor: isUnread ? "primary.main" : alpha("primary.main", 0.3),
            transition: "all 0.2s",
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
              gap: 0.5,
            }}
          >
            {/* Read/Unread Indicator */}
            <Box
              sx={{
                width: 6,
                height: 6,
                bgcolor: isUnread ? "error.main" : "transparent",
                borderRadius: "50%",
                display: "inline-block",
                transition: "all 0.2s",
              }}
            />
            {/* Notification Type */}
            <Typography 
              variant="subtitle2" 
              component="span"
              sx={{ fontWeight: 600 }}
            >
              {notification.type === "new_appointment"
                ? "New Appointment"
                : "New Subscription"}
            </Typography>
          </Box>
        }
        secondary={
          <Stack spacing={0.5} sx={{ mt: 0.5 }}>
            <Typography variant="body2" color="text.primary">
              {notification.message}
            </Typography>
            <Typography color="text.secondary" variant="caption">
              {createdAt}
            </Typography>
          </Stack>
        }
        // ListItemText wraps primary in a <span> and secondary in a <p> by
        // default. Both hold block elements here, which is invalid HTML and
        // breaks hydration - render them as divs instead.
        slotProps={{
          primary: { component: "div" },
          secondary: { component: "div" },
        }}
        sx={{
          my: 0,
          opacity: isUnread ? 1 : 0.7,
          transition: "opacity 0.2s",
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
      setLoading(true);
      setLastCreatedAt(undefined);
      setNotifications([]);

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
      notify("All notifications are already read");
    }
  }, [notifications, setUreadNotifictaionsCount]);

  const isEmpty = notifications.length === 0;

  return (
    <AnimatePresence>
      {open && (
        <Popover
          anchorEl={anchorEl}
          anchorOrigin={{
            horizontal: "right",
            vertical: "bottom",
          }}
          transformOrigin={{
            horizontal: "right",
            vertical: "top",
          }}
          disableScrollLock
          onClose={onClose}
          open={open}
          slotProps={{
            paper: {
              sx: { 
                width: 400,
                mt: 1.5,
                borderRadius: 2,
                boxShadow: (theme) => `0 8px 24px ${alpha(theme.palette.common.black, 0.12)}`,
              },
            },
          }}
          {...other}
        >
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <Stack
              alignItems="center"
              direction="row"
              justifyContent="space-between"
              spacing={2}
              sx={{
                px: 3,
                py: 2,
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="h6" fontWeight={700}>
                Notifications
              </Typography>
              <Tooltip title="Mark all as read" arrow>
                <IconButton 
                  onClick={handleMarkRead} 
                  size="small"
                  sx={{
                    "&:hover": {
                      backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  <SvgIcon fontSize="small">
                    <Mail04 />
                  </SvgIcon>
                </IconButton>
              </Tooltip>
            </Stack>

            {loading && (
              <Stack justifyContent="center" alignItems="center" sx={{ py: 6 }}>
                <CircularProgress size={32} />
              </Stack>
            )}

            {isEmpty && !loading ? (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  No notifications yet
                </Typography>
              </Box>
            ) : (
              <Scrollbar sx={{ maxHeight: 420 }}>
                <List disablePadding>
                  {notifications.map((notification, index) => (
                    <motion.div
                      key={notification._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ListItem
                        divider
                        sx={{
                          alignItems: "flex-start",
                          transition: "all 0.2s",
                          "&:hover": {
                            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
                          },
                          "& .MuiListItemSecondaryAction-root": {
                            top: "24%",
                          },
                        }}
                        secondaryAction={
                          <Tooltip title="Remove" arrow>
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
                              sx={{
                                "&:hover": {
                                  color: "error.main",
                                  backgroundColor: (theme) => alpha(theme.palette.error.main, 0.08),
                                },
                              }}
                            >
                              <SvgIcon fontSize="small">
                                <Close />
                              </SvgIcon>
                            </IconButton>
                          </Tooltip>
                        }
                      >
                        {renderContent(notification)}
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              </Scrollbar>
            )}

            {message && (
              <Typography 
                color="error" 
                textAlign="center" 
                variant="body2"
                sx={{ p: 2 }}
              >
                {message}
              </Typography>
            )}

            {hasMore && (
              <Box sx={{ p: 2, borderTop: (theme) => `1px solid ${theme.palette.divider}` }}>
                <Button
                  disabled={isLoadingMore}
                  color="primary"
                  fullWidth
                  variant="text"
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    position: "relative",
                    minHeight: 36,
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
                      transition: "opacity 0.2s",
                    }}
                  >
                    Load More
                  </Box>
                  {isLoadingMore && <CircularProgress size={20} />}
                </Button>
              </Box>
            )}
          </motion.div>
        </Popover>
      )}
    </AnimatePresence>
  );
}

export default NotificationPopover;
