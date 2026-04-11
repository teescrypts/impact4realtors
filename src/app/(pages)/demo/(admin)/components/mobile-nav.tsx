import { Scrollbar } from "@/app/component/scrollbar";
import ImpactLogo from "@/app/icons/untitled-ui/duocolor/impact-logo";
import { Box, Drawer, Stack, SvgIconProps, useTheme, Typography, alpha } from "@mui/material";
import { usePathname } from "next/navigation";
import React, { ReactElement, ReactNode, useMemo } from "react";
import MobileNavSection from "./mobile-nav-section";
import { motion } from "framer-motion";

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

const MOBILE_NAV_WIDTH = 280;

const useCssVars = (color: "blend-in" | "discrete" | "evident") => {
  const theme = useTheme();

  return useMemo(() => {
    switch (color) {
      // Blend-in and discrete have no difference on mobile because
      // there's a backdrop and differences are not visible
      case "blend-in":
      case "discrete":
        if (theme.palette.mode === "dark") {
          return {
            "--nav-bg": theme.palette.background.default,
            "--nav-color": theme.palette.neutral[100],
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

      case "evident":
        if (theme.palette.mode === "dark") {
          return {
            "--nav-bg": theme.palette.neutral[900],
            "--nav-color": theme.palette.common.white,
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

function MobileNav({
  color = "evident",
  open,
  onClose,
  sections = [],
}: {
  color: "blend-in" | "discrete" | "evident";
  open: boolean;
  onClose: () => void;
  sections: MenuSection[];
}) {
  const pathname = usePathname();
  const cssVars = useCssVars(color);

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          ...cssVars,
          backgroundColor: "var(--nav-bg)",
          color: "var(--nav-color)",
          width: MOBILE_NAV_WIDTH,
        },
      }}
      variant="temporary"
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
            sx={{ p: 3 }}
          >
            <motion.div whileTap={{ scale: 0.95 }}>
              <Box
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
                }}
              >
                <ImpactLogo />
              </Box>
            </motion.div>
            <Typography 
              variant="h6" 
              sx={{ 
                flexGrow: 1,
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              RealtorDemo
            </Typography>
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
              <MobileNavSection
                items={section.items}
                key={index}
                pathname={pathname}
                subheader={section.subheader}
              />
            ))}
          </Stack>
        </Stack>
      </Scrollbar>
    </Drawer>
  );
}

export default MobileNav;
