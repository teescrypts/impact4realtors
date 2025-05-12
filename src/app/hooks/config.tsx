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
        title: "Blog",
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
        4,
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
          title: "Agent",
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
