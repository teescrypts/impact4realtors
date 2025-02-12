import React, { ReactNode } from "react";
import DashboardLayout from "../components/dashboard-layout";

function Layout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

export default Layout;
