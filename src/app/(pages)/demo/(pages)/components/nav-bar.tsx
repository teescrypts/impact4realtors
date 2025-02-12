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
import React, { useState } from "react";

function Navbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [listingsOpen, setListingsOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{ backdropFilter: "blur(10px)", bgcolor: "rgba(255,255,255,0.8)" }}
    >
      <Container>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo */}
          <Link href={"/demo"}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
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
                <MenuItem
                  onClick={handleMenuClose}
                  sx={{ "&:hover": { bgcolor: "#f0f0f0" } }}
                >
                  <Link href="/demo/listings?type=rent" passHref>
                    Rent
                  </Link>
                </MenuItem>
                <MenuItem
                  onClick={handleMenuClose}
                  sx={{ "&:hover": { bgcolor: "#f0f0f0" } }}
                >
                  <Link href="/demo/listings?type=sale" passHref>
                    Buy
                  </Link>
                </MenuItem>
              </MUImenu>
              <Button
                color="inherit"
                component={Link}
                href="/demo/sell"
                sx={{ fontWeight: "bold", color: "#333" }}
              >
                Sell
              </Button>
              <Button
                color="inherit"
                component={Link}
                href="/demo/blog"
                sx={{ fontWeight: "bold", color: "#333" }}
              >
                Blog
              </Button>
              <Button
                color="inherit"
                component={Link}
                href="/demo/about"
                sx={{ fontWeight: "bold", color: "#333" }}
              >
                About Us
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
              href="/demo/listings?type=rent"
              sx={{ pl: 4 }}
            >
              Rent
            </MenuItem>
            <MenuItem
              component={Link}
              href="/demo/listings?type=sale"
              sx={{ pl: 4 }}
            >
              Buy
            </MenuItem>
          </Collapse>
          <MenuItem component={Link} href="/demo/sell">
            Sell
          </MenuItem>
          <MenuItem component={Link} href="/demo/blog">
            Blog
          </MenuItem>
          <MenuItem component={Link} href="/demo/about">
            About Us
          </MenuItem>
        </Collapse>
      </Container>
    </AppBar>
  );
}

export default Navbar;
