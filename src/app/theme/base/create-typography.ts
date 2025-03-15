import { TypographyOptions } from "@mui/material/styles/createTypography";

export const createTypography = (): TypographyOptions => {
  return {
    fontFamily:
      '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',

    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: "0.2px",
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: "0.2px",
    },
    button: {
      fontFamily: '"Satoshi", sans-serif',
      fontWeight: 600,
      textTransform: "none",
      letterSpacing: "0.5px",
    },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 500,
      lineHeight: 1.7,
      letterSpacing: "0.3px",
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.6,
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: 1.6,
    },
    overline: {
      fontSize: "0.75rem",
      fontWeight: 700,
      letterSpacing: "1px",
      lineHeight: 2.6,
      textTransform: "uppercase",
    },
    h1: {
      fontFamily: "'DM Serif Display', serif",
      fontWeight: 700,
      fontSize: "3.5rem",
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: "'DM Serif Display', serif",
      fontWeight: 700,
      fontSize: "3rem",
      lineHeight: 1.2,
    },
    h3: {
      fontFamily: "'DM Serif Display', serif",
      fontWeight: 700,
      fontSize: "2.25rem",
      lineHeight: 1.3,
    },
    h4: {
      fontFamily: "'DM Serif Display', serif",
      fontWeight: 700,
      fontSize: "2rem",
      lineHeight: 1.3,
    },
    h5: {
      fontFamily: "'DM Serif Display', serif",
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.4,
    },
    h6: {
      fontFamily: "'DM Serif Display', serif",
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.5,
    },
  };
};
