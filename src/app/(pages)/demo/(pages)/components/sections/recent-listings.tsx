"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid2,
  Tabs,
  Tab,
  Container,
  Stack,
  SvgIcon,
  Chip,
} from "@mui/material";
import { useRouter } from "next/navigation";
import SquareFoot from "@/app/icons/untitled-ui/duocolor/sqr-meters";
import BathTub from "@/app/icons/untitled-ui/duocolor/bath-tub";
import KingBed from "@/app/icons/untitled-ui/duocolor/king-bed";
import Locations from "@/app/icons/untitled-ui/duocolor/location";

const listings = [
  {
    id: 1,
    title: "Luxury Apartment",
    type: "sale",
    price: "$850,000",
    image: "/images/luxury_apartment.jpeg",
    beds: 3,
    baths: 2,
    size: 150,
    location: "Los Angeles, CA",
    status: "sold",
  },
  {
    id: 2,
    title: "Modern Loft",
    type: "rent",
    price: "$2,500/mo",
    image: "/images/modern_loft.jpeg",
    beds: 2,
    baths: 1,
    size: 100,
    location: "New York, NY",
    status: "available",
  },
  {
    id: 3,
    title: "Beachfront Villa",
    type: "sale",
    price: "$1,200,000",
    image: "/images/beachfront_villa.jpeg",
    beds: 4,
    baths: 3,
    size: 250,
    location: "Miami, FL",
    status: "available",
  },
  {
    id: 4,
    title: "Downtown Condo",
    type: "rent",
    price: "$1,800/mo",
    image: "/images/downtown_condo.jpeg",
    beds: 1,
    baths: 1,
    size: 80,
    location: "San Francisco, CA",
    status: "rented",
  },
  {
    id: 5,
    title: "Suburban House",
    type: "sale",
    price: "$650,000",
    image: "/images/suburban_house.jpeg",
    beds: 3,
    baths: 2,
    size: 180,
    location: "Austin, TX",
    status: "available",
  },
  {
    id: 6,
    title: "Penthouse Suite",
    type: "rent",
    price: "$3,200/mo",
    image: "/images/penthouse_suite.jpeg",
    beds: 2,
    baths: 2,
    size: 120,
    location: "Chicago, IL",
    status: "rented",
  },
];

const ListingsSection = () => {
  const [filter, setFilter] = useState<"sale" | "rent">("sale");
  const router = useRouter();

  const handleTabChange = (
    event: React.SyntheticEvent,
    newValue: "sale" | "rent"
  ) => {
    setFilter(newValue);
  };

  const filteredListings = listings.filter(
    (listing) => listing.type === filter
  );

  return (
    <Container sx={{ mt: 6, mb: 6 }}>
      {/* Header Section */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" gutterBottom>
          Latest Listings
        </Typography>
        <Typography variant="subtitle1" maxWidth="600px" mx="auto">
          Find your dream home with our most recent and top-rated properties.
          Whether you&apos;re looking to buy or rent, we have the perfect place for
          you.
        </Typography>
      </Box>

      {/* Tabs for Sale/Rent Filtering */}
      <Box textAlign="center" mb={4}>
        <Tabs
          value={filter}
          onChange={handleTabChange}
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="For Sale" value="sale" />
          <Tab label="For Rent" value="rent" />
        </Tabs>
      </Box>

      {/* Listings Grid */}
      <Grid2 container spacing={3}>
        {filteredListings.map((listing) => (
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={listing.id}>
            <Card sx={{ borderRadius: 3, boxShadow: 3, position: "relative" }}>
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
                    backgroundColor:
                      listing.status === "sold" ? "#d32f2f" : "#ff9800",
                    color: "#fff",
                  }}
                />
              )}

              {/* Property Image */}
              <CardMedia
                component="img"
                height="300"
                image={listing.image}
                alt={listing.title}
              />

              {/* Card Content */}
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {listing.title}
                </Typography>
                <Typography color="primary" fontWeight="bold" mt={1}>
                  {listing.price}
                </Typography>

                {/* Property Details */}
                <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                  <SvgIcon>
                    <KingBed />
                  </SvgIcon>
                  <Typography variant="body2">{listing.beds} Beds</Typography>
                  <SvgIcon>
                    <BathTub />
                  </SvgIcon>
                  <Typography variant="body2">{listing.baths} Baths</Typography>
                  <SvgIcon>
                    <SquareFoot />
                  </SvgIcon>
                  <Typography variant="body2">{listing.size} m²</Typography>
                </Stack>

                {/* Location */}
                <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                  <SvgIcon>
                    <Locations />
                  </SvgIcon>
                  <Typography variant="body2">{listing.location}</Typography>
                </Stack>

                {/* Action Buttons (for available listings only) */}
                {listing.status === "available" && (
                  <Box textAlign="center" mt={2}>
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button size="small" variant="contained" color="primary">
                        Book House Tour
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => router.push("/estimate-mortgages")}
                      >
                        Est. Mortgages
                      </Button>
                    </Stack>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>

      {/* Button to Browse More */}
      <Box textAlign="center" mt={4}>
        <Button
          variant="contained"
          size="medium"
          color="primary"
          onClick={() =>
            router.push(
              filter === "sale"
                ? "/demo/listings?type=sale"
                : "/demo/listings?type=rent"
            )
          }
        >
          Browse {filter === "sale" ? "Homes for Sale" : "Rental Listings"}
        </Button>
      </Box>
    </Container>
  );
};

export default ListingsSection;
