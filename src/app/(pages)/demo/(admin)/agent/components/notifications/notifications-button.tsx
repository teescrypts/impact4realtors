import React from "react";
import { Badge, IconButton, SvgIcon, Tooltip } from "@mui/material";
import NotificationsPopover from "./notifications-popover";
import { usePopover } from "@/app/hooks/use-popover";
import Bell from "@/app/icons/untitled-ui/duocolor/bell";
import { useUserData } from "@/app/guards/agent-guard";

function NotificationsButton() {
  const popover = usePopover();
  const { unreadNotifictaionsCount, setUreadNotifictaionsCount } =
    useUserData();

  return (
    <>
      <Tooltip title="notifications">
        <IconButton ref={popover.anchorRef} onClick={popover.handleOpen}>
          <Badge color="error" badgeContent={unreadNotifictaionsCount}>
            <SvgIcon>
              <Bell />
            </SvgIcon>
          </Badge>
        </IconButton>
      </Tooltip>
      <NotificationsPopover
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        open={popover.open}
        setUreadNotifictaionsCount={setUreadNotifictaionsCount}
      />
    </>
  );
}

export default NotificationsButton;
