"use client";

import ExpandMore from "@/app/icons/untitled-ui/duocolor/expand-more";
import MenuIcon from "@/app/icons/untitled-ui/duocolor/menu";
import ChevronRight from "@/app/icons/untitled-ui/duocolor/chevron-right";
import {
  AppBar,
  Container,
  Toolbar,
  Box,
  Button,
  MenuItem,
  IconButton,
  Menu as MUImenu,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  SvgIcon,
  useMediaQuery,
  useTheme,
  Stack,
  Divider,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ToastContainer, Zoom } from "react-toastify";
import Close from "@/app/icons/untitled-ui/duocolor/close";

// Helper: build href with optional adminId
const href = (path: string, adminId: string | null, params?: string) => {
  const base = adminId ? `${path}?admin=${adminId}` : path;
  return params ? `${base}${adminId ? "&" : "?"}${params}` : base;
};

function Navbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [listingsOpen, setListingsOpen] = useState(false);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const pathname = usePathname();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isHomePage = pathname === "/demo";
  const isTransparent = !scrolled && isHomePage;

  useEffect(() => {
    setAdminId(localStorage.getItem("adminId"));
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (path: string) =>
    path === "/demo" ? pathname === "/demo" : pathname.startsWith(path);

  const navTextColor = isTransparent ? "rgba(255,255,255,0.92)" : "text.primary";
  const navTextColorHover = isTransparent ? "#fff" : "primary.main";

  const navLinks = [
    { label: "Sell", path: "/demo/sell" },
    { label: "Blog", path: "/demo/blog" },
    { label: "About", path: "/demo/about" },
  ];

  // Mobile drawer content
  const drawer = (
    <Box sx={{ width: 300, height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Drawer header */}
      <Box
        sx={{
          px: 3,
          py: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Link href={href("/demo", adminId)} style={{ display: "flex" }}>
          <Image
            src="/images/demo-logo.png"
            alt="RealtorDemo Logo"
            width={120}
            height={40}
            style={{ objectFit: "contain" }}
            priority
          />
        </Link>
        <IconButton
          size="small"
          onClick={() => setMobileOpen(false)}
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

      {/* Nav links */}
      <List sx={{ px: 2, py: 2, flex: 1 }}>
        {/* Listings accordion */}
        <ListItem disablePadding sx={{ display: "block", mb: 0.5 }}>
          <ListItemButton
            onClick={() => setListingsOpen(!listingsOpen)}
            sx={{
              borderRadius: 1.5,
              px: 2,
              py: 1.25,
              justifyContent: "space-between",
              bgcolor: listingsOpen ? "action.selected" : "transparent",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <ListItemText
              primary="Listings"
              primaryTypographyProps={{ fontWeight: 600, fontSize: "0.9rem" }}
            />
            <SvgIcon
              sx={{
                fontSize: 18,
                transition: "transform 0.2s",
                transform: listingsOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              <ExpandMore />
            </SvgIcon>
          </ListItemButton>

          <Collapse in={listingsOpen} timeout="auto" unmountOnExit>
            <List disablePadding sx={{ pl: 2, mt: 0.5 }}>
              {[
                { label: "Rent", cat: "For Rent" },
                { label: "Buy", cat: "For Sale" },
              ].map(({ label, cat }) => (
                <ListItem key={label} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    component={Link}
                    href={href("/demo/listings", adminId, `category=${cat}`)}
                    sx={{
                      borderRadius: 1.5,
                      px: 2,
                      py: 1,
                      gap: 1,
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <SvgIcon sx={{ fontSize: 14, color: "text.disabled" }}>
                      <ChevronRight />
                    </SvgIcon>
                    <ListItemText
                      primary={label}
                      primaryTypographyProps={{
                        fontSize: "0.875rem",
                        color: "text.secondary",
                        fontWeight: 500,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </ListItem>

        {navLinks.map(({ label, path }) => (
          <ListItem key={label} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link}
              href={href(path, adminId)}
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
                  color: isActive(path) ? "white" : "text.primary",
                }}
              />
              {isActive(path) && (
                <SvgIcon sx={{ fontSize: 16, color: "rgba(255,255,255,0.7)" }}>
                  <ChevronRight />
                </SvgIcon>
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* CTA */}
      <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Button
          fullWidth
          component={Link}
          href={href("/demo/listings", adminId, "category=For Sale")}
          variant="contained"
          size="large"
          sx={{ fontWeight: 700, borderRadius: 1.5, py: 1.25 }}
        >
          Browse Listings
        </Button>
        <Button
          fullWidth
          component={Link}
          href={href("/demo/sell", adminId)}
          variant="outlined"
          size="medium"
          sx={{ borderRadius: 1.5, fontWeight: 600 }}
        >
          Get Home Value
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme.palette.mode}
        transition={Zoom}
      />

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: isTransparent
            ? "transparent"
            : alpha(theme.palette.background.paper, 0.92),
          backdropFilter: isTransparent ? "none" : "blur(14px)",
          borderBottom: isTransparent ? "none" : "1px solid",
          borderColor: "divider",
          boxShadow: isTransparent
            ? "none"
            : `0 1px 16px ${alpha("#000", 0.07)}`,
          transition: "all 0.3s ease",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{ minHeight: { xs: 64, md: 72 }, justifyContent: "space-between" }}
          >
            {/* Logo */}
            <Link href={href("/demo", adminId)} style={{ display: "flex", alignItems: "center" }}>
              <Image
                src="/images/demo-logo.png"
                alt="RealtorDemo Logo"
                width={160}
                height={52}
                style={{
                  objectFit: "contain",
                  cursor: "pointer",
                  filter: isTransparent ? "brightness(0) invert(1)" : "none",
                  transition: "filter 0.3s ease",
                }}
                priority
              />
            </Link>

            {/* Desktop nav */}
            {!isMobile && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                {/* Listings dropdown */}
                <Button
                  onClick={handleMenuOpen}
                  endIcon={
                    <SvgIcon
                      sx={{
                        fontSize: "16px !important",
                        transition: "transform 0.2s",
                        transform: Boolean(anchorEl) ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    >
                      <ExpandMore />
                    </SvgIcon>
                  }
                  sx={{
                    color: navTextColor,
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    textTransform: "none",
                    px: 1.75,
                    py: 1,
                    borderRadius: 1.5,
                    letterSpacing: "0.01em",
                    "&:hover": {
                      bgcolor: isTransparent ? alpha("#fff", 0.1) : "action.hover",
                      color: navTextColorHover,
                    },
                    transition: "all 0.15s ease",
                  }}
                >
                  Listings
                </Button>

                <MUImenu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  slotProps={{
                    paper: {
                      elevation: 0,
                      sx: {
                        mt: 1,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        boxShadow: `0 8px 32px ${alpha("#000", 0.1)}`,
                        minWidth: 160,
                        overflow: "hidden",
                      },
                    },
                    list: { onMouseLeave: handleMenuClose, sx: { p: 0.75 } },
                  }}
                >
                  {[
                    { label: "For Rent", cat: "For Rent" },
                    { label: "For Sale", cat: "For Sale" },
                  ].map(({ label, cat }) => (
                    <MenuItem
                      key={label}
                      component={Link}
                      href={href("/demo/listings", adminId, `category=${cat}`)}
                      onClick={handleMenuClose}
                      sx={{
                        borderRadius: 1.5,
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        py: 1,
                        px: 1.5,
                        mb: 0.25,
                        "&:hover": { bgcolor: "action.hover", color: "primary.main" },
                        transition: "all 0.15s ease",
                      }}
                    >
                      {label}
                    </MenuItem>
                  ))}
                </MUImenu>

                {navLinks.map(({ label, path }) => {
                  const active = isActive(path);
                  return (
                    <Button
                      key={label}
                      component={Link}
                      href={href(path, adminId)}
                      sx={{
                        color: active
                          ? isTransparent ? "#fff" : "primary.main"
                          : navTextColor,
                        fontWeight: active ? 700 : 600,
                        fontSize: "0.875rem",
                        textTransform: "none",
                        px: 1.75,
                        py: 1,
                        borderRadius: 1.5,
                        letterSpacing: "0.01em",
                        bgcolor: active && !isTransparent ? "primary.alpha8" : "transparent",
                        "&:hover": {
                          bgcolor: isTransparent ? alpha("#fff", 0.1) : "action.hover",
                          color: navTextColorHover,
                        },
                        transition: "all 0.15s ease",
                      }}
                    >
                      {label}
                    </Button>
                  );
                })}

                <Box sx={{ ml: 1 }}>
                  <Button
                    component={Link}
                    href={href("/demo/listings", adminId, "category=For Sale")}
                    variant="contained"
                    size="small"
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      px: 2.5,
                      py: 0.875,
                      borderRadius: 1.5,
                      boxShadow: isTransparent
                        ? `0 4px 16px ${alpha("#000", 0.2)}`
                        : "none",
                      "&:hover": { boxShadow: "none" },
                      whiteSpace: "nowrap",
                    }}
                  >
                    Browse Listings
                  </Button>
                </Box>
              </Stack>
            )}

            {/* Mobile hamburger */}
            {isMobile && (
              <IconButton
                onClick={() => setMobileOpen(true)}
                size="medium"
                aria-label="Open menu"
                sx={{
                  color: isTransparent ? "#fff" : "text.primary",
                  bgcolor: isTransparent ? alpha("#fff", 0.12) : "action.hover",
                  borderRadius: 1.5,
                  "&:hover": {
                    bgcolor: isTransparent ? alpha("#fff", 0.2) : "action.selected",
                  },
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

      {/* Mobile Drawer */}
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
            width: 300,
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

export default Navbar;