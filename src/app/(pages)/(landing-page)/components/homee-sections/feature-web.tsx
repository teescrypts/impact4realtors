"use client";

import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import Link from "next/link";
import { features } from "../features/feature-data";
import { MONTHLY_PRICE } from "../pricing/pricing-data";

/** Distance of each node from the hub, in the 0–100 coordinate space. */
const RADIUS = 37;

/** Six nodes, evenly spaced, first one straight up. */
const nodes = features.map((feature, index) => {
  const angle = ((-90 + index * 60) * Math.PI) / 180;
  return {
    ...feature,
    x: 50 + RADIUS * Math.cos(angle),
    y: 50 + RADIUS * Math.sin(angle),
  };
});

function Hub() {
  const theme = useTheme();

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        px: 3,
        py: 2.5,
        borderRadius: "20px",
        border: "1.5px solid",
        borderColor: "primary.main",
        bgcolor: "background.paper",
        boxShadow: `0 12px 48px ${alpha(theme.palette.primary.main, 0.25)}`,
        textAlign: "center",
        minWidth: 190,
      }}
    >
      <Typography
        sx={{
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "text.disabled",
          mb: 0.5,
        }}
      >
        RealtyIllustrations
      </Typography>
      <Stack direction="row" alignItems="baseline" spacing={0.5}>
        <Typography
          sx={{
            fontSize: "2.25rem",
            fontWeight: 800,
            color: "primary.main",
            lineHeight: 1,
            letterSpacing: "-0.03em",
          }}
        >
          {MONTHLY_PRICE}
        </Typography>
        <Typography
          sx={{ fontSize: "0.875rem", fontWeight: 600, color: "text.secondary" }}
        >
          /month
        </Typography>
      </Stack>
      <Typography
        sx={{ fontSize: "0.75rem", color: "text.secondary", mt: 0.75 }}
      >
        One site. One login.
      </Typography>
    </Stack>
  );
}

export default function FeatureWeb() {
  const theme = useTheme();
  const line = alpha(theme.palette.primary.main, 0.45);

  return (
    <Box
      sx={{
        position: "relative",
        bgcolor: "background.default",
        py: { xs: 10, md: 14 },
        borderTop: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow behind the web */}
      <Box
        sx={{
          position: "absolute",
          top: "45%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: 320, md: 560 },
          height: { xs: 320, md: 560 },
          bgcolor: "primary.main",
          opacity: 0.08,
          filter: "blur(120px)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ maxWidth: 680, mx: "auto", textAlign: "center", mb: { xs: 6, md: 8 } }}>
          <Typography
            component="span"
            sx={{
              display: "inline-block",
              mb: 2,
              px: 1.5,
              py: 0.5,
              borderRadius: "6px",
              bgcolor: theme.palette.primary.alpha12,
              color: "primary.main",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Everything connected
          </Typography>

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
            Six tools, one bill, wired together
          </Typography>

          <Typography
            sx={{
              fontSize: "1.0625rem",
              color: "text.secondary",
              lineHeight: 1.7,
            }}
          >
            Each of these would normally be its own subscription and its own
            login. Here they all run off the same site — so a booked tour knows
            which lead booked it, and a downloaded guide starts a follow-up on
            its own.
          </Typography>
        </Box>

        {/* ── Desktop: radial web ── */}
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            position: "relative",
            width: "100%",
            maxWidth: 780,
            mx: "auto",
            aspectRatio: "1 / 1",
          }}
        >
          {/* Connector lines */}
          <Box
            component="svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              "@keyframes dashFlow": {
                to: { strokeDashoffset: -14 },
              },
            }}
          >
            {/* Orbit ring */}
            <circle
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              stroke={alpha(theme.palette.primary.main, 0.15)}
              strokeWidth={1}
              strokeDasharray="2 4"
              vectorEffect="non-scaling-stroke"
            />

            {/* Spokes */}
            {nodes.map((node, index) => (
              <Box
                component="line"
                key={node.slug}
                x1="50"
                y1="50"
                x2={node.x}
                y2={node.y}
                stroke={line}
                strokeWidth={1.5}
                strokeDasharray="4 3"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                sx={{
                  animation: "dashFlow 1.4s linear infinite",
                  animationDelay: `${index * 0.12}s`,
                }}
              />
            ))}
          </Box>

          {/* Hub */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 2,
            }}
          >
            <Hub />
          </Box>

          {/* Feature nodes */}
          {nodes.map((node, index) => (
            <Box
              key={node.slug}
              component={motion.div}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.5,
                delay: 0.2 + index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              sx={{
                position: "absolute",
                top: `${node.y}%`,
                left: `${node.x}%`,
                transform: "translate(-50%, -50%)",
                zIndex: 1,
              }}
            >
              <Stack
                component={Link}
                href={`/features/${node.slug}`}
                alignItems="center"
                spacing={1}
                sx={{
                  width: 168,
                  px: 2,
                  py: 2,
                  borderRadius: "16px",
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                  textDecoration: "none",
                  textAlign: "center",
                  transition:
                    "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    borderColor: "primary.main",
                    boxShadow: `0 14px 36px ${alpha("#000", 0.12)}`,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: theme.palette.primary.alpha12,
                  }}
                >
                  <SvgIcon sx={{ fontSize: 20, color: "primary.main" }}>
                    {node.icon}
                  </SvgIcon>
                </Box>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    color: "text.primary",
                    lineHeight: 1.3,
                  }}
                >
                  {node.shortTitle}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.7rem",
                    color: "text.disabled",
                    textDecoration: "line-through",
                    lineHeight: 1.4,
                  }}
                >
                  {node.replaces[0]}
                </Typography>
              </Stack>
            </Box>
          ))}
        </Box>

        {/* ── Mobile: hub above a grid ── */}
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
            <Hub />
          </Box>

          {/* Connector stem */}
          <Box
            sx={{
              width: "2px",
              height: 28,
              mx: "auto",
              backgroundImage: `linear-gradient(to bottom, ${line} 55%, transparent 55%)`,
              backgroundSize: "2px 8px",
            }}
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 1.5,
            }}
          >
            {nodes.map((node, index) => (
              <Stack
                key={node.slug}
                component={motion.div}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                sx={{ height: "100%" }}
              >
                <Stack
                  component={Link}
                  href={`/features/${node.slug}`}
                  direction="row"
                  alignItems="center"
                  spacing={1.75}
                  sx={{
                    height: "100%",
                    px: 2,
                    py: 1.75,
                    borderRadius: "12px",
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    textDecoration: "none",
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "10px",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: theme.palette.primary.alpha12,
                    }}
                  >
                    <SvgIcon sx={{ fontSize: 18, color: "primary.main" }}>
                      {node.icon}
                    </SvgIcon>
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        color: "text.primary",
                        lineHeight: 1.3,
                      }}
                    >
                      {node.shortTitle}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.7rem",
                        color: "text.disabled",
                        textDecoration: "line-through",
                      }}
                    >
                      {node.replaces[0]}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            ))}
          </Box>
        </Box>

        {/* Footer CTA */}
        <Stack alignItems="center" sx={{ mt: { xs: 6, md: 5 } }}>
          <Button
            component={Link}
            href="/features"
            variant="outlined"
            color="primary"
            size="large"
            sx={{
              fontWeight: 600,
              borderRadius: "10px",
              px: 4,
              py: 1.5,
              textTransform: "none",
              fontSize: "0.9375rem",
              borderWidth: "1.5px",
              "&:hover": { borderWidth: "1.5px" },
            }}
          >
            Explore every feature →
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
