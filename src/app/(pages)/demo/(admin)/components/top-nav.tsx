import Menu from "@/app/icons/untitled-ui/duocolor/menu";
import {
  alpha,
  Box,
  Button,
  IconButton,
  Stack,
  SvgIcon,
  Theme,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import NotificationsButton from "./notifications/notifications-button";
import AccountButton from "./account-button/account-button";
import Link from "next/link";
import { useUserData } from "@/app/guards/auth-guard";
import { motion } from "framer-motion";

const TOP_NAV_HEIGHT = 64;
const SIDE_NAV_WIDTH = 280;
const SIDE_NAV_COLLAPSED_WIDTH = 73;

function Topnav({
  onMobileNavOpen,
  isCollapsed = false,
  ...other
}: {
  onMobileNavOpen: () => void;
  isCollapsed?: boolean;
}) {
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));
  const admin = useUserData();
  const currentWidth = isCollapsed ? SIDE_NAV_COLLAPSED_WIDTH : SIDE_NAV_WIDTH;

  return (
    <Box
      component="header"
      sx={{
        backdropFilter: "blur(12px)",
        backgroundColor: (theme: Theme) =>
          alpha(theme.palette.background.default, 0.8),
        borderBottom: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        position: "sticky",
        left: {
          lg: `${currentWidth}px`,
        },
        top: 0,
        width: {
          lg: `calc(100% - ${currentWidth}px)`,
        },
        zIndex: (theme) => theme.zIndex.appBar,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      {...other}
    >
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{
          minHeight: TOP_NAV_HEIGHT,
          px: 3,
        }}
      >
        <Stack alignItems="center" direction="row" spacing={2}>
          {!lgUp && (
            <motion.div whileTap={{ scale: 0.9 }}>
              <IconButton 
                onClick={onMobileNavOpen}
                sx={{
                  "&:hover": {
                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <SvgIcon>
                  <Menu />
                </SvgIcon>
              </IconButton>
            </motion.div>
          )}
        </Stack>
        
        <Stack alignItems="center" direction="row" spacing={2}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href={
                admin.isBroker
                  ? `/demo/broker/?admin=${admin.id}`
                  : `/demo?admin=${admin.id}`
              }
            >
              <Button 
                variant="contained" 
                color="primary" 
                size="small"
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  px: 2.5,
                  borderRadius: 2,
                  boxShadow: (theme) => `0 2px 8px ${alpha(theme.palette.primary.main, 0.24)}`,
                  "&:hover": {
                    boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.32)}`,
                  },
                }}
              >
                Try Customer
              </Button>
            </Link>
          </motion.div>
          
          <NotificationsButton />
          <AccountButton />
        </Stack>
      </Stack>
    </Box>
  );
}

export default Topnav;
