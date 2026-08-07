"use client";

import CheckCircle from "@/app/icons/untitled-ui/duocolor/checked-circle";
import {
  Box,
  Container,
  Stack,
  SvgIcon,
  Typography,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import CtaButtons from "./cta-buttons";

const reassurances = [
  "Custom built for your brand",
  "Hosting and maintenance included",
  "No per-feature upsells",
];

type Props = {
  title?: ReactNode;
  description?: string;
};

export default function BookDemoCta({ title, description }: Props) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "relative",
        bgcolor: "background.paper",
        py: { xs: 10, md: 14 },
        borderTop: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <Box
        sx={{
          position: "absolute",
          top: "-30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: { xs: 320, md: 620 },
          height: { xs: 320, md: 620 },
          bgcolor: "primary.main",
          opacity: 0.1,
          filter: "blur(120px)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          sx={{ textAlign: "center" }}
        >
          <Typography
            component="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.875rem", md: "2.5rem" },
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              color: "text.primary",
              mb: 2,
            }}
          >
            {title ?? (
              <>
                One website. Every tool.{" "}
                <Box component="span" sx={{ color: "primary.main" }}>
                  $30 a month.
                </Box>
              </>
            )}
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "1rem", md: "1.125rem" },
              color: "text.secondary",
              lineHeight: 1.75,
              maxWidth: 560,
              mx: "auto",
              mb: 4.5,
            }}
          >
            {description ??
              "Book a 30-minute demo and we'll walk you through the whole thing on a live site — then show you what your own would look like."}
          </Typography>

          <CtaButtons align="center" />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1.25, sm: 3 }}
            justifyContent="center"
            alignItems="center"
            sx={{ mt: 4 }}
          >
            {reassurances.map((item) => (
              <Stack
                key={item}
                direction="row"
                alignItems="center"
                spacing={1}
              >
                <SvgIcon sx={{ fontSize: 16, color: "success.main" }}>
                  <CheckCircle />
                </SvgIcon>
                <Typography
                  sx={{
                    fontSize: "0.8125rem",
                    color: "text.secondary",
                    fontWeight: 500,
                  }}
                >
                  {item}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Container>

      {/* Hairline accent */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
          opacity: 0.4,
        }}
      />
    </Box>
  );
}
