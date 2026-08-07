"use client";

import { Button, Stack } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Link from "next/link";

export const GET_STARTED_HREF = "/get-started";
export const EXPLORE_DEMO_HREF = "/get-started?intent=demo";

type Props = {
  /** Centre the pair (heroes) or leave it left-aligned (in-page sections). */
  align?: "left" | "center";
  size?: "medium" | "large";
};

/**
 * The site-wide call to action: "Get started" and "Explore demo", both
 * landing on the enquiry form with the matching intent preselected.
 */
export default function CtaButtons({ align = "left", size = "large" }: Props) {
  const large = size === "large";

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      justifyContent={align === "center" ? "center" : "flex-start"}
    >
      <Button
        component={Link}
        href={GET_STARTED_HREF}
        variant="contained"
        color="primary"
        size={size}
        sx={{
          fontWeight: 700,
          borderRadius: "10px",
          px: large ? 4 : 3.5,
          py: large ? 1.6 : 1.4,
          textTransform: "none",
          fontSize: large ? "1rem" : "0.9375rem",
          boxShadow: `0 4px 24px ${alpha("#000", 0.12)}`,
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: `0 8px 32px ${alpha("#000", 0.18)}`,
          },
        }}
      >
        Get started →
      </Button>

      <Button
        component={Link}
        href={EXPLORE_DEMO_HREF}
        variant="outlined"
        color="primary"
        size={size}
        sx={{
          fontWeight: 600,
          borderRadius: "10px",
          px: large ? 4 : 3.5,
          py: large ? 1.6 : 1.4,
          textTransform: "none",
          fontSize: large ? "1rem" : "0.9375rem",
          borderWidth: "1.5px",
          transition: "transform 0.2s ease",
          "&:hover": { transform: "translateY(-2px)", borderWidth: "1.5px" },
        }}
      >
        Explore demo
      </Button>
    </Stack>
  );
}
