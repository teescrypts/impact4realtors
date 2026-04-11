import { RouterLink } from "@/app/component/router-link";
import { Scrollbar } from "@/app/component/scrollbar";
import ImpactLogo from "@/app/icons/untitled-ui/duocolor/impact-logo";
import {
  Box,
  Drawer,
  Stack,
  SvgIconProps,
  Typography,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
} from "@mui/material";
import { usePathname } from "next/navigation";
import React, { ReactElement, ReactNode, useMemo } from "react";
import SideNavSection from "./side-nav-section";
import { motion, AnimatePresence } from "framer-motion";
import ChevronLeft from "@/app/icons/untitled-ui/duocolor/chevron-left";
import ChevronRight from "@/app/icons/untitled-ui/duocolor/chevron-right";

const SIDE_NAV_WIDTH = 280;
const SIDE_NAV_COLLAPSED_WIDTH = 73;

const useCssVars = (color: "blend-in" | "discrete" | "evident") => {
  const theme = useTheme();

  return useMemo(() => {
    switch (color) {
      case "blend-in":
        if (theme.palette.mode === "dark") {
          return {
            "--nav-bg": theme.palette.background.default,
            "--nav-color": theme.palette.neutral[100],
            "--nav-border-color": "transparent",
            "--nav-logo-border": theme.palette.neutral[700],
            "--nav-section-title-color": theme.palette.neutral[400],
            "--nav-item-color": theme.palette.neutral[400],
            "--nav-item-hover-bg": alpha(theme.palette.primary.main, 0.08),
            "--nav-item-active-bg": alpha(theme.palette.primary.main, 0.12),
            "--nav-item-active-color": theme.palette.primary.main,
            "--nav-item-disabled-color": theme.palette.neutral[600],
            "--nav-item-icon-color": theme.palette.neutral[500],
            "--nav-item-icon-active-color": theme.palette.primary.main,
            "--nav-item-icon-disabled-color": theme.palette.neutral[700],
            "--nav-item-chevron-color": theme.palette.neutral[600],
            "--nav-scrollbar-color": theme.palette.neutral[400],
          };
        } else {
          return {
            "--nav-bg": theme.palette.background.default,
            "--nav-color": theme.palette.text.primary,
            "--nav-border-color": "transparent",
            "--nav-logo-border": theme.palette.divider,
            "--nav-section-title-color": theme.palette.neutral[500],
            "--nav-item-color": theme.palette.text.secondary,
            "--nav-item-hover-bg": alpha(theme.palette.primary.main, 0.04),
            "--nav-item-active-bg": alpha(theme.palette.primary.main, 0.08),
            "--nav-item-active-color": theme.palette.primary.main,
            "--nav-item-disabled-color": theme.palette.neutral[400],
            "--nav-item-icon-color": theme.palette.neutral[500],
            "--nav-item-icon-active-color": theme.palette.primary.main,
            "--nav-item-icon-disabled-color": theme.palette.neutral[400],
            "--nav-item-chevron-color": theme.palette.neutral[500],
            "--nav-scrollbar-color": theme.palette.neutral[900],
          };
        }

      case "discrete":
        if (theme.palette.mode === "dark") {
          return {
            "--nav-bg": theme.palette.neutral[900],
            "--nav-color": theme.palette.neutral[100],
            "--nav-border-color": theme.palette.neutral[800],
            "--nav-logo-border": theme.palette.neutral[700],
            "--nav-section-title-color": theme.palette.neutral[400],
            "--nav-item-color": theme.palette.neutral[400],
            "--nav-item-hover-bg": alpha(theme.palette.primary.main, 0.08),
            "--nav-item-active-bg": alpha(theme.palette.primary.main, 0.12),
            "--nav-item-active-color": theme.palette.primary.main,
            "--nav-item-disabled-color": theme.palette.neutral[600],
            "--nav-item-icon-color": theme.palette.neutral[500],
            "--nav-item-icon-active-color": theme.palette.primary.main,
            "--nav-item-icon-disabled-color": theme.palette.neutral[700],
            "--nav-item-chevron-color": theme.palette.neutral[600],
            "--nav-scrollbar-color": theme.palette.neutral[400],
          };
        } else {
          return {
            "--nav-bg": theme.palette.neutral[50],
            "--nav-color": theme.palette.text.primary,
            "--nav-border-color": theme.palette.divider,
            "--nav-logo-border": theme.palette.neutral[200],
            "--nav-section-title-color": theme.palette.neutral[500],
            "--nav-item-color": theme.palette.neutral[600],
            "--nav-item-hover-bg": alpha(theme.palette.primary.main, 0.04),
            "--nav-item-active-bg": alpha(theme.palette.primary.main, 0.08),
            "--nav-item-active-color": theme.palette.primary.main,
            "--nav-item-disabled-color": theme.palette.neutral[400],
            "--nav-item-icon-color": theme.palette.neutral[500],
            "--nav-item-icon-active-color": theme.palette.primary.main,
            "--nav-item-icon-disabled-color": theme.palette.neutral[400],
            "--nav-item-chevron-color": theme.palette.neutral[500],
            "--nav-scrollbar-color": theme.palette.neutral[900],
          };
        }

      case "evident":
        if (theme.palette.mode === "dark") {
          return {
            "--nav-bg": theme.palette.neutral[900],
            "--nav-color": theme.palette.common.white,
            "--nav-border-color": "transparent",
            "--nav-logo-border": theme.palette.neutral[700],
            "--nav-section-title-color": theme.palette.neutral[400],
            "--nav-item-color": theme.palette.neutral[300],
            "--nav-item-hover-bg": alpha(theme.palette.common.white, 0.08),
            "--nav-item-active-bg": alpha(theme.palette.primary.main, 0.16),
            "--nav-item-active-color": theme.palette.common.white,
            "--nav-item-disabled-color": theme.palette.neutral[600],
            "--nav-item-icon-color": theme.palette.neutral[400],
            "--nav-item-icon-active-color": theme.palette.primary.light,
            "--nav-item-icon-disabled-color": theme.palette.neutral[700],
            "--nav-item-chevron-color": theme.palette.neutral[600],
            "--nav-scrollbar-color": theme.palette.neutral[400],
          };
        } else {
          return {
            "--nav-bg": theme.palette.neutral[900],
            "--nav-color": theme.palette.common.white,
            "--nav-border-color": "transparent",
            "--nav-logo-border": theme.palette.neutral[700],
            "--nav-section-title-color": theme.palette.neutral[400],
            "--nav-item-color": theme.palette.neutral[300],
            "--nav-item-hover-bg": alpha(theme.palette.common.white, 0.08),
            "--nav-item-active-bg": alpha(theme.palette.primary.main, 0.16),
            "--nav-item-active-color": theme.palette.common.white,
            "--nav-item-disabled-color": theme.palette.neutral[600],
            "--nav-item-icon-color": theme.palette.neutral[400],
            "--nav-item-icon-active-color": theme.palette.primary.light,
            "--nav-item-icon-disabled-color": theme.palette.neutral[700],
            "--nav-item-chevron-color": theme.palette.neutral[600],
            "--nav-scrollbar-color": theme.palette.neutral[400],
          };
        }

      default:
        return {};
    }
  }, [theme, color]);
};

interface MenuItem {
  title: string;
  path: string;
  icon?: ReactElement<SvgIconProps>;
  items?: MenuItem[];
}

interface MenuSection {
  subheader?: string | ReactNode;
  items: MenuItem[];
}

interface SidenavProps {
  color?: "blend-in" | "discrete" | "evident";
  sections?: MenuSection[];
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

function Sidenav({
  color = "evident",
  sections = [],
  isCollapsed = false,
  onToggleCollapse,
}: SidenavProps) {
  const pathname = usePathname();
  const cssVars = useCssVars(color);
  const currentWidth = isCollapsed ? SIDE_NAV_COLLAPSED_WIDTH : SIDE_NAV_WIDTH;

  return (
    <Drawer
      anchor="left"
      open
      slotProps={{
        paper: {
          sx: {
            ...cssVars,
            backgroundColor: "var(--nav-bg)",
            borderRightColor: "var(--nav-border-color)",
            borderRightStyle: "solid",
            borderRightWidth: 1,
            color: "var(--nav-color)",
            width: currentWidth,
            transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            overflowX: "hidden",
          },
        },
      }}
      variant="permanent"
    >
      <Scrollbar
        sx={{
          height: "100%",
          "& .simplebar-content": {
            height: "100%",
          },
          "& .simplebar-scrollbar:before": {
            background: "var(--nav-scrollbar-color)",
          },
        }}
      >
        <Stack sx={{ height: "100%" }}>
          {/* Logo and Brand */}
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
            sx={{
              p: 3,
              justifyContent: isCollapsed ? "center" : "flex-start",
            }}
          >
            {isCollapsed ? (
              <Tooltip title="RealtorDemo" placement="right" arrow>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Box
                    component={RouterLink}
                    href={"/"}
                    sx={{
                      borderColor: "var(--nav-logo-border)",
                      borderRadius: 2,
                      borderStyle: "solid",
                      borderWidth: 1,
                      display: "flex",
                      height: 48,
                      p: 1,
                      width: 48,
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: "primary.main",
                        boxShadow: (theme) =>
                          `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
                      },
                    }}
                  >
                    <ImpactLogo />
                  </Box>
                </motion.div>
              </Tooltip>
            ) : (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Box
                    component={RouterLink}
                    href={"/"}
                    sx={{
                      borderColor: "var(--nav-logo-border)",
                      borderRadius: 2,
                      borderStyle: "solid",
                      borderWidth: 1,
                      display: "flex",
                      height: 48,
                      p: 1,
                      width: 48,
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: "primary.main",
                        boxShadow: (theme) =>
                          `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
                      },
                    }}
                  >
                    <ImpactLogo />
                  </Box>
                </motion.div>
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      RealtorDemo
                    </Typography>
                  </motion.div>
                </AnimatePresence>
              </>
            )}
          </Stack>

          {/* Navigation Sections */}
          <Stack
            component="nav"
            spacing={3}
            sx={{
              flexGrow: 1,
              px: 2,
              pb: 3,
            }}
          >
            {sections.map((section, index) => (
              <SideNavSection
                items={section.items}
                key={index}
                pathname={pathname}
                subheader={section.subheader}
                isCollapsed={isCollapsed}
              />
            ))}
          </Stack>

          {/* Toggle Button */}
          {onToggleCollapse && (
            <Box
              sx={{
                p: 2,
                borderTop: (theme) =>
                  `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                display: "flex",
                justifyContent: isCollapsed ? "center" : "flex-end",
              }}
            >
              <Tooltip
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                placement="right"
                arrow
              >
                <IconButton
                  onClick={onToggleCollapse}
                  size="small"
                  sx={{
                    color: "var(--nav-item-icon-color)",
                    "&:hover": {
                      backgroundColor: "var(--nav-item-hover-bg)",
                      color: "var(--nav-item-icon-active-color)",
                    },
                  }}
                >
                  {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Stack>
      </Scrollbar>
    </Drawer>
  );
}

export default Sidenav;
export { SIDE_NAV_WIDTH, SIDE_NAV_COLLAPSED_WIDTH };
