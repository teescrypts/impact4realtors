import { alpha } from "@mui/system/colorManipulator";
import { common } from "@mui/material/colors";
import { error, info, neutral, success, warning } from "../colors";
import { getPrimary } from "../utils";
import { PaletteOptions } from "@mui/material";

type Config = {
  direction?: "ltr" | "rtl";
  colorPreset: string;
  contrast: string;
  responsiveFontSizes?: boolean;
};

declare module "@mui/material/styles" {
  interface Palette {
    neutral: { [key: number]: string };
  }

  interface PaletteOptions {
    neutral?: { [key: number]: string };
  }

  interface PaletteColor {
    darkest?: string;
    lightest?: string;
  }

  interface SimplePaletteColorOptions {
    darkest?: string;
    lightest?: string;
  }
}

export const createPalette = (config: Config): PaletteOptions => {
  const { colorPreset, contrast } = config;

  return {
    action: {
      active: neutral[500],
      disabled: alpha(neutral[900], 0.38),
      disabledBackground: alpha(neutral[900], 0.12),
      focus: alpha(neutral[900], 0.16),
      hover: alpha(neutral[900], 0.04),
      selected: alpha(neutral[900], 0.12),
    },
    background: {
      default: contrast === "high" ? neutral[50] : common.white,
      paper: common.white,
    },
    divider: "#D3D5D8",
    error,
    info,
    mode: "light",
    neutral,
    primary: getPrimary(colorPreset),
    success,
    text: {
      primary: neutral[900],
      secondary: neutral[500],
      disabled: alpha(neutral[900], 0.38),
    },
    warning,
  };
};
