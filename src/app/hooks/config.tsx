import { paths } from "@/paths";
import { SvgIcon, SvgIconProps } from "@mui/material";
import { ReactElement, ReactNode, useMemo } from "react";
import HomeSmile from "../icons/untitled-ui/duocolor/home-smile";
import Time from "../icons/untitled-ui/duocolor/time";
import Funnel from "../icons/untitled-ui/duocolor/funnel";
import RealEstateAgent from "../icons/untitled-ui/duocolor/real-estate-agent";
import LayoutAlt02 from "../icons/untitled-ui/duocolor/layout-alt-02";
import Settings from "../icons/untitled-ui/duocolor/settings";
import { useUserData } from "../guards/auth-guard";
import User01 from "../icons/untitled-ui/duocolor/user01";
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
  const user = useUserData();

  return useMemo(() => {
    const baseItems: MenuItem[] = [
      {
        title: "Home",
        value: "home",
        path: paths.home,
        icon: (
          <SvgIcon fontSize="small">
            <HomeSmile />
          </SvgIcon>
        ),
      },
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
        title: "Blogs",
        value: "blog",
        path: paths.blog,
        icon: (
          <SvgIcon fontSize="small">
            <LayoutAlt02 />
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

    // ✨ If user is a broker, add Agent and Requests menu items
    if (user?.isBroker) {
      baseItems.splice(
        5,
        0, // Insert before "Blog"
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
          title: "Agents",
          value: "agent",
          path: paths.agent,
          icon: (
            <SvgIcon fontSize="small">
              <User01 />
            </SvgIcon>
          ),
        },
        {
          title: "Public Profile",
          value: "profile",
          path: paths.profile,
          icon: (
            <SvgIcon fontSize="small">
              <User01 />
            </SvgIcon>
          ),
        }
      );
    }

    return [
      {
        subheader: "DASHBOARD",
        items: baseItems,
      },
    ];
  }, [user]);
};
