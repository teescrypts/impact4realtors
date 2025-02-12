import React, { useCallback, useMemo, useState } from "react";
import { subDays, subHours } from "date-fns";
import { Badge, IconButton, SvgIcon, Tooltip } from "@mui/material";
import NotificationsPopover from "./notifications-popover";
import { usePopover } from "@/app/hooks/use-popover";
import Bell from "@/app/icons/untitled-ui/duocolor/bell";

const now = new Date();

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

const initialNotifications: Notification[] = [
  {
    id: "5e8883f1b51cc1956a5a1ec0",
    author: "Jie Yang Song",
    avatar: "/assets/avatars/avatar-jie-yan-song.png",
    createdAt: subHours(now, 2).getTime(),
    job: "Remote React / React Native Developer",
    read: true,
    type: "job_add",
  },
  {
    id: "bfb21a370c017acc416757c7",
    author: "Jie Yang Song",
    avatar: "/assets/avatars/avatar-jie-yan-song.png",
    createdAt: subHours(now, 2).getTime(),
    job: "Senior Golang Backend Engineer",
    read: false,
    type: "job_add",
  },
  {
    id: "20d9df4f23fff19668d7031c",
    createdAt: subDays(now, 1).getTime(),
    description: "Logistics management is now available",
    read: true,
    type: "new_feature",
  },
  {
    id: "5e8883fca0e8612044248ecf",
    author: "Jie Yang Song",
    avatar: "/assets/avatars/avatar-jie-yan-song.png",
    company: "Augmastic Inc",
    createdAt: subHours(now, 2).getTime(),
    read: false,
    type: "company_created",
  },
];

const useNotifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unread = useMemo(() => {
    return notifications.reduce(
      (acc, notification) => acc + (notification.read ? 0 : 1),
      0
    );
  }, [notifications]);

  const handleRemoveOne = useCallback((notificationId: string) => {
    setNotifications((prevState) => {
      return prevState.filter(
        (notification) => notification.id !== notificationId
      );
    });
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications((prevState) => {
      return prevState.map((notification) => ({
        ...notification,
        read: true,
      }));
    });
  }, []);

  return {
    handleMarkAllAsRead,
    handleRemoveOne,
    notifications,
    unread,
  };
};

function NotificationsButton() {
  const popover = usePopover();
  const { handleRemoveOne, handleMarkAllAsRead, notifications, unread } =
    useNotifications();

  return (
    <>
      <Tooltip title="notifications">
        <IconButton ref={popover.anchorRef} onClick={popover.handleOpen}>
          <Badge color="error" badgeContent={unread}>
            <SvgIcon>
              <Bell />
            </SvgIcon>
          </Badge>
        </IconButton>
      </Tooltip>
      <NotificationsPopover
        anchorEl={popover.anchorRef.current}
        notifications={notifications}
        onClose={popover.handleClose}
        onMarkAllAsRead={handleMarkAllAsRead}
        onRemoveOne={handleRemoveOne}
        open={popover.open}
      />
    </>
  );
}

export default NotificationsButton;
