import { Box, Stack } from "@mui/material";
import React, { ReactNode } from "react";
import SideNavItem from "./sidenav-item";

interface MenuItem {
  title: string;
  path?: string;
  items?: MenuItem[];
  icon?: ReactNode;
  label?: string;
  disabled?: boolean;
  external?: boolean;
}

const renderItems = ({
  depth = 0,
  items,
  pathname,
  isCollapsed = false,
}: {
  depth?: number;
  items: MenuItem[];
  pathname: string;
  isCollapsed?: boolean;
}): ReactNode[] =>
  items.reduce(
    (acc, item) =>
      reduceChildRoutes({
        acc,
        depth,
        item,
        pathname,
        isCollapsed,
      }),
    [] as ReactNode[]
  );

// Reduce child routes and render SideNavItems
const reduceChildRoutes = ({
  acc,
  depth,
  item,
  pathname,
  isCollapsed = false,
}: {
  acc: ReactNode[];
  depth: number;
  item: MenuItem;
  pathname: string;
  isCollapsed?: boolean;
}): ReactNode[] => {
  const checkPath = !!(item.path && pathname);
  const partialMatch = checkPath ? pathname.includes(item.path || "") : false;
  const exactMatch = checkPath ? pathname.startsWith(item.path || "") : false;

  if (item.items) {
    acc.push(
      <SideNavItem
        active={partialMatch}
        depth={depth}
        disabled={item.disabled}
        icon={item.icon}
        key={item.title}
        label={item.label}
        open={partialMatch}
        title={item.title}
        isCollapsed={isCollapsed}
      >
        <Stack
          component="ul"
          spacing={0.5}
          sx={{
            listStyle: "none",
            m: 0,
            p: 0,
          }}
        >
          {renderItems({
            depth: depth + 1,
            items: item.items,
            pathname,
            isCollapsed,
          })}
        </Stack>
      </SideNavItem>
    );
  } else {
    acc.push(
      <SideNavItem
        active={exactMatch}
        depth={depth}
        disabled={item.disabled}
        external={item.external}
        icon={item.icon}
        key={item.title}
        label={item.label}
        path={item.path}
        title={item.title}
        isCollapsed={isCollapsed}
      />
    );
  }

  return acc;
};

function SideNavSection({
  items = [],
  pathname,
  subheader = "",
  isCollapsed = false,
  ...other
}: {
  items: MenuItem[];
  pathname: string;
  subheader?: string | ReactNode;
  isCollapsed?: boolean;
}) {
  return (
    <Stack
      component="ul"
      spacing={0.5}
      sx={{
        listStyle: "none",
        m: 0,
        p: 0,
      }}
      {...other}
    >
      {subheader && !isCollapsed && (
        <Box
          component="li"
          sx={{
            color: "var(--nav-section-title-color)",
            fontFamily: (theme) => theme.typography.fontFamily,
            fontSize: 12,
            fontWeight: 700,
            lineHeight: 1.66,
            mb: 1,
            ml: 1,
            textTransform: "uppercase",
          }}
        >
          {subheader}
        </Box>
      )}
      {renderItems({ items, pathname, isCollapsed })}
    </Stack>
  );
}

export default SideNavSection;
