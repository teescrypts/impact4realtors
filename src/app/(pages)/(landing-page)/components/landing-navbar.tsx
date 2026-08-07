"use client";

import ChevronRight from "@/app/icons/untitled-ui/duocolor/chevron-right";
import Close from "@/app/icons/untitled-ui/duocolor/close";
import ExpandMore from "@/app/icons/untitled-ui/duocolor/expand-more";
import MenuIcon from "@/app/icons/untitled-ui/duocolor/menu";
import {
  AppBar,
  Box,
  Button,
  Collapse,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu as MUImenu,
  MenuItem,
  Stack,
  SvgIcon,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { EXPLORE_DEMO_HREF, GET_STARTED_HREF } from "./cta-buttons";
import { features } from "./features/feature-data";

const navLinks = [
  { label: "Pricing", path: "/pricing" },
  { label: "About Us", path: "/about" },
];

function LandingNavbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const pathname = usePathname();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const closeDrawer = () => setMobileOpen(false);

  const isActive = (path: string) => pathname.startsWith(path.split("#")[0]);
  const featuresActive = pathname.startsWith("/features");

  const brand = (
    <Stack
      component={Link}
      href="/"
      direction="row"
      alignItems="center"
      onClick={closeDrawer}
      sx={{ textDecoration: "none" }}
    >
      <Image
        src="/images/logo.png"
        alt="Company Logo"
        width={40}
        height={40}
        style={{ objectFit: "contain" }}
      />
      <Typography
        variant="h6"
        component="div"
        color="textPrimary"
        sx={{ ml: 2, fontWeight: 700 }}
      >
        RealtyIllustrations
      </Typography>
    </Stack>
  );

  // Mobile drawer content
  const drawer = (
    <Box
      sx={{
        width: 320,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        {brand}
        <IconButton
          size="small"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
          sx={{
            bgcolor: "action.hover",
            borderRadius: 1.5,
            "&:hover": { bgcolor: "action.selected" },
          }}
        >
          <SvgIcon sx={{ fontSize: 18 }}>
            <Close />
          </SvgIcon>
        </IconButton>
      </Box>

      <List sx={{ px: 2, py: 2, flex: 1, overflowY: "auto" }}>
        {/* Features accordion */}
        <ListItem disablePadding sx={{ display: "block", mb: 0.5 }}>
          <ListItemButton
            onClick={() => setFeaturesOpen(!featuresOpen)}
            sx={{
              borderRadius: 1.5,
              px: 2,
              py: 1.25,
              justifyContent: "space-between",
              bgcolor: featuresOpen ? "action.selected" : "transparent",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <ListItemText
              primary="Features"
              primaryTypographyProps={{ fontWeight: 600, fontSize: "0.9rem" }}
            />
            <SvgIcon
              sx={{
                fontSize: 18,
                transition: "transform 0.2s",
                transform: featuresOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              <ExpandMore />
            </SvgIcon>
          </ListItemButton>

          <Collapse in={featuresOpen} timeout="auto" unmountOnExit>
            <List disablePadding sx={{ pl: 1, mt: 0.5 }}>
              {features.map(({ slug, title, summary, icon }) => (
                <ListItem key={slug} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    component={Link}
                    href={`/features/${slug}`}
                    onClick={closeDrawer}
                    sx={{
                      borderRadius: 1.5,
                      px: 1.5,
                      py: 1,
                      gap: 1.5,
                      alignItems: "flex-start",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "8px",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: alpha(theme.palette.primary.main, 0.12),
                      }}
                    >
                      <SvgIcon sx={{ fontSize: 16, color: "primary.main" }}>
                        {icon}
                      </SvgIcon>
                    </Box>
                    <ListItemText
                      primary={title}
                      secondary={summary}
                      primaryTypographyProps={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "text.primary",
                      }}
                      secondaryTypographyProps={{
                        fontSize: "0.75rem",
                        lineHeight: 1.5,
                        mt: 0.25,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}

              {/* View all */}
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  href="/features"
                  onClick={closeDrawer}
                  sx={{
                    borderRadius: 1.5,
                    px: 1.5,
                    py: 1,
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <ListItemText
                    primary="View all features →"
                    primaryTypographyProps={{
                      fontSize: "0.8125rem",
                      fontWeight: 700,
                      color: "primary.main",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </Collapse>
        </ListItem>

        {navLinks.map(({ label, path }) => (
          <ListItem key={label} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link}
              href={path}
              onClick={closeDrawer}
              sx={{
                borderRadius: 1.5,
                px: 2,
                py: 1.25,
                bgcolor: isActive(path) ? "primary.main" : "transparent",
                "&:hover": {
                  bgcolor: isActive(path) ? "primary.dark" : "action.hover",
                },
              }}
            >
              <ListItemText
                primary={label}
                primaryTypographyProps={{
                  fontWeight: isActive(path) ? 700 : 500,
                  fontSize: "0.9rem",
                  color: isActive(path)
                    ? "primary.contrastText"
                    : "text.primary",
                }}
              />
              {isActive(path) && (
                <SvgIcon
                  sx={{ fontSize: 16, color: alpha("#fff", 0.7) }}
                >
                  <ChevronRight />
                </SvgIcon>
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* CTAs */}
      <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Button
          fullWidth
          component={Link}
          href={GET_STARTED_HREF}
          onClick={closeDrawer}
          variant="contained"
          size="large"
          sx={{
            fontWeight: 700,
            borderRadius: 1.5,
            py: 1.25,
            textTransform: "none",
          }}
        >
          Get started
        </Button>
        <Button
          fullWidth
          component={Link}
          href={EXPLORE_DEMO_HREF}
          onClick={closeDrawer}
          variant="outlined"
          size="medium"
          sx={{
            fontWeight: 600,
            borderRadius: 1.5,
            textTransform: "none",
          }}
        >
          Explore demo
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: alpha(theme.palette.background.default, 0.92),
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{
              minHeight: { xs: 64, md: 76 },
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            {brand}

            {/* Desktop nav */}
            {!isMobile && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Button
                  onClick={handleMenuOpen}
                  aria-haspopup="menu"
                  aria-expanded={Boolean(anchorEl)}
                  endIcon={
                    <SvgIcon
                      sx={{
                        fontSize: "16px !important",
                        transition: "transform 0.2s",
                        transform: anchorEl
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                    >
                      <ExpandMore />
                    </SvgIcon>
                  }
                  sx={{
                    color: featuresActive ? "primary.main" : "text.primary",
                    fontWeight: featuresActive ? 700 : 600,
                    fontSize: "0.875rem",
                    textTransform: "none",
                    px: 1.75,
                    py: 1,
                    borderRadius: 1.5,
                    letterSpacing: "0.01em",
                    "&:hover": {
                      bgcolor: "action.hover",
                      color: "primary.main",
                    },
                    transition: "all 0.15s ease",
                  }}
                >
                  Features
                </Button>

                <MUImenu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                  transformOrigin={{ vertical: "top", horizontal: "center" }}
                  slotProps={{
                    paper: {
                      elevation: 0,
                      sx: {
                        mt: 1,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        boxShadow: `0 8px 32px ${alpha("#000", 0.1)}`,
                        width: 680,
                        maxWidth: "calc(100vw - 32px)",
                        overflow: "hidden",
                      },
                    },
                    list: {
                      onMouseLeave: handleMenuClose,
                      sx: {
                        p: 1,
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 0.5,
                      },
                    },
                  }}
                >
                  {features.map(({ slug, title, summary, icon }) => (
                    <MenuItem
                      key={slug}
                      component={Link}
                      href={`/features/${slug}`}
                      onClick={handleMenuClose}
                      sx={{
                        borderRadius: 1.5,
                        alignItems: "flex-start",
                        gap: 1.5,
                        p: 1.5,
                        whiteSpace: "normal",
                        "&:hover": {
                          bgcolor: "action.hover",
                          "& .feature-title": { color: "primary.main" },
                        },
                        transition: "all 0.15s ease",
                      }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: "10px",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: alpha(theme.palette.primary.main, 0.12),
                        }}
                      >
                        <SvgIcon sx={{ fontSize: 18, color: "primary.main" }}>
                          {icon}
                        </SvgIcon>
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          className="feature-title"
                          sx={{
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            color: "text.primary",
                            lineHeight: 1.4,
                            transition: "color 0.15s ease",
                          }}
                        >
                          {title}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            color: "text.secondary",
                            lineHeight: 1.55,
                            mt: 0.25,
                          }}
                        >
                          {summary}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}

                  {/* View all — spans both columns */}
                  <MenuItem
                    component={Link}
                    href="/features"
                    onClick={handleMenuClose}
                    sx={{
                      gridColumn: "1 / -1",
                      mt: 0.5,
                      borderRadius: 1.5,
                      justifyContent: "center",
                      py: 1.25,
                      borderTop: "1px solid",
                      borderColor: "divider",
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      fontSize: "0.8125rem",
                      fontWeight: 700,
                      color: "primary.main",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    View all features →
                  </MenuItem>
                </MUImenu>

                {navLinks.map(({ label, path }) => {
                  const active = isActive(path);
                  return (
                    <Button
                      key={label}
                      component={Link}
                      href={path}
                      sx={{
                        color: active ? "primary.main" : "text.primary",
                        fontWeight: active ? 700 : 600,
                        fontSize: "0.875rem",
                        textTransform: "none",
                        px: 1.75,
                        py: 1,
                        borderRadius: 1.5,
                        letterSpacing: "0.01em",
                        bgcolor: active
                          ? alpha(theme.palette.primary.main, 0.08)
                          : "transparent",
                        "&:hover": {
                          bgcolor: "action.hover",
                          color: "primary.main",
                        },
                        transition: "all 0.15s ease",
                      }}
                    >
                      {label}
                    </Button>
                  );
                })}

                <Button
                  component={Link}
                  href={GET_STARTED_HREF}
                  variant="contained"
                  size="small"
                  sx={{
                    ml: 1,
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    textTransform: "none",
                    px: 2.5,
                    py: 0.875,
                    borderRadius: 1.5,
                    boxShadow: "none",
                    whiteSpace: "nowrap",
                    "&:hover": { boxShadow: "none" },
                  }}
                >
                  Get started
                </Button>
              </Stack>
            )}

            {/* Mobile hamburger */}
            {isMobile && (
              <IconButton
                onClick={() => setMobileOpen(true)}
                size="medium"
                aria-label="Open menu"
                sx={{
                  color: "text.primary",
                  bgcolor: "action.hover",
                  borderRadius: 1.5,
                  "&:hover": { bgcolor: "action.selected" },
                  transition: "background-color 0.15s ease",
                }}
              >
                <SvgIcon sx={{ fontSize: 20 }}>
                  <MenuIcon />
                </SvgIcon>
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 320,
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

export default LandingNavbar;
