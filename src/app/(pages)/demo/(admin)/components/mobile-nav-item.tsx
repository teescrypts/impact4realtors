import { RouterLink } from "@/app/component/router-link";
import ChevronRight from "@/app/icons/untitled-ui/duocolor/chevron-right";
import DownArrow from "@/app/icons/untitled-ui/duocolor/down-arrow";
import { Box, ButtonBase, SvgIcon, Collapse } from "@mui/material";
import React, { ReactNode, useCallback, useState } from "react";

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
          display: "center",
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

  // Render branch items (with children)
  if (children) {
    return (
      <li>
        <ButtonBase
          disabled={disabled}
          onClick={handleToggle}
          sx={{
            alignItems: "center",
            borderRadius: 1,
            display: "flex",
            justifyContent: "flex-start",
            pl: `${16 + offset}px`,
            pr: "16px",
            py: "6px",
            textAlign: "left",
            width: "100%",
            ...(active &&
              depth === 0 && {
                backgroundColor: "var(--nav-item-active-bg)",
              }),
            "&:hover": {
              backgroundColor: "var(--nav-item-hover-bg)",
            },
          }}
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
              ...(active && {
                color: "var(--nav-item-active-color)",
              }),
              ...(disabled && {
                color: "var(--nav-item-disabled-color)",
              }),
            }}
          >
            {title}
          </Box>
          <SvgIcon
            sx={{
              color: "var(--nav-item-chevron-color)",
              fontSize: 16,
              ml: 2,
            }}
          >
            {open ? <DownArrow /> : <ChevronRight />}
          </SvgIcon>
        </ButtonBase>
        <Collapse in={open} sx={{ mt: 0.5 }}>
          {children}
        </Collapse>
      </li>
    );
  }

  return (
    <li>
      <ButtonBase
        disabled={disabled}
        sx={{
          alignItems: "center",
          borderRadius: 1,
          display: "flex",
          justifyContent: "flex-start",
          pl: `${16 + offset}px`,
          pr: "16px",
          py: "6px",
          textAlign: "left",
          width: "100%",
          ...(active &&
            depth === 0 && {
              backgroundColor: "var(--nav-item-active-bg)",
            }),
          "&:hover": {
            backgroundColor: "var(--nav-item-hover-bg)",
          },
        }}
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
            ...(active && {
              color: "var(--nav-item-active-color)",
            }),
            ...(disabled && {
              color: "var(--nav-item-disabled-color)",
            }),
          }}
        >
          {title}
        </Box>

        {label && (
          <Box component="span" sx={{ ml: 2 }}>
            {label}
          </Box>
        )}
      </ButtonBase>
    </li>
  );
}

export default MobileNavItem;
