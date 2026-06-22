import BathTub from "@/app/icons/untitled-ui/duocolor/bath-tub";
import Locations from "@/app/icons/untitled-ui/duocolor/location";
import SquareFoot from "@/app/icons/untitled-ui/duocolor/sqr-meters";
import KingBed from "@/app/icons/untitled-ui/duocolor/king-bed";
import {
  Grid2,
  Stack,
  Chip,
  Typography,
  Button,
  Box,
  SvgIcon,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { propertyType } from "../../listings/page";
import Image from "next/image";

function PropertyCard({
  property,
  adminId,
  index = 0,
  onOpenBookingModal,
  onOpenMortageModal,
}: {
  property: propertyType;
  adminId?: string;
  index?: number;
  onOpenBookingModal: (property: propertyType) => void;
  onOpenMortageModal: (property: propertyType) => void;
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;
  const isSold = property.status !== "Active";

  const detailHref = adminId
    ? `/demo/listings/${property.category === "For Sale" ? "sale" : "rent"}/${property._id}?admin=${adminId}`
    : `/demo/listings/${property.category === "For Sale" ? "sale" : "rent"}/${property._id}`;

  const stats = [
    { icon: KingBed, value: property.bedrooms, label: "Beds" },
    { icon: BathTub, value: property.bathrooms, label: "Baths" },
    { icon: SquareFoot, value: `${property.squareMeters}m²`, label: "Area" },
  ];

  return (
    <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 0.55,
          delay: Math.min(index, 5) * 0.08,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{ height: "100%" }}
      >
        <Box
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid",
            borderColor: isDark ? alpha("#fff", 0.08) : alpha("#000", 0.07),
            bgcolor: isDark ? alpha("#fff", 0.03) : "white",
            boxShadow: isDark ? "none" : `0 2px 16px ${alpha("#000", 0.07)}`,
            transition: "transform 0.22s ease, box-shadow 0.22s ease",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: isDark
                ? `0 0 0 1px ${alpha(primary, 0.18)}`
                : `0 12px 40px ${alpha("#000", 0.12)}`,
            },
            "&:hover img": {
              transform: "scale(1.08)",
            },
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* ── Image ── */}
          <Link href={detailHref} style={{ display: "block", flexShrink: 0 }}>
            <Box
              sx={{
                position: "relative",
                height: 220,
                overflow: "hidden",
                bgcolor: "grey.100",
              }}
            >
              <Image
                src={property.images[0].url}
                alt={property.propertyTitle}
                fill
                style={{
                  objectFit: "cover",
                  transition: "transform 0.4s ease",
                }}
                sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
              />

              {/* Gradient overlay for bottom text legibility */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)",
                }}
              />

              {/* Price badge — on top of image */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 12,
                  left: 14,
                }}
              >
                <Typography
                  sx={{
                    color: "white",
                    fontWeight: 800,
                    fontSize: "1.2rem",
                    letterSpacing: "-0.02em",
                    textShadow: "0 1px 4px rgba(0,0,0,0.4)",
                  }}
                >
                  ${property.price.toLocaleString()}
                  {property.category === "For Rent" && (
                    <Box
                      component="span"
                      sx={{
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        opacity: 0.85,
                      }}
                    >
                      {" "}
                      /mo
                    </Box>
                  )}
                </Typography>
              </Box>

              {/* Status chips — top-right */}
              <Stack
                direction="row"
                spacing={0.75}
                sx={{ position: "absolute", top: 12, right: 12 }}
              >
                {isSold && (
                  <Chip
                    label={property.status === "Sold" ? "Sold" : "Rented"}
                    size="small"
                    sx={{
                      bgcolor: theme.palette.error.main,
                      color: "white",
                      fontWeight: 700,
                      fontSize: "0.68rem",
                      height: 22,
                      borderRadius: 1,
                    }}
                  />
                )}
                <Chip
                  label={property.category === "For Sale" ? "Sale" : "Rent"}
                  size="small"
                  sx={{
                    bgcolor: alpha(primary, 0.88),
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.68rem",
                    height: 22,
                    borderRadius: 1,
                    backdropFilter: "blur(4px)",
                  }}
                />
              </Stack>
            </Box>
          </Link>

          {/* ── Content ── */}
          <Box
            sx={{
              p: 2.5,
              display: "flex",
              flexDirection: "column",
              flex: 1,
              gap: 1.5,
            }}
          >
            {/* Title + listed time */}
            <Box>
              <Stack
                direction="row"
                alignItems="flex-start"
                justifyContent="space-between"
                gap={1}
              >
                <Typography
                  component={Link}
                  href={detailHref}
                  variant="subtitle1"
                  fontWeight={700}
                  letterSpacing="-0.01em"
                  lineHeight={1.3}
                  sx={{
                    color: "text.primary",
                    textDecoration: "none",
                    "&:hover": { color: "primary.main" },
                    transition: "color 0.15s ease",
                    flex: 1,
                  }}
                >
                  {property.propertyTitle}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.disabled"
                  sx={{ flexShrink: 0, mt: 0.25 }}
                  noWrap
                >
                  {formatDistanceToNow(new Date(property.createdAt), {
                    addSuffix: true,
                  })}
                </Typography>
              </Stack>

              {/* Location */}
              <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
                <SvgIcon sx={{ fontSize: 14, color: "text.disabled" }}>
                  <Locations />
                </SvgIcon>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {property.location.cityName}, {property.location.stateName},{" "}
                  {property.location.countryName}
                </Typography>
              </Stack>
            </Box>

            {/* Stats row */}
            <Stack
              direction="row"
              divider={
                <Box
                  sx={{
                    width: "1px",
                    bgcolor: "divider",
                    alignSelf: "stretch",
                  }}
                />
              }
              sx={{
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                overflow: "hidden",
              }}
            >
              {stats.map(({ icon: Icon, value, label }) => (
                <Stack
                  key={label}
                  alignItems="center"
                  justifyContent="center"
                  spacing={0.25}
                  sx={{ flex: 1, py: 1.25, px: 0.5 }}
                >
                  <SvgIcon sx={{ fontSize: 16, color: "primary.main" }}>
                    <Icon />
                  </SvgIcon>
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    lineHeight={1}
                    color="text.primary"
                  >
                    {value}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    lineHeight={1}
                    sx={{ fontSize: "0.65rem" }}
                  >
                    {label}
                  </Typography>
                </Stack>
              ))}
            </Stack>

            {/* CTAs */}
            {!isSold && (
              <Stack direction="row" spacing={1.25} mt="auto">
                <Button
                  variant="contained"
                  size="small"
                  fullWidth
                  onClick={() => onOpenBookingModal(property)}
                  sx={{
                    fontWeight: 700,
                    borderRadius: 1.5,
                    py: 0.875,
                    boxShadow: "none",
                    "&:hover": { boxShadow: "none" },
                    fontSize: "0.8rem",
                  }}
                >
                  Book Tour
                </Button>
                {property.category === "For Sale" && (
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    onClick={() => onOpenMortageModal(property)}
                    sx={{
                      fontWeight: 600,
                      borderRadius: 1.5,
                      py: 0.875,
                      fontSize: "0.8rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Mortgage Est.
                  </Button>
                )}
              </Stack>
            )}

            {isSold && (
              <Box
                sx={{
                  mt: "auto",
                  py: 1,
                  borderRadius: 1.5,
                  bgcolor: alpha(theme.palette.error.main, 0.07),
                  border: `1px solid ${alpha(theme.palette.error.main, 0.18)}`,
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color="error"
                  sx={{ letterSpacing: "0.04em", textTransform: "uppercase" }}
                >
                  {property.status === "Sold"
                    ? "This property has been sold"
                    : "This unit is rented"}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </motion.div>
    </Grid2>
  );
}

export default PropertyCard;
