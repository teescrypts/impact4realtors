"use client";

import {
  Container,
  Typography,
  Paper,
  Grid2,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Box,
  Pagination,
  Stack,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import BookHouseTour from "./book-house-tour";
import MortgageEstimationModal from "./calc-mortgage";
import { useRouter } from "nextjs-toploader/app";
import { PropertyResponseType, propertyType } from "../listings/page";
import EmptyState from "./empty-state";
import PropertyCard from "./sections/property-card";

function Listings({
  properties,
  totalPages,
  currentPage,
}: PropertyResponseType) {
  // Get default type ("sale" or "rent") from URL query parameter; default to "sale"
  const searchParams = useSearchParams();
  const defaultType = searchParams.get("category") || "For Sale";
  const location = searchParams.get("location");
  const adminId = searchParams.get("admin") as string | undefined;
  const [type, setType] = useState<string>(defaultType);
  const [priceRange, setPriceRange] = useState<number[]>([0, 2000000]);
  const [bedrooms, setBedrooms] = useState<string>("");
  const [toilets, setToilets] = useState<string>("");
  const [sizeRange, setSizeRange] = useState<number[]>([0, 1000]);
  const [openMortgageModal, setOpenMortgageModal] = useState<boolean>(false);
  const [selectedListing, setSelectedListing] = useState<null | propertyType>(
    null
  );
  const [openBookingModal, setOpenBookingModal] = useState<boolean>(false);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const router = useRouter();
  const prevUrl = useRef(""); // Stores the last pushed URL

  const pushWithQueryParams = useCallback(() => {
    const queryParams = new URLSearchParams();

    if (adminId) queryParams.set("admin", adminId);
    if (type) queryParams.set("category", type);
    if (priceRange[0] > 0) queryParams.set("minPrice", String(priceRange[0]));
    if (priceRange[1] < 2000000)
      queryParams.set("maxPrice", String(priceRange[1]));
    if (bedrooms) queryParams.set("bedrooms", bedrooms);
    if (toilets) queryParams.set("bathrooms", toilets);
    if (sizeRange[0] > 0)
      queryParams.set("minSquareMeters", String(sizeRange[0]));
    if (sizeRange[1] < 1000)
      queryParams.set("maxSquareMeters", String(sizeRange[1]));
    if (location) queryParams.set("location", location);
    if (page !== 1) queryParams.set("page", String(page));

    const newUrl = `?${queryParams.toString()}`;

    // ✅ Prevent unnecessary `router.push` calls
    if (prevUrl.current !== newUrl) {
      prevUrl.current = newUrl;
      router.push(newUrl, { scroll: false });
    }
  }, [
    adminId,
    type,
    priceRange,
    bedrooms,
    toilets,
    sizeRange,
    location,
    page,
    router,
  ]);

  useEffect(() => {
    const delaySearch = setTimeout(pushWithQueryParams, 1000);
    return () => clearTimeout(delaySearch);
  }, [pushWithQueryParams]);

  const handleOpenMortgageModal = (property: propertyType) => {
    setSelectedListing(property);
    setOpenMortgageModal(true);
  };

  const handleOpenBookingModal = (property: propertyType) => {
    setSelectedListing(property);
    setOpenBookingModal(true);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    router.push(
      `?category=${type}&minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}&bedrooms=${bedrooms}&bathrooms=${toilets}&minSquareMeters=${sizeRange[0]}&maxSquareMeters=${sizeRange[1]}&location=${location}&page=${page}`,
      {
        scroll: false,
      }
    );
  };

  return (
    <Container maxWidth={"xl"}>
      <Typography variant="h4" gutterBottom align="center">
        Property Listings
      </Typography>
      {/* Filter Panel */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid2 container spacing={2}>
          {/* Property Type */}
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={type}
                label="Type"
                onChange={(e) => setType(e.target.value)}
              >
                <MenuItem value="For Sale">For Sale</MenuItem>
                <MenuItem value="For Rent">For Rent</MenuItem>
              </Select>
            </FormControl>
          </Grid2>

          {/* Price Range */}
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography gutterBottom>Price Range ($)</Typography>
            <Slider
              value={priceRange}
              onChange={(e, newValue) => setPriceRange(newValue as number[])}
              valueLabelDisplay="auto"
              min={0}
              max={2000000}
              step={50000}
            />
          </Grid2>

          {/* Bedrooms */}
          <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Bedrooms</InputLabel>
              <Select
                value={bedrooms}
                label="Bedrooms"
                onChange={(e) => setBedrooms(e.target.value)}
              >
                <MenuItem value="">Any</MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4+</MenuItem>
              </Select>
            </FormControl>
          </Grid2>

          {/* Toilets */}
          <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Toilets</InputLabel>
              <Select
                value={toilets}
                label="Toilets"
                onChange={(e) => setToilets(e.target.value)}
              >
                <MenuItem value="">Any</MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3+</MenuItem>
              </Select>
            </FormControl>
          </Grid2>

          {/* Size Range */}
          <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography gutterBottom>Size Range (m²)</Typography>
            <Slider
              value={sizeRange}
              onChange={(e, newValue) => setSizeRange(newValue as number[])}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
              step={10}
            />
          </Grid2>
        </Grid2>
      </Paper>
      {/* Listings Grid */}
      <Grid2 container spacing={3}>
        {properties.length > 0 &&
          properties.map((property) => {
            return (
              <PropertyCard
                key={property._id}
                adminId={adminId}
                property={property}
                onOpenBookingModal={handleOpenBookingModal}
                onOpenMortageModal={handleOpenMortgageModal}
              />
            );
          })}
      </Grid2>

      {properties.length === 0 && (
        <Stack
          direction={"column"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <EmptyState
            title="No property found"
            description="Kindly check back later"
          />
        </Stack>
      )}

      <Box display="flex" justifyContent="center" my={4}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
      {/* Mortgage Estimation Modal */}
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
          houseTouringType={type}
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
    </Container>
  );
}

export default Listings;
