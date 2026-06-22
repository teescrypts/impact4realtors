"use client";

import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Stack,
  Chip,
  SvgIcon,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import KingBed from "@/app/icons/untitled-ui/duocolor/king-bed";
import BathTub from "@/app/icons/untitled-ui/duocolor/bath-tub";
import SquareFoot from "@/app/icons/untitled-ui/duocolor/sqr-meters";
import Locations from "@/app/icons/untitled-ui/duocolor/location";
import { propertyType } from "../listings/page";

/**
 * Featured Listing Spotlight
 * -----------------------------------------------------------------
 * Deliberately breaks the "centered header + card grid" rhythm that
 * every other section on the page follows. Full-bleed image on one
 * side, large editorial type and a single strong CTA on the other.
 * Drop this in between two grid-based sections (e.g. between
 * Recent Listings and Testimonials) so the page doesn't scroll like
 * a spec sheet from top to bottom.
 */
const FeaturedSpotlight = ({
  property,
  adminId,
}: {
  property: propertyType;
  adminId?: string;
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;

  const detailHref = adminId
    ? `/demo/listings/${property.category === "For Sale" ? "sale" : "rent"}/${property._id}?admin=${adminId}`
    : `/demo/listings/${property.category === "For Sale" ? "sale" : "rent"}/${property._id}`;

  const stats = [
    { icon: KingBed, value: property.bedrooms, label: "Beds" },
    { icon: BathTub, value: property.bathrooms, label: "Baths" },
    { icon: SquareFoot, value: `${property.squareMeters}m²`, label: "Area" },
  ];

  return (
    <Box
      component="section"
      sx={{ bgcolor: isDark ? "grey.950" : "background.default" }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 0 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" },
            alignItems: "stretch",
            borderRadius: { xs: 4, md: 5 },
            overflow: "hidden",
            bgcolor: isDark ? alpha("#fff", 0.03) : "common.white",
            border: "1px solid",
            borderColor: isDark ? alpha("#fff", 0.08) : alpha("#000", 0.06),
          }}
        >
          {/* ── Image side ── */}
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "relative",
              minHeight: 360,
            }}
          >
            <Box sx={{ position: "relative", height: "100%", minHeight: 360 }}>
              <Image
                src={property.images[0].url}
                alt={property.propertyTitle}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 900px) 100vw, 50vw"
              />
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background: {
                    xs: `linear-gradient(180deg, transparent 50%, ${alpha("#000", 0.45)} 100%)`,
                    md: `linear-gradient(90deg, transparent 70%, ${alpha(isDark ? "#000" : "#fff", isDark ? 0.25 : 0.06)} 100%)`,
                  },
                }}
              />
              <Chip
                label="Featured"
                size="small"
                sx={{
                  position: "absolute",
                  top: 20,
                  left: 20,
                  bgcolor: alpha(primary, 0.92),
                  color: "primary.contrastText",
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  height: 26,
                }}
              />
            </Box>
          </motion.div>

          {/* ── Copy side ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.7,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Stack
              spacing={3}
              sx={{
                p: { xs: 4, sm: 6, md: 7 },
                height: "100%",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="overline"
                sx={{ color: "primary.main", fontWeight: 700 }}
              >
                Property of the Week
              </Typography>

              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "2.85rem" },
                  lineHeight: 1.1,
                }}
              >
                {property.propertyTitle}
              </Typography>

              <Stack direction="row" spacing={0.75} alignItems="center">
                <SvgIcon sx={{ fontSize: 18, color: "text.disabled" }}>
                  <Locations />
                </SvgIcon>
                <Typography variant="body2" color="text.secondary">
                  {property.location.cityName}, {property.location.stateName},{" "}
                  {property.location.countryName}
                </Typography>
              </Stack>

              <Typography
                variant="h4"
                fontWeight={800}
                sx={{ fontFamily: "inherit" }}
              >
                ${property.price.toLocaleString()}
                {property.category === "For Rent" && (
                  <Box
                    component="span"
                    sx={{ fontSize: "1rem", fontWeight: 500, opacity: 0.7 }}
                  >
                    {" "}
                    /mo
                  </Box>
                )}
              </Typography>

              <Stack direction="row" spacing={3}>
                {stats.map(({ icon: Icon, value, label }) => (
                  <Stack
                    key={label}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <SvgIcon sx={{ fontSize: 20, color: "primary.main" }}>
                      <Icon />
                    </SvgIcon>
                    <Typography variant="body2" fontWeight={600}>
                      {value} {label}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              <Box pt={1}>
                <Button
                  component={Link}
                  href={detailHref}
                  variant="contained"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontWeight: 700,
                    borderRadius: 2,
                    boxShadow: `0 8px 24px ${alpha(primary, 0.3)}`,
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0 12px 32px ${alpha(primary, 0.4)}`,
                    },
                    transition: "all 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  View Property →
                </Button>
              </Box>
            </Stack>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturedSpotlight;
