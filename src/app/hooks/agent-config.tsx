import { agentPaths as paths } from "@/paths";
import { SvgIcon, SvgIconProps } from "@mui/material";
import { ReactElement, ReactNode, useMemo } from "react";
import Funnel from "../icons/untitled-ui/duocolor/funnel";
import RealEstateAgent from "../icons/untitled-ui/duocolor/real-estate-agent";
import Time from "../icons/untitled-ui/duocolor/time";
import Settings from "../icons/untitled-ui/duocolor/settings";

interface MenuItem {
  title: string;
  value: string;
  path: string;
  icon?: ReactElement<SvgIconProps>;
  items?: MenuItem[];
}

interface MenuSection {
  subheader?: string | ReactNode;
  items: MenuItem[];
}

export const useSections = (): MenuSection[] => {
  return useMemo(() => {
    const baseItems: MenuItem[] = [
      {
        title: "Lead",
        value: "lead",
        path: paths.lead,
        icon: (
          <SvgIcon fontSize="small">
            <Funnel />
          </SvgIcon>
        ),
      },
      {
        title: "Requests",
        value: "requests",
        path: paths.requests,
        icon: (
          <SvgIcon fontSize="small">
            <Time />
          </SvgIcon>
        ),
      },
      {
        title: "Appointment",
        value: "appointment",
        path: paths.appointment,
        icon: (
          <SvgIcon fontSize="small">
            <Time />
          </SvgIcon>
        ),
      },
      {
        title: "Listing",
        value: "listing",
        path: paths.listing,
        icon: (
          <SvgIcon fontSize="small">
            <RealEstateAgent />
          </SvgIcon>
        ),
      },
      {
        title: "Account",
        value: "account",
        path: paths.account,
        icon: (
          <SvgIcon fontSize="small">
            <Settings />
          </SvgIcon>
        ),
      },
    ];

    return [
      {
        subheader: "DASHBOARD",
        items: baseItems,
      },
    ];
  }, []);
};
