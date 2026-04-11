import { RouterLink } from "@/app/component/router-link";
import ChevronRight from "@/app/icons/untitled-ui/duocolor/chevron-right";
import DownArrow from "@/app/icons/untitled-ui/duocolor/down-arrow";
import { Box, ButtonBase, SvgIcon, Collapse } from "@mui/material";
import React, { ReactNode, useCallback, useState } from "react";
import { motion } from "framer-motion";

interface MobileNavItemProps {
  active: boolean;
  children?: ReactNode;
  depth?: number;
  disabled?: boolean;
  external?: boolean;
  icon?: ReactNode;
  label?: string;
  open?: boolean;
  path?: string;
  title: string;
}

function MobileNavItem({
  active,
  children,
  depth = 0,
  disabled,
  icon,
  label,
  open: openProp,
  path,
  title,
}: MobileNavItemProps) {
  const [open, setOpen] = useState(!!openProp);

  const handleToggle = useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
  }, []);

  // Icons for top-level items or bullets for deeper levels
  let startIcon: ReactNode;

  if (depth === 0) {
    startIcon = icon;
  } else {
    startIcon = (
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          height: 20,
          justifyContent: "center",
          width: 20,
        }}
      >
        <Box
          sx={{
            backgroundColor: "var(--nav-item-icon-color)",
            borderRadius: "50%",
            height: 4,
            opacity: 0,
            width: 4,
            transition: "all 0.2s",
            ...(active && {
              backgroundColor: "var(--nav-item-icon-active-color)",
              height: 6,
              opacity: 1,
              width: 6,
            }),
          }}
        />
      </Box>
    );
  }

  const offset = depth === 0 ? 0 : (depth - 1) * 16;

  const baseButtonStyles = {
    alignItems: "center",
    borderRadius: 2,
    display: "flex",
    justifyContent: "flex-start",
    pl: `${16 + offset}px`,
    pr: "16px",
    py: 1,
    textAlign: "left",
    width: "100%",
    position: "relative",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    ...(active &&
      depth === 0 && {
        backgroundColor: "var(--nav-item-active-bg)",
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          height: "60%",
          width: 3,
          backgroundColor: "var(--nav-item-icon-active-color)",
          borderRadius: "0 4px 4px 0",
        },
      }),
    "&:hover": {
      backgroundColor: "var(--nav-item-hover-bg)",
    },
  } as const;

  // Render branch items (with children)
  if (children) {
    return (
      <motion.li
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        <ButtonBase
          disabled={disabled}
          onClick={handleToggle}
          sx={baseButtonStyles}
        >
          {startIcon && (
            <Box
              component="span"
              sx={{
                alignItems: "center",
                color: "var(--nav-item-icon-color)",
                display: "inline-flex",
                justifyContent: "center",
                mr: 2,
                transition: "color 0.2s",
                ...(active && {
                  color: "var(--nav-item-icon-active-color)",
                }),
              }}
            >
              {startIcon}
            </Box>
          )}

          <Box
            component="span"
            sx={{
              color: "var(--nav-item-color)",
              flexGrow: 1,
              fontFamily: (theme) => theme.typography.fontFamily,
              fontSize: depth > 0 ? 13 : 14,
              fontWeight: depth > 0 ? 500 : 600,
              lineHeight: "24px",
              whiteSpace: "nowrap",
              transition: "color 0.2s",
              ...(active && {
                color: "var(--nav-item-active-color)",
                fontWeight: 600,
              }),
              ...(disabled && {
                color: "var(--nav-item-disabled-color)",
              }),
            }}
          >
            {title}
          </Box>
          <motion.div
            animate={{ rotate: open ? 0 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <SvgIcon
              sx={{
                color: "var(--nav-item-chevron-color)",
                fontSize: 16,
                ml: 2,
                transition: "all 0.2s",
              }}
            >
              {open ? <DownArrow /> : <ChevronRight />}
            </SvgIcon>
          </motion.div>
        </ButtonBase>
        <Collapse in={open} timeout={200}>
          <Box sx={{ mt: 0.5 }}>{children}</Box>
        </Collapse>
      </motion.li>
    );
  }

  return (
    <motion.li
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <ButtonBase
        disabled={disabled}
        sx={baseButtonStyles}
        href={path!}
        LinkComponent={RouterLink}
      >
        {startIcon && (
          <Box
            component="span"
            sx={{
              alignItems: "center",
              color: "var(--nav-item-icon-color)",
              display: "inline-flex",
              justifyContent: "center",
              mr: 2,
              transition: "color 0.2s",
              ...(active && {
                color: "var(--nav-item-icon-active-color)",
              }),
            }}
          >
            {startIcon}
          </Box>
        )}

        <Box
          component="span"
          sx={{
            color: "var(--nav-item-color)",
            flexGrow: 1,
            fontFamily: (theme) => theme.typography.fontFamily,
            fontSize: depth > 0 ? 13 : 14,
            fontWeight: depth > 0 ? 500 : 600,
            lineHeight: "24px",
            whiteSpace: "nowrap",
            transition: "color 0.2s",
            ...(active && {
              color: "var(--nav-item-active-color)",
              fontWeight: 600,
            }),
            ...(disabled && {
              color: "var(--nav-item-disabled-color)",
            }),
          }}
        >
          {title}
        </Box>

        {label && (
          <Box 
            component="span" 
            sx={{ 
              ml: 2,
              fontSize: 11,
              fontWeight: 600,
              px: 1,
              py: 0.25,
              borderRadius: 1,
              backgroundColor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            {label}
          </Box>
        )}
      </ButtonBase>
    </motion.li>
  );
}

export default MobileNavItem;
