import React from "react";
import { Badge, IconButton, SvgIcon, Tooltip, alpha } from "@mui/material";
import NotificationsPopover from "./notifications-popover";
import { usePopover } from "@/app/hooks/use-popover";
import Bell from "@/app/icons/untitled-ui/duocolor/bell";
import { useUserData } from "@/app/guards/auth-guard";
import { motion } from "framer-motion";

function NotificationsButton() {
  const popover = usePopover();
  const { unreadNotifictaionsCount, setUreadNotifictaionsCount } =
    useUserData();

  return (
    <>
      <Tooltip title="Notifications" arrow>
        <motion.div whileTap={{ scale: 0.9 }}>
          <IconButton 
            ref={popover.anchorRef} 
            onClick={popover.handleOpen}
            sx={{
              position: "relative",
              "&:hover": {
                backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
              },
            }}
          >
            <Badge 
              color="error" 
              badgeContent={unreadNotifictaionsCount}
              sx={{
                "& .MuiBadge-badge": {
                  boxShadow: (theme) => `0 0 0 2px ${theme.palette.background.paper}`,
                  fontWeight: 600,
                  fontSize: 10,
                },
              }}
            >
              <SvgIcon>
                <Bell />
              </SvgIcon>
            </Badge>
          </IconButton>
        </motion.div>
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
