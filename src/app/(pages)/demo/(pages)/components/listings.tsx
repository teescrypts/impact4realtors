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
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import BookHouseTour from "./book-house-tour";
import MortgageEstimationModal, { Listing } from "./calc-mortgage";
import Image from "next/image";
import Link from "next/link";

const dummyListings: Listing[] = [
  {
    id: 1,
    title: "Luxury Apartment in LA",
    type: "sale",
    price: 850000,
    bedrooms: 3,
    toilets: 2,
    size: 150,
    image: "/images/luxury_apartment.jpeg",
    status: "sold",
    // Agent provided values for mortgage estimation:
    hoa: 200,
    localTaxRate: 1.25,
    agentInsurance: 1200,
    agentMortgageRate: 3.5,
    agentLoanTerm: 30,
  },
  {
    id: 2,
    title: "Modern Loft in NY",
    type: "rent",
    price: 2500,
    bedrooms: 2,
    toilets: 1,
    size: 100,
    image: "/images/modern_loft.jpeg",
    status: "available",
    hoa: 150,
    localTaxRate: 1.5,
    agentInsurance: 1000,
    agentMortgageRate: 3.8,
    agentLoanTerm: 30,
  },
  {
    id: 3,
    title: "Beachfront Villa in Miami",
    type: "sale",
    price: 1200000,
    bedrooms: 4,
    toilets: 3,
    size: 250,
    image: "/images/beachfront_villa.jpeg",
    status: "available",
    hoa: 250,
    localTaxRate: 1.2,
    agentInsurance: 1400,
    agentMortgageRate: 3.6,
    agentLoanTerm: 30,
  },
  {
    id: 4,
    title: "Downtown Condo in SF",
    type: "rent",
    price: 1800,
    bedrooms: 1,
    toilets: 1,
    size: 80,
    image: "/images/downtown_condo.jpeg",
    status: "rented",
    hoa: 180,
    localTaxRate: 1.8,
    agentInsurance: 1100,
    agentMortgageRate: 4.0,
    agentLoanTerm: 30,
  },
  {
    id: 5,
    title: "Suburban House in Austin",
    type: "sale",
    price: 650000,
    bedrooms: 3,
    toilets: 2,
    size: 180,
    image: "/images/suburban_house.jpeg",
    status: "available",
    hoa: 200,
    localTaxRate: 1.3,
    agentInsurance: 1300,
    agentMortgageRate: 3.7,
    agentLoanTerm: 30,
  },
  {
    id: 6,
    title: "Penthouse Suite in Chicago",
    type: "rent",
    price: 3200,
    bedrooms: 2,
    toilets: 2,
    size: 120,
    image: "/images/penthouse_suite.jpeg",
    status: "rented",
    hoa: 220,
    localTaxRate: 1.6,
    agentInsurance: 1500,
    agentMortgageRate: 4.2,
    agentLoanTerm: 30,
  },
  // More dummy listings for pagination
  {
    id: 7,
    title: "Cozy Cottage",
    type: "sale",
    price: 450000,
    bedrooms: 2,
    toilets: 1,
    size: 110,
    image: "/images/beachfront_villa.jpeg",
    status: "available",
    hoa: 180,
    localTaxRate: 1.4,
    agentInsurance: 1250,
    agentMortgageRate: 3.9,
    agentLoanTerm: 30,
  },
  {
    id: 8,
    title: "Urban Studio",
    type: "rent",
    price: 1500,
    bedrooms: 1,
    toilets: 1,
    size: 60,
    image: "/images/beachfront_villa.jpeg",
    status: "available",
    hoa: 160,
    localTaxRate: 1.7,
    agentInsurance: 1050,
    agentMortgageRate: 4.1,
    agentLoanTerm: 30,
  },
  {
    id: 9,
    title: "Country Home",
    type: "sale",
    price: 700000,
    bedrooms: 4,
    toilets: 3,
    size: 220,
    image: "/images/beachfront_villa.jpeg",
    status: "available",
    hoa: 230,
    localTaxRate: 1.5,
    agentInsurance: 1350,
    agentMortgageRate: 3.8,
    agentLoanTerm: 30,
  },
  {
    id: 10,
    title: "Modern Villa",
    type: "sale",
    price: 950000,
    bedrooms: 4,
    toilets: 3,
    size: 260,
    image: "/images/beachfront_villa.jpeg",
    status: "available",
    hoa: 240,
    localTaxRate: 1.4,
    agentInsurance: 1450,
    agentMortgageRate: 3.7,
    agentLoanTerm: 30,
  },
];

// REMEMBER TO INCLUDE ADDED TWO DAYS AGO THING

function Listings() {
  // Get default type ("sale" or "rent") from URL query parameter; default to "sale"
  const searchParams = useSearchParams();
  const defaultType = searchParams.get("type") || "sale";

  const [type, setType] = useState<string>(defaultType);
  const [priceRange, setPriceRange] = useState<number[]>([0, 2000000]);
  const [bedrooms, setBedrooms] = useState<string>("");
  const [toilets, setToilets] = useState<string>("");
  const [sizeRange, setSizeRange] = useState<number[]>([0, 500]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openMortgageModal, setOpenMortgageModal] = useState<boolean>(false);
  const [selectedListing, setSelectedListing] = useState<null | Listing>(null);
  const [openBookingModal, setOpenBookingModal] = useState<boolean>(false);
  const itemsPerPage = 9;

  // Filter the listings based on selected criteria
  const filteredListings = dummyListings.filter((listing) => {
    if (listing.type !== type) return false;
    if (listing.price < priceRange[0] || listing.price > priceRange[1])
      return false;
    if (bedrooms && listing.bedrooms !== Number(bedrooms)) return false;
    if (toilets && listing.toilets !== Number(toilets)) return false;
    if (listing.size < sizeRange[0] || listing.size > sizeRange[1])
      return false;
    return true;
  });

  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handler for opening the mortgage estimation modal
  const handleOpenMortgageModal = (listing: Listing) => {
    setSelectedListing(listing);
    setOpenMortgageModal(true);
  };

  const handleOpenBookingModal = (listing: Listing) => {
    setSelectedListing(listing);
    setOpenBookingModal(true);
  };

  return (
    <Container sx={{ mt: 6, mb: 6 }}>
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
                <MenuItem value="sale">For Sale</MenuItem>
                <MenuItem value="rent">For Rent</MenuItem>
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
              max={500}
              step={10}
            />
          </Grid2>
        </Grid2>
        <Box textAlign="center" mt={2}>
          <Button variant="contained" color="primary">
            Apply Filters
          </Button>
        </Box>
      </Paper>

      {/* Listings Grid */}
      <Grid2 container spacing={3}>
        {paginatedListings.map((listing) => (
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={listing.id}>
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
              {listing.status !== "available" && (
                <Chip
                  label={listing.status === "sold" ? "SOLD" : "RENTED"}
                  color="error"
                  sx={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    fontWeight: "bold",
                    m: 2,
                    backgroundColor:
                      listing.status === "sold" ? "#d32f2f" : "#ff9800",
                    color: "#fff",
                  }}
                />
              )}
              <Link href={`/demo/listings/${type}/${listing.title}`}>
                <Box sx={{ position: "relative", width: "100%", height: 300 }}>
                  <Image
                    src={listing.image}
                    alt={listing.title}
                    fill
                    style={{ objectFit: "cover", borderRadius: "8px" }}
                  />
                </Box>
              </Link>

              <Link href={`/demo/listings/${listing.title}`}>
                <Typography variant="h6" fontWeight="bold" mt={2}>
                  {listing.title}
                </Typography>
              </Link>

              <Typography variant="body1" color="primary">
                ${listing.price.toLocaleString()}
              </Typography>
              <Typography variant="body2" mt={1}>
                {listing.bedrooms} Beds, {listing.toilets} Toilets,{" "}
                {listing.size} m²
              </Typography>
              {/* Action Buttons */}
              {listing.status === "available" && (
                <Box mt={2} display="flex" justifyContent="space-between">
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenBookingModal(listing)}
                  >
                    Book House Showing
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    onClick={() => handleOpenMortgageModal(listing)}
                  >
                    Est. Mortgages
                  </Button>
                </Box>
              )}
            </Box>
          </Grid2>
        ))}
      </Grid2>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" my={4}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_, value) => setCurrentPage(value)}
          color="primary"
        />
      </Box>

      {/* Mortgage Estimation Modal */}
      {selectedListing && (
        <MortgageEstimationModal
          open={openMortgageModal}
          onClose={() => setOpenMortgageModal(false)}
          listing={selectedListing}
        />
      )}

      {selectedListing && (
        <BookHouseTour
          open={openBookingModal}
          onClose={() => setOpenBookingModal(false)}
          houseDetails={{
            name: selectedListing.name!,
            location: selectedListing.location!,
            price: selectedListing.price,
          }}
        />
      )}
    </Container>
  );
}

export default Listings;
