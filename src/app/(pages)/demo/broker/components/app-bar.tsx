"use client";

import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useScrollTrigger,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import Link from "next/link";
import Menu from "@/app/icons/untitled-ui/duocolor/menu";
import { usePathname } from "next/navigation";
import { ToastContainer, Zoom } from "react-toastify";

export default function MainAppBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminId, setAdminId] = useState<string | null>(null);
  const pathname = usePathname();
  const theme = useTheme();

  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });

  const toggleDrawer = () => setMobileOpen(!mobileOpen);

  // Determine text color based on route and scroll
  const isHome = pathname === "/demo/broker";
  const textColor = isHome && !trigger ? "#fff" : "peimary";

  useEffect(() => {
    const adminId = localStorage.getItem("adminId");
    setAdminId(adminId);
  }, []);

  const navItems = [
    {
      label: "Buy",
      href: adminId
        ? `/demo/broker/listings?category=${"For Sale"}&admin=${adminId}`
        : `/demo/broker/listings?category=${"For Sale"}`,
    },
    {
      label: "Rent",
      href: adminId
        ? `/demo/broker/listings?category=${"For Rent"}&admin=${adminId}`
        : `/demo/broker/listings?category=${"For Rent"}`,
    },
    {
      label: "Sell",
      href: adminId
        ? `/demo/broker/sell?admin=${adminId}`
        : "/demo/broker/sell",
    },
    {
      label: "Our Agents",
      href: adminId
        ? `/demo/broker/agents?admin=${adminId}`
        : "/demo/broker/agents",
    },
    {
      label: "Blog",
      href: adminId
        ? `/demo/broker/blog?admin=${adminId}`
        : "/demo/broker/blog",
    },
    {
      label: "About Us",
      href: adminId
        ? `/demo/broker/about?admin=${adminId}`
        : "/demo/broker/about",
    },
  ];

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
        elevation={trigger ? 4 : 0}
        sx={{
          backgroundColor: trigger ? "white" : "transparent",
          transition: "background-color 0.3s ease",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            {/* Logo */}
            <Typography
              variant="h6"
              component={Link}
              href={adminId ? `/demo/broker?admin=${adminId}` : `/demo/broker`}
              sx={{
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "1.4rem",
              }}
            >
              RealtyDemo
            </Typography>

            {/* Desktop Nav */}
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  href={item.href}
                  sx={{
                    color: textColor,
                    fontWeight: 500,
                    textTransform: "none",
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {/* Mobile Hamburger */}
            <IconButton
              edge="end"
              onClick={toggleDrawer}
              sx={{ display: { md: "none" }, color: textColor }}
            >
              <Menu />
            </IconButton>
          </Toolbar>
        </Container>

        {/* Mobile Drawer */}
        <Drawer anchor="right" open={mobileOpen} onClose={toggleDrawer}>
          <Box sx={{ width: 250, p: 2 }}>
            <List>
              {navItems.map((item) => (
                <ListItem
                  key={item.label}
                  component={Link}
                  href={item.href}
                  onClick={toggleDrawer}
                >
                  <ListItemText primary={item.label} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </AppBar>
    </>
  );
}
