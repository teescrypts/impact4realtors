import { alpha } from "@mui/system/colorManipulator";
import { backdropClasses } from "@mui/material/Backdrop";
import { filledInputClasses } from "@mui/material/FilledInput";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import { paperClasses } from "@mui/material/Paper";
import { tableCellClasses } from "@mui/material/TableCell";
import { common } from "@mui/material/colors";
import { Theme } from "@mui/material";

export const createComponents = () => {
  return {
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: (theme: Theme) => theme.palette.neutral[300],
          color: common.black,
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          [`&:not(.${backdropClasses.invisible})`]: {
            backgroundColor: alpha(common.black, 0.5),
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          [`&.${paperClasses.elevation1}`]: {
            boxShadow:
              "0px 5px 22px rgba(0, 0, 0, 0.08), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.06)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        icon: {
          color: (theme: Theme) => theme.palette.action.active,
        },
        root: {
          borderColor: (theme: Theme) => theme.palette.neutral[700],
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        "#nprogress .bar": {
          backgroundColor: (theme: Theme) => theme.palette.primary.main,
        },
        ".slick-dots li button": {
          "&:before": {
            fontSize: 10,
            color: (theme: Theme) => theme.palette.primary.main,
          },
        },
        ".slick-dots li.slick-active button": {
          "&:before": {
            color: (theme: Theme) => theme.palette.primary.main,
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          "&::placeholder": {
            color: (theme: Theme) => theme.palette.text.secondary,
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderColor: (theme: Theme) => theme.palette.divider,
          "&:hover": {
            backgroundColor: (theme: Theme) => theme.palette.action.hover,
          },
          [`&.${filledInputClasses.disabled}`]: {
            backgroundColor: "transparent",
          },
          [`&.${filledInputClasses.focused}`]: {
            backgroundColor: "transparent",
            borderColor: (theme: Theme) => theme.palette.primary.main,
            boxShadow: (theme: Theme) =>
              `${theme.palette.primary.main} 0 0 0 2px`,
          },
          [`&.${filledInputClasses.error}`]: {
            borderColor: (theme: Theme) => theme.palette.error.main,
            boxShadow: (theme: Theme) =>
              `${theme.palette.error.main} 0 0 0 2px`,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: (theme: Theme) => theme.palette.action.hover,
            [`& .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: (theme: Theme) => theme.palette.divider,
            },
          },
          [`&.${outlinedInputClasses.focused}`]: {
            backgroundColor: "transparent",
            [`& .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: (theme: Theme) => theme.palette.primary.main,
              borderWidth: "3px",
            },
          },
          [`&.${filledInputClasses.error}`]: {
            [`& .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: (theme: Theme) => theme.palette.error.main,
              borderWidth: "3px",
            },
          },
        },
        notchedOutline: {
          borderColor: (theme: Theme) => theme.palette.divider,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          color: (theme: Theme) => theme.palette.neutral[500],
        },
        track: {
          backgroundColor: (theme: Theme) => theme.palette.neutral[400],
          opacity: 1,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottomColor: (theme: Theme) => theme.palette.divider,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          [`& .${tableCellClasses.root}`]: {
            backgroundColor: (theme: Theme) => theme.palette.neutral[800],
            color: (theme: Theme) => theme.palette.neutral[400],
          },
        },
      },
    },
    MuiTimelineConnector: {
      styleOverrides: {
        root: {
          backgroundColor: (theme: Theme) => theme.palette.divider,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backdropFilter: "blur(6px)",
          background: (theme: Theme) => alpha(theme.palette.neutral[900], 0.8),
        },
      },
    },
  };
};
