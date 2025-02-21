import { Box, ListItem, ListItemText, Typography } from "@mui/material";
import React, { ReactNode } from "react";

type propTypes = {
  align: "horizontal" | "vertical";
  children?: ReactNode;
  disableGutters?: boolean;
  value?: string;
  label?: string;
  divider?: boolean;
};

function PropertyListItem({
  align = "vertical",
  children,
  disableGutters,
  value,
  divider,
  label,
  ...other
}: propTypes) {
  return (
    <ListItem
      sx={{
        px: disableGutters ? 0 : 3,
        py: 1.5,
      }}
      divider={divider ? true : false}
      {...other}
    >
      <ListItemText
        disableTypography
        primary={
          <Typography
            sx={{
              minWidth: align === "vertical" ? "inherit" : 180,
              mb: { sm: 1, xs: 1 },
            }}
            variant="subtitle1"
          >
            {label}
          </Typography>
        }
        secondary={
          <Box
            sx={{
              flex: 1,
              mt: align === "vertical" ? 0.5 : 0,
            }}
          >
            {children || (
              <Typography color="text.secondary" variant="body2">
                {value}
              </Typography>
            )}
          </Box>
        }
        sx={{
          display: "flex",
          flexDirection: align === "vertical" ? "column" : "row",
          my: 0,
        }}
      />
    </ListItem>
  );
}

export default PropertyListItem;
