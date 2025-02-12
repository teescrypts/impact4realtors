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

const TOP_NAV_HEIGHT = 64;
const SIDE_NAV_WIDTH = 280;

function Topnav({
  onMobileNavOpen,
  ...other
}: {
  onMobileNavOpen: () => void;
}) {
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));

  return (
    <Box
      component="header"
      sx={{
        backdropFilter: "blur(6px)",
        backgroundColor: (theme: Theme) =>
          alpha(theme.palette.background.default, 0.9),
        position: "sticky",
        left: {
          lg: `${SIDE_NAV_WIDTH}px`,
        },
        top: 0,
        width: {
          lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`,
        },
        zIndex: (theme) => theme.zIndex.appBar,
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
          px: 2,
        }}
      >
        <Stack alignItems="center" direction="row" spacing={2}>
          {!lgUp && (
            <IconButton onClick={onMobileNavOpen}>
              <SvgIcon>
                <Menu />
              </SvgIcon>
            </IconButton>
          )}
        </Stack>
        <Stack alignItems="center" direction="row" spacing={2}>
          <Button variant="contained" color="primary" size="small">
            Try Customer
          </Button>
          <NotificationsButton />
          <AccountButton />
        </Stack>
      </Stack>
    </Box>
  );
}

export default Topnav;
