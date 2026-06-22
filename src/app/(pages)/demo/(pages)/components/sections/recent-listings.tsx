"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Grid2,
  Container,
  Stack,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useRouter } from "nextjs-toploader/app";
import EmptyState from "../empty-state";
import { propertyType } from "../../listings/page";
import BookHouseTour from "../book-house-tour";
import MortgageEstimationModal from "../calc-mortgage";
import PropertyCard from "./property-card";
import ScrollReveal from "@/app/component/scroll-reveal";

const ListingsSection = ({
  adminId,
  forSale,
  forRent,
}: {
  adminId: string | undefined;
  forSale: propertyType[];
  forRent: propertyType[];
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [filter, setFilter] = useState<"For Sale" | "For Rent">("For Sale");
  const router = useRouter();

  const [openMortgageModal, setOpenMortgageModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState<null | propertyType>(
    null,
  );
  const [openBookingModal, setOpenBookingModal] = useState(false);

  const filteredListings = [...forSale, ...forRent].filter(
    (l) => l.category === filter,
  );

  const buildHref = (category: string) =>
    adminId
      ? `/demo/listings?category=${category}&admin=${adminId}`
      : `/demo/listings?category=${category}`;

  const primary = theme.palette.primary.main;

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: isDark ? "grey.950" : "grey.50",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle background orb */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: "-20%",
          right: "-8%",
          width: { xs: 280, md: 500 },
          height: { xs: 280, md: 500 },
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(primary, 0.07)} 0%, transparent 70%)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Stack spacing={6}>
          {/* ── Header ── */}
          <ScrollReveal direction="up">
            <Stack alignItems="center" spacing={2} textAlign="center">
              <Chip
                label={`${forSale.length + forRent.length} Properties Available`}
                size="small"
                sx={{
                  bgcolor: alpha(primary, 0.08),
                  color: "primary.main",
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  border: `1px solid ${alpha(primary, 0.18)}`,
                  borderRadius: 1,
                  height: 26,
                }}
              />

              <Box>
                <Typography
                  variant="h3"
                  fontWeight={900}
                  letterSpacing="-0.03em"
                  lineHeight={1.1}
                  sx={{
                    fontSize: { xs: "1.85rem", sm: "2.4rem", md: "2.9rem" },
                  }}
                >
                  Explore our latest
                  <Box component="span" sx={{ color: "primary.main" }}>
                    {" "}
                    listings
                  </Box>
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mt: 1.5, maxWidth: 520, mx: "auto", lineHeight: 1.7 }}
                >
                  Whether you&apos;re looking to buy or rent, discover top-rated
                  properties curated just for you.
                </Typography>
              </Box>

              {/* ── Filter toggle ── */}
              <ToggleButtonGroup
                value={filter}
                exclusive
                onChange={(_, val) => val && setFilter(val)}
                sx={{
                  mt: 1,
                  bgcolor: isDark ? alpha("#fff", 0.05) : alpha("#000", 0.04),
                  borderRadius: 2,
                  p: 0.5,
                  gap: 0.5,
                  border: "none",
                  "& .MuiToggleButtonGroup-grouped": {
                    border: "none !important",
                    borderRadius: "10px !important",
                  },
                }}
              >
                {(["For Sale", "For Rent"] as const).map((val) => (
                  <ToggleButton
                    key={val}
                    value={val}
                    disableRipple={false}
                    sx={{
                      px: 3.5,
                      py: 1,
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      textTransform: "none",
                      color: "text.secondary",
                      transition: "all 0.2s ease",
                      "&.Mui-selected": {
                        bgcolor:
                          filter === val ? "primary.main" : "transparent",
                        color: "white",
                        boxShadow: `0 4px 14px ${alpha(primary, 0.3)}`,
                        "&:hover": { bgcolor: "primary.dark" },
                      },
                      "&:hover": {
                        bgcolor: isDark
                          ? alpha("#fff", 0.07)
                          : alpha("#000", 0.05),
                      },
                    }}
                  >
                    {val}
                    <Box
                      component="span"
                      sx={{
                        ml: 1,
                        px: 0.9,
                        py: 0.1,
                        borderRadius: 1,
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        bgcolor:
                          filter === val
                            ? alpha("#fff", 0.25)
                            : isDark
                              ? alpha("#fff", 0.1)
                              : alpha("#000", 0.08),
                        color: filter === val ? "white" : "text.secondary",
                        lineHeight: 1.8,
                        transition: "all 0.2s ease",
                      }}
                    >
                      {val === "For Sale" ? forSale.length : forRent.length}
                    </Box>
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Stack>
          </ScrollReveal>

          {/* ── Listings Grid ── */}
          {filteredListings.length > 0 ? (
            <Grid2 container spacing={3}>
              {filteredListings.map((property, index) => (
                <PropertyCard
                  key={property._id}
                  index={index}
                  adminId={adminId}
                  property={property}
                  onOpenBookingModal={(p) => {
                    setSelectedListing(p);
                    setOpenBookingModal(true);
                  }}
                  onOpenMortageModal={(p) => {
                    setSelectedListing(p);
                    setOpenMortgageModal(true);
                  }}
                />
              ))}
            </Grid2>
          ) : (
            <Stack alignItems="center" justifyContent="center" py={6}>
              <EmptyState
                title="No Properties Found"
                description={`No properties are available ${filter.toLowerCase()} at the moment. Please check back later.`}
              />
            </Stack>
          )}

          {/* ── Browse More CTA ── */}
          {((filter === "For Rent" && forRent.length > 0) ||
            (filter === "For Sale" && forSale.length > 0)) && (
            <Stack alignItems="center" spacing={1}>
              <Button
                variant="contained"
                size="large"
                onClick={() =>
                  router.push(
                    buildHref(filter === "For Rent" ? "For Rent" : "For Sale"),
                  )
                }
                sx={{
                  px: 5,
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  borderRadius: 2,
                  boxShadow: `0 6px 20px ${alpha(primary, 0.28)}`,
                  "&:hover": {
                    boxShadow: `0 8px 28px ${alpha(primary, 0.38)}`,
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                {filter === "For Rent"
                  ? "Browse All Rentals →"
                  : "Browse All Homes for Sale →"}
              </Button>
              <Typography variant="caption" color="text.disabled">
                View the full catalogue with filters & map view
              </Typography>
            </Stack>
          )}
        </Stack>
      </Container>

      {/* Modals */}
      {selectedListing && (
        <MortgageEstimationModal
          adminId={adminId as string}
          open={openMortgageModal}
          onClose={() => setOpenMortgageModal(false)}
          listing={selectedListing}
        />
      )}

      {selectedListing && (
        <BookHouseTour
          houseTouringType={selectedListing.category}
          open={openBookingModal}
          onClose={() => setOpenBookingModal(false)}
          houseDetails={{
            id: selectedListing._id,
            name: selectedListing.propertyTitle!,
            location: `${selectedListing.location.cityName}, ${selectedListing.location.stateName}, ${selectedListing.location.countryName}`,
            price: selectedListing.price,
          }}
          adminId={adminId as string}
        />
      )}
    </Box>
  );
};

export default ListingsSection;
