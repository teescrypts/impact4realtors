import { Avatar, Box, ButtonBase, SvgIcon, alpha } from "@mui/material";
import React from "react";
import AccountPopover from "./account-popover";
import { usePopover } from "@/app/hooks/use-popover";
import User01 from "@/app/icons/untitled-ui/duocolor/user01";
import { motion } from "framer-motion";

const useMockedUser = () => {
  return {
    _id: "5e86809283e28b96d2d38537",
    avatar: "/assets/avatars/avatar-anika-visser.png",
    name: "Anika Visser",
    email: "anika.visser@devias.io",
  };
};

function AccountButton() {
  const popover = usePopover();

  return (
    <>
      <motion.div whileTap={{ scale: 0.95 }}>
        <Box
          component={ButtonBase}
          onClick={popover.handleOpen}
          ref={popover.anchorRef}
          sx={{
            alignItems: "center",
            display: "flex",
            borderWidth: 2,
            borderStyle: "solid",
            borderColor: "divider",
            height: 40,
            width: 40,
            borderRadius: "50%",
            transition: "all 0.2s",
            "&:hover": {
              borderColor: "primary.main",
              boxShadow: (theme) => `0 0 0 4px ${alpha(theme.palette.primary.main, 0.08)}`,
            },
          }}
        >
          <Avatar
            sx={{
              height: 32,
              width: 32,
            }}
            src={""}
          >
            <SvgIcon>
              <User01 />
            </SvgIcon>
          </Avatar>
        </Box>
      </motion.div>
      <AccountPopover
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        open={popover.open}
        user={useMockedUser()}
      />
    </>
  );
}

export default AccountButton;
