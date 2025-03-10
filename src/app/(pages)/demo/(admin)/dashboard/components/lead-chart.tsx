"use client";

import { Chart } from "@/app/component/chart";
import {
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import React, { useEffect, useState } from "react";

type RangeOption = 7 | 14 | 30;

const useChartOptions = (xAxis: string[]) => {
  const theme = useTheme();

  return {
    chart: {
      background: "transparent",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: [theme.palette.primary.main],
    dataLabels: { enabled: false },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.4,
        opacityFrom: 0.9,
        opacityTo: 0.3,
        stops: [0, 90, 100],
      },
    },
    grid: { show: true },
    stroke: { curve: "smooth" as const, width: 2 },
    tooltip: {
      enabled: true,
      theme: "dark",
      y: {
        formatter: (val: number) => `${val} Leads`,
      },
    },
    xaxis: {
      categories: xAxis,
      labels: {
        rotate: -45, // Tilt labels for better readability
        style: { fontSize: "12px" },
      },
    },
    yaxis: {
      show: true,
      labels: {
        formatter: (val: number) => val.toFixed(0), // No decimals
      },
    },
  };
};

function LeadChart({
  leadData,
}: {
  leadData: { labels: string[]; values: number[] };
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const range = searchParams.get("days");
  const [selectedRange, setSelectedRange] = useState<RangeOption>();
  const chartOptions = useChartOptions(leadData.labels);

  useEffect(() => {
    setSelectedRange(Number(range) as RangeOption);
  }, [range]);

  return (
    <Card sx={{ my: 4 }}>
      <CardContent>
        <Stack spacing={2}>
          <Stack sx={{ px: 2 }} direction="row" justifyContent="space-between">
            <Typography variant="h5">Leads</Typography>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel id="range-label-id">Range</InputLabel>
              <Select
                labelId="range-label-id"
                id="range-label-select-id"
                value={selectedRange ? selectedRange : 7}
                label="Range"
                onChange={(e) => {
                  router.push(
                    `/demo/dashboard/home?days=${e.target.value as RangeOption}`
                  );
                  //   setSelectedRange(e.target.value as RangeOption)
                }}
              >
                <MenuItem value={7}>7 Days Ago</MenuItem>
                <MenuItem value={14}>14 Days Ago</MenuItem>
                <MenuItem value={30}>30 Days Ago</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Chart
            height={400}
            width="100%"
            options={chartOptions}
            series={[{ name: "Leads", data: leadData.values }]}
            type="area"
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

export default LeadChart;
