import { agentPaths as paths } from "@/paths";
import { SvgIcon, SvgIconProps } from "@mui/material";
import { ReactElement, ReactNode, useMemo } from "react";
import Funnel from "../icons/untitled-ui/duocolor/funnel";
import RealEstateAgent from "../icons/untitled-ui/duocolor/real-estate-agent";
import Time from "../icons/untitled-ui/duocolor/time";
import Settings from "../icons/untitled-ui/duocolor/settings";
import Percentage from "../icons/untitled-ui/duocolor/percentage";

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
        title: "Leads",
        value: "lead",
        path: paths.lead,
        icon: (
          <SvgIcon fontSize="small">
            <Funnel />
          </SvgIcon>
        ),
      },
      {
        title: "Listings",
        value: "listing",
        path: paths.listing,
        icon: (
          <SvgIcon fontSize="small">
            <RealEstateAgent />
          </SvgIcon>
        ),
      },
      {
        title: "Appointments",
        value: "appointment",
        path: paths.appointment,
        icon: (
          <SvgIcon fontSize="small">
            <Time />
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
        title: "Home Valuations",
        value: "valuation",
        path: paths.home_valuation,
        icon: (
          <SvgIcon fontSize="small">
            <Percentage />
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
