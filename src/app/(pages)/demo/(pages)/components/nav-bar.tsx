"use client";

import ExpandMore from "@/app/icons/untitled-ui/duocolor/expand-more";
import Menu from "@/app/icons/untitled-ui/duocolor/menu";
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Box,
  Button,
  MenuItem,
  IconButton,
  Menu as MUImenu,
  Collapse,
  SvgIcon,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ToastContainer, Zoom } from "react-toastify";

function Navbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [listingsOpen, setListingsOpen] = useState(false);
  const [adminId, setAdminId] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const adminId = localStorage.getItem("adminId");
    setAdminId(adminId);
  }, []);

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
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{ backdropFilter: "blur(10px)", bgcolor: "rgba(255,255,255,0.8)" }}
      >
        <Container>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            {/* Logo */}
            <Link href={adminId ? `/demo?admin=${adminId}` : `/demo`}>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: "#333" }}
              >
                RealtorDemo
              </Typography>
            </Link>

            {/* Desktop Menu */}
            {!isMobile ? (
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Button
                  color="inherit"
                  onClick={handleMenuOpen}
                  endIcon={<ExpandMore />}
                  sx={{
                    fontWeight: "bold",
                    color: "#333",
                    textTransform: "none",
                  }}
                >
                  LISTINGS
                </Button>
                <MUImenu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  MenuListProps={{ onMouseLeave: handleMenuClose }}
                  slotProps={{
                    paper: {
                      sx: {
                        mt: 1,
                        borderRadius: 2,
                        boxShadow: 3,
                        minWidth: 180,
                        backgroundColor: "white",
                      },
                    },
                  }}
                >
                  <Link
                    href={
                      adminId
                        ? `/demo/listings?category=${"For Rent"}&admin=${adminId}`
                        : `/demo/listings?category=${"For Rent"}`
                    }
                    passHref
                  >
                    <MenuItem
                      onClick={handleMenuClose}
                      sx={{ "&:hover": { bgcolor: "#f0f0f0" } }}
                    >
                      Rent
                    </MenuItem>
                  </Link>
                  <Link
                    href={
                      adminId
                        ? `/demo/listings?category=${"For Sale"}&admin=${adminId}`
                        : `/demo/listings?category=${"For Sale"}`
                    }
                    passHref
                  >
                    <MenuItem
                      onClick={handleMenuClose}
                      sx={{ "&:hover": { bgcolor: "#f0f0f0" } }}
                    >
                      Buy
                    </MenuItem>
                  </Link>
                </MUImenu>
                <Button
                  color="inherit"
                  component={Link}
                  href={adminId ? `/demo/sell?admin=${adminId}` : `/demo/sell`}
                  sx={{ fontWeight: "bold", color: "#333" }}
                >
                  Sell
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  href={adminId ? `/demo/blog?admin=${adminId}` : `/demo/blog`}
                  sx={{ fontWeight: "bold", color: "#333" }}
                >
                  Blog
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  href={
                    adminId ? `/demo/about?admin=${adminId}` : `/demo/about`
                  }
                  sx={{ fontWeight: "bold", color: "#333" }}
                >
                  About
                </Button>
              </Box>
            ) : (
              // Mobile Menu Button
              <IconButton
                edge="end"
                color="inherit"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                <Menu />
              </IconButton>
            )}
          </Toolbar>

          {/* Mobile Collapse Menu */}
          <Collapse
            in={mobileOpen}
            timeout="auto"
            unmountOnExit
            sx={{ bgcolor: "#f9f9f9", p: 2 }}
          >
            <Button
              fullWidth
              onClick={() => setListingsOpen(!listingsOpen)}
              endIcon={
                <SvgIcon
                  sx={{
                    transform: listingsOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  <ExpandMore />
                </SvgIcon>
              }
              sx={{
                fontWeight: "bold",
                textTransform: "none",
                justifyContent: "space-between",
              }}
            >
              Listings
            </Button>
            <Collapse in={listingsOpen} timeout="auto" unmountOnExit>
              <MenuItem
                component={Link}
                href={
                  adminId
                    ? `/demo/listings?category=${"For Rent"}&admin=${adminId}`
                    : `/demo/listings?category=${"For Rent"}`
                }
                sx={{ pl: 4 }}
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                Rent
              </MenuItem>
              <MenuItem
                component={Link}
                href={
                  adminId
                    ? `/demo/listings?category=${"For Sale"}&admin=${adminId}`
                    : `/demo/listings?category=${"For Sale"}`
                }
                sx={{ pl: 4 }}
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                Buy
              </MenuItem>
            </Collapse>
            <MenuItem
              component={Link}
              href={adminId ? `/demo/sell?admin=${adminId}` : `/demo/sell`}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              Sell
            </MenuItem>
            <MenuItem
              component={Link}
              href={adminId ? `/demo/blog?admin=${adminId}` : `/demo/blog`}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              Blog
            </MenuItem>
            <MenuItem
              component={Link}
              href={adminId ? `/demo/about?admin=${adminId}` : `/demo/about`}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              About Us
            </MenuItem>
          </Collapse>
        </Container>
      </AppBar>
    </>
  );
}

export default Navbar;
