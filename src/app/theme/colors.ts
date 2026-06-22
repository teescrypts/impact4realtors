import { alpha } from "@mui/system/colorManipulator";

type Color = {
  lightest: string;
  light: string;
  main: string;
  dark: string;
  darkest: string;
  contrastText: string;
};

const withAlphas = (color: Color) => {
  return {
    ...color,
    alpha4: alpha(color.main, 0.04),
    alpha8: alpha(color.main, 0.08),
    alpha12: alpha(color.main, 0.12),
    alpha30: alpha(color.main, 0.3),
    alpha50: alpha(color.main, 0.5),
  };
};

// -------------------------------------------------- PRIMARY --------------------------------------------------
// "blue" is kept as the export/key name for backwards compatibility with the
// colorPreset config wired up at the call site (createTheme({ colorPreset: "blue" })).
// The values themselves are now a warm, editorial clay/terracotta — the signature
// brand accent — rather than literal blue. Renaming the key would require touching
// the app's theme provider, which isn't in scope here.

export const blue = withAlphas({
  lightest: "#FBF1EA",
  light: "#F1D3BC",
  main: "#B5612B",
  dark: "#8A4720",
  darkest: "#5C2F16",
  contrastText: "#FFFFFF",
});

export const green = withAlphas({
  lightest: "#F6FEF9",
  light: "#EDFCF2",
  main: "#16B364",
  dark: "#087443",
  darkest: "#084C2E",
  contrastText: "#FFFFFF",
});

export const indigo = withAlphas({
  lightest: "#F5F7FF",
  light: "#EBEEFE",
  main: "#6366F1",
  dark: "#4338CA",
  darkest: "#312E81",
  contrastText: "#FFFFFF",
});

export const purple = withAlphas({
  lightest: "#F9F5FF",
  light: "#F4EBFF",
  main: "#9E77ED",
  dark: "#6941C6",
  darkest: "#42307D",
  contrastText: "#FFFFFF",
});

// Secondary brand accent — a warm brass/gold that pairs with the clay
// primary. Used for highlight text, CTA contrast moments (e.g. the home
// valuation button against a dark gradient), and glow accents.
export const gold = withAlphas({
  lightest: "#FDF8EC",
  light: "#F3DFA0",
  main: "#C99A3C",
  dark: "#96701F",
  darkest: "#5E4512",
  contrastText: "#1A1308",
});

// -------------------------------------------------- TOKENS --------------------------------------------------

export const success = withAlphas({
  lightest: "#F0FDF9",
  light: "#3FC79A",
  main: "#10B981",
  dark: "#0B815A",
  darkest: "#134E48",
  contrastText: "#FFFFFF",
});

export const info = withAlphas({
  lightest: "#ECFDFF",
  light: "#CFF9FE",
  main: "#06AED4",
  dark: "#0E7090",
  darkest: "#164C63",
  contrastText: "#FFFFFF",
});

export const warning = withAlphas({
  lightest: "#FFFAEB",
  light: "#FEF0C7",
  main: "#F79009",
  dark: "#B54708",
  darkest: "#7A2E0E",
  contrastText: "#FFFFFF",
});

export const error = withAlphas({
  lightest: "#FEF3F2",
  light: "#FEE4E2",
  main: "#F04438",
  dark: "#B42318",
  darkest: "#7A271A",
  contrastText: "#FFFFFF",
});

export const neutral = {
  50: "#FAF8F6",
  100: "#F3EFEB",
  200: "#E5DED6",
  300: "#D2C6BA",
  400: "#A89A8C",
  500: "#7A6F64",
  600: "#574E45",
  700: "#3A332D",
  800: "#241F1A",
  900: "#14110F",
};
