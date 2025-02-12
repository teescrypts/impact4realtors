import CustomTheme from "@/app/component/custom-theme";
import React, { ReactNode } from "react";
import VerticalLayout from "./vertical-layout";

function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <CustomTheme colorPreset="blue">
      <VerticalLayout navColor="blend-in">{children}</VerticalLayout>
    </CustomTheme>
  );
}

export default DashboardLayout;
