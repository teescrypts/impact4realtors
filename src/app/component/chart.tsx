"use client";

import dynamic from "next/dynamic";
import { alpha } from "@mui/system/colorManipulator";
import { styled } from "@mui/material/styles";
import { ApexOptions } from "apexcharts";

const ApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => null,
});

interface ChartProps {
  options: ApexOptions;
  series: { name: string; data: string | number[] }[];
  type: string;
  height?: number | string;
  width?: string | number;
}

export const Chart = styled(ApexChart)<ChartProps>(({ theme }) => ({
  width: "100%",
  "& .apexcharts-xaxistooltip": {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[16],
    borderRadius: theme.shape.borderRadius,
    border: 0,
    "&::before, &::after": {
      display: "none",
    },
  },
  "& .apexcharts-tooltip": {
    "&.apexcharts-theme-light, &.apexcharts-theme-dark": {
      backdropFilter: "blur(6px)",
      background: "transparent",
      border: 0,
      boxShadow: "none",
      "& .apexcharts-tooltip-title": {
        background: alpha(theme.palette.neutral[900], 0.8),
        border: 0,
        color: theme.palette.common.white,
        margin: 0,
      },
      "& .apexcharts-tooltip-series-group": {
        background: alpha(theme.palette.neutral[900], 0.7),
        border: 0,
        color: theme.palette.common.white,
      },
    },
  },
}));
