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
  alpha,
} from "@mui/material";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

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
          open={!!open}
          slotProps={{
            paper: {
              sx: { 
                width: 240,
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
            <Box sx={{ p: 2 }}>
              <Typography 
                variant="subtitle1" 
                fontWeight={600}
              >
                {user.name}
              </Typography>
              <Typography 
                color="text.secondary" 
                variant="body2"
                sx={{ 
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user.email}
              </Typography>
            </Box>
            
            <Divider />
            
            <Box sx={{ p: 1 }}>
              <ListItemButton
                component={RouterLink}
                href={""}
                onClick={onClose}
                sx={{
                  borderRadius: 1.5,
                  px: 1.5,
                  py: 1,
                  transition: "all 0.2s",
                  "&:hover": {
                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <SvgIcon fontSize="small" color="action">
                    <Users03 />
                  </SvgIcon>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight={500}>
                      Account
                    </Typography>
                  }
                />
              </ListItemButton>
            </Box>
            
            <Divider />
            
            <Box sx={{ p: 1.5 }}>
              <Button 
                color="inherit" 
                size="small" 
                fullWidth
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  borderRadius: 1.5,
                  py: 0.75,
                  "&:hover": {
                    backgroundColor: (theme) => alpha(theme.palette.error.main, 0.08),
                    color: "error.main",
                  },
                }}
              >
                Logout
              </Button>
            </Box>
          </motion.div>
        </Popover>
      )}
    </AnimatePresence>
  );
}

export default AccountPopover;
