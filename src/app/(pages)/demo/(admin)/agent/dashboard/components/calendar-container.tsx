import { alpha } from "@mui/system/colorManipulator";
import { styled } from "@mui/material/styles";

export const CalendarContainer = styled("div")(({ theme }) => ({
  "& .fc-license-message": {
    display: "none",
  },
  "& .fc": {
    "--fc-bg-event-opacity": 1,
    "--fc-border-color": theme.palette.divider,
    "--fc-daygrid-event-dot-width": "12px",
    "--fc-event-bg-color": theme.palette.primary.main,
    "--fc-event-border-color": theme.palette.primary.main,
    "--fc-event-text-color": theme.palette.primary.contrastText,
    "--fc-list-event-hover-bg-color": alpha(theme.palette.primary.main, 0.1),
    "--fc-neutral-bg-color": theme.palette.background.paper,
    "--fc-page-bg-color": theme.palette.background.default,
    "--fc-today-bg-color": alpha(theme.palette.primary.main, 0.2),
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    borderRadius: theme.shape.borderRadius,
  },

  "& .fc .fc-toolbar": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing(2),
    background: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    borderRadius: theme.shape.borderRadius,
  },

  "& .fc .fc-toolbar-title": {
    fontSize: theme.typography.h6.fontSize,
    fontWeight: theme.typography.fontWeightBold,
  },

  "& .fc .fc-button": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderRadius: theme.shape.borderRadius,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },

  "& .fc .fc-col-header-cell-cushion": {
    padding: "10px",
    fontSize: theme.typography.overline.fontSize,
    fontWeight: theme.typography.overline.fontWeight,
    letterSpacing: theme.typography.overline.letterSpacing,
    lineHeight: theme.typography.overline.lineHeight,
    textTransform: "uppercase",
    color: theme.palette.text.secondary,
  },

  "& .fc-day-other .fc-daygrid-day-top": {
    color: theme.palette.text.disabled,
  },

  "& .fc-daygrid-event": {
    borderRadius: theme.shape.borderRadius,
    padding: "4px 8px",
    fontSize: theme.typography.body2.fontSize,
    fontWeight: theme.typography.fontWeightMedium,
    lineHeight: theme.typography.body2.lineHeight,
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: theme.shadows[3],
    },
  },

  "& .fc-daygrid-day-frame": {
    padding: "12px",
    background: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
  },

  "& .fc-scrollgrid": {
    borderColor: "transparent",
  },

  "& .fc-list": {
    borderColor: theme.palette.divider,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
  },

  "& .fc-list-event:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}));
