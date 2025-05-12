"use client";

import { useMobileNav } from "@/app/hooks/use-mobile-nav";
import { styled, Theme, useMediaQuery } from "@mui/material";
import React, { ReactNode } from "react";
import MobileNav from "./mobile-nav";
import TopNav from "./top-nav";
import Sidenav from "./sidenav";
import { useSections } from "@/app/hooks/agent-config";

interface MobileNave {
  handleOpen: () => void;
  handleClose: () => void;
  open: boolean;
}

const SIDE_NAV_WIDTH = 280;

const VerticalLayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  [theme.breakpoints.up("lg")]: {
    paddingLeft: SIDE_NAV_WIDTH,
  },
}));

const VerticalLayoutContainer = styled("div")({
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
  width: "100%",
});

function VerticalLayout({
  children,
  navColor,
}: {
  children: ReactNode;
  navColor: "blend-in" | "discrete" | "evident";
}) {
  const sections = useSections();
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));
  const mobileNav: MobileNave = useMobileNav();

  return (
    <>
      <TopNav onMobileNavOpen={mobileNav.handleOpen} />
      {lgUp && <Sidenav color={navColor} sections={sections} />}
      {!lgUp && (
        <MobileNav
          color={navColor}
          onClose={mobileNav.handleClose}
          open={mobileNav.open}
          sections={sections}
        />
      )}
      <VerticalLayoutRoot>
        <VerticalLayoutContainer>{children}</VerticalLayoutContainer>
      </VerticalLayoutRoot>
    </>
  );
}

export default VerticalLayout;
