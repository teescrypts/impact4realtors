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
  Button,
  Chip,
  Pagination,
  Stack,
  SvgIcon,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import BookHouseTour from "./book-house-tour";
import MortgageEstimationModal from "./calc-mortgage";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { PropertyResponseType, propertyType } from "../listings/page";
import { formatDistanceToNow } from "date-fns";
import EmptyState from "./empty-state";
import Locations from "@/app/icons/untitled-ui/duocolor/location";

// REMEMBER TO INCLUDE ADDED TWO DAYS AGO THING

function Listings({
  properties,
  totalPages,
  currentPage,
}: PropertyResponseType) {
  // Get default type ("sale" or "rent") from URL query parameter; default to "sale"
  const searchParams = useSearchParams();
  const defaultType = searchParams.get("category") || "For Sale";
  const location = searchParams.get("location");
  const adminId = searchParams.get("admin");

  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      setLoading(true);

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

      router.push(`?${queryParams.toString()}`, { scroll: false });
      setLoading(false);
    }, 1000); // Delay API call by 1s

    return () => clearTimeout(delaySearch);
  }, [type, priceRange, bedrooms, toilets, sizeRange]);

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
    setLoading(true);
    setPage(value);
    router.push(
      `?category=${type}&minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}&bedrooms=${bedrooms}&bathrooms=${toilets}&minSquareMeters=${sizeRange[0]}&maxSquareMeters=${sizeRange[1]}&location=${location}&page=${page}`,
      {
        scroll: false,
      }
    );
    setLoading(false);
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
        {properties.length > 0 ? (
          properties.map((property) => {
            // Format createdAt to display "Added X days ago"
            const timeAgo = formatDistanceToNow(new Date(property.createdAt), {
              addSuffix: true,
            });

            return (
              <Grid2 size={{ xs: 12, sm: 12, md: 4 }} key={property._id}>
                <Box
                  sx={{
                    position: "relative",
                    border: "1px solid #ccc",
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 2,
                  }}
                >
                  {/* Sold / Rented Label */}
                  {property.status !== "Active" && (
                    <Chip
                      label={property.status === "Sold" ? "SOLD" : "RENTED"}
                      color="error"
                      sx={{
                        position: "absolute",
                        top: 16,
                        left: 16,
                        fontWeight: "bold",
                        backgroundColor:
                          property.status === "Sold" ? "#d32f2f" : "#ff9800",
                        color: "#fff",
                      }}
                    />
                  )}
                  {/* Property Image */}
                  <Link
                    href={
                      adminId
                        ? `/demo/listings/${
                            type === "For Sale" ? "sale" : "rent"
                          }/${property._id}?admin=${adminId}`
                        : `/demo/listings/${
                            type === "For Sale" ? "sale" : "rent"
                          }/${property._id}`
                    }
                  >
                    <Box
                      sx={{ position: "relative", width: "100%", height: 400 }}
                    >
                      <Image
                        src={property.images[0].url}
                        alt={property.propertyTitle}
                        fill
                        style={{ objectFit: "cover", borderRadius: "8px" }}
                        sizes="100%"
                        priority
                      />
                    </Box>
                  </Link>
                  {/* Listing Date Chip - Positioned Above Title */}
                  <Box mt={2}>
                    <Chip
                      label={`Listed ${timeAgo}`}
                      sx={{
                        mb: 1, // Add margin below to separate it from the title
                      }}
                    />
                  </Box>
                  {/* Property Title */}
                  <Link
                    href={
                      adminId
                        ? `/demo/listings/${
                            type === "For Sale" ? "sale" : "rent"
                          }/${property._id}?admin=${adminId}`
                        : `/demo/listings/${
                            type === "For Sale" ? "sale" : "rent"
                          }/${property._id}`
                    }
                  >
                    <Typography variant="h6" fontWeight="bold">
                      {property.propertyTitle}
                    </Typography>
                  </Link>
                  {/* Property Location */}
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    display="flex"
                    alignItems="center"
                  >
                    <SvgIcon
                      sx={{ fontSize: 18, mr: 0.5, color: "primary.main" }}
                    >
                      <Locations />
                    </SvgIcon>
                    {property.location.cityName}, {property.location.stateName},{" "}
                    {property.location.countryName}
                  </Typography>
                  {/* Property Price */}
                  <Typography variant="body1" color="primary">
                    ${property.price.toLocaleString()}
                  </Typography>
                  {/* Property Details */}
                  <Typography variant="body2" mt={1}>
                    {property.bedrooms} Beds, {property.bathrooms} Toilets,{" "}
                    {property.squareMeters} m²
                  </Typography>
                  {/* Action Buttons */}
                  {property.status === "Active" && (
                    <Box mt={2} display="flex" justifyContent="space-between">
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenBookingModal(property)}
                      >
                        Book House Showing
                      </Button>
                      {type === "For Sale" && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          onClick={() => handleOpenMortgageModal(property)}
                        >
                          Est. Mortgages
                        </Button>
                      )}
                    </Box>
                  )}
                </Box>
              </Grid2>
            );
          })
        ) : (
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
      </Grid2>

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
