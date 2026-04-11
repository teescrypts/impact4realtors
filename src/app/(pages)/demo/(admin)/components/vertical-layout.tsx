"use client";

import { useSections } from "@/app/hooks/config";
import { useMobileNav } from "@/app/hooks/use-mobile-nav";
import { styled, Theme, useMediaQuery } from "@mui/material";
import React, { ReactNode, useState } from "react";
import MobileNav from "./mobile-nav";
import TopNav from "./top-nav";
import Sidenav, { SIDE_NAV_WIDTH, SIDE_NAV_COLLAPSED_WIDTH } from "./sidenav";

interface MobileNave {
  handleOpen: () => void;
  handleClose: () => void;
  open: boolean;
}

const VerticalLayoutRoot = styled("div")<{ isCollapsed: boolean }>(({ theme, isCollapsed }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  [theme.breakpoints.up("lg")]: {
    paddingLeft: isCollapsed ? SIDE_NAV_COLLAPSED_WIDTH : SIDE_NAV_WIDTH,
  },
  transition: "padding-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <>
      <TopNav onMobileNavOpen={mobileNav.handleOpen} isCollapsed={isCollapsed} />
      {lgUp && (
        <Sidenav 
          color={navColor} 
          sections={sections}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />
      )}
      {!lgUp && (
        <MobileNav
          color={navColor}
          onClose={mobileNav.handleClose}
          open={mobileNav.open}
          sections={sections}
        />
      )}
      <VerticalLayoutRoot isCollapsed={isCollapsed}>
        <VerticalLayoutContainer>{children}</VerticalLayoutContainer>
      </VerticalLayoutRoot>
    </>
  );
}

export default VerticalLayout;
export { SIDE_NAV_WIDTH, SIDE_NAV_COLLAPSED_WIDTH };
