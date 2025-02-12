import { RouterLink } from "@/app/component/router-link";
import Users03 from "@/app/icons/untitled-ui/duocolor/users-03";
import {
  Box,
  Button,
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  SvgIcon,
  Typography,
} from "@mui/material";
import React from "react";

type propTypes = {
  anchorEl: HTMLDivElement | null;
  onClose: () => void;
  open: boolean;
  user: { _id: string; avatar: string; email: string; name: string };
};

function AccountPopover({
  anchorEl,
  onClose,
  open,
  user,
  ...other
}: propTypes) {
  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "center",
        vertical: "bottom",
      }}
      disableScrollLock
      onClose={onClose}
      open={!!open}
      slotProps={{
        paper: {
          sx: { width: 200 },
        },
      }}
      {...other}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="body1">{user.name}</Typography>
        <Typography color="text.secondary" variant="body2">
          {user.email}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ p: 1 }}>
        <ListItemButton
          component={RouterLink}
          href={
         ""
          }
          onClick={onClose}
          sx={{
            borderRadius: 1,
            px: 1,
            py: 0.5,
          }}
        >
          <ListItemIcon>
            <SvgIcon fontSize="small">
              <Users03 />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText
            primary={<Typography variant="body1">Account</Typography>}
          />
        </ListItemButton>
        {/* <ListItemButton
          component={RouterLink}
          href={
            userType === "admin"
              ? adminPaths.dashboard.account
              : staffPaths.dashboard.account
          }
          onClick={onClose}
          sx={{
            borderRadius: 1,
            px: 1,
            py: 0.5,
          }}
        >
          <ListItemIcon>
            <SvgIcon fontSize="small">
              <Locations />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText
            primary={<Typography variant="body1">Locations</Typography>}
          />
        </ListItemButton>
        <ListItemButton
          component={RouterLink}
          href={adminPaths.dashboard.index}
          onClick={onClose}
          sx={{
            borderRadius: 1,
            px: 1,
            py: 0.5,
          }}
        >
          <ListItemIcon>
            <SvgIcon fontSize="small">
              <CreditCard01 />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText
            primary={<Typography variant="body1">Billing</Typography>}
          />
        </ListItemButton> */}
      </Box>
      <Divider sx={{ my: "0 !important" }} />
      <Box
        sx={{
          display: "flex",
          p: 1,
          justifyContent: "center",
        }}
      >
        <Button color="inherit" size="small">
          Logout
        </Button>
      </Box>
    </Popover>
  );
}

export default AccountPopover;
