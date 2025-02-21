import List from "@mui/material/List";
import { ReactNode } from "react";

export const PropertyList = ({ children }: { children: ReactNode }) => {
  return <List disablePadding>{children}</List>;
};
