"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid2,
  Tabs,
  Tab,
  Container,
  Stack,
  SvgIcon,
  Chip,
} from "@mui/material";
import SquareFoot from "@/app/icons/untitled-ui/duocolor/sqr-meters";
import BathTub from "@/app/icons/untitled-ui/duocolor/bath-tub";
import KingBed from "@/app/icons/untitled-ui/duocolor/king-bed";
import Locations from "@/app/icons/untitled-ui/duocolor/location";
import { useRouter } from "nextjs-toploader/app";
import { PropertyResponse } from "@/types";
import EmptyState from "../empty-state";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { propertyType } from "../../listings/page";
import BookHouseTour from "../book-house-tour";
import { type } from "os";
import MortgageEstimationModal from "../calc-mortgage";

const ListingsSection = ({
  adminId,
  forSale,
  forRent,
}: {
  adminId: string | undefined;
  forSale: propertyType[];
  forRent: propertyType[];
}) => {
  const [filter, setFilter] = useState<"For Sale" | "For Rent">("For Sale");
  const router = useRouter();

  const [openMortgageModal, setOpenMortgageModal] = useState<boolean>(false);
  const [selectedListing, setSelectedListing] = useState<null | propertyType>(
    null
  );
  const [openBookingModal, setOpenBookingModal] = useState<boolean>(false);

  const handleTabChange = (
    event: React.SyntheticEvent,
    newValue: "For Sale" | "For Rent"
  ) => {
    setFilter(newValue);
  };

  const filteredListings = [...forSale, ...forRent].filter(
    (listing) => listing.category === filter
  );

  const handleOpenMortgageModal = (property: propertyType) => {
    setSelectedListing(property);
    setOpenMortgageModal(true);
  };

  const handleOpenBookingModal = (property: propertyType) => {
    setSelectedListing(property);
    setOpenBookingModal(true);
  };

  return (
    <Container sx={{ my: 6 }} maxWidth={"xl"}>
      {/* Header Section */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" gutterBottom>
          Latest Listings
        </Typography>
        <Typography variant="subtitle1" maxWidth="600px" mx="auto">
          Find your dream home with our most recent and top-rated properties.
          Whether you&apos;re looking to buy or rent, we have the perfect place
          for you.
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
          <Tab label="For Sale" value="For Sale" />
          <Tab label="For Rent" value="For Rent" />
        </Tabs>
      </Box>

      {/* Listings Grid */}
      <Grid2 container spacing={3}>
        {filteredListings.length > 0 ? (
          filteredListings.map((property) => {
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
                            property.category === "For Sale" ? "sale" : "rent"
                          }/${property._id}?admin=${adminId}`
                        : `/demo/listings/${
                            property.category === "For Sale" ? "sale" : "rent"
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
                            property.category === "For Sale" ? "sale" : "rent"
                          }/${property._id}?admin=${adminId}`
                        : `/demo/listings/${
                            property.category === "For Sale" ? "sale" : "rent"
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
                      {property.category === "For Sale" && (
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
          <EmptyState
            title="No Property Found"
            description={`No properties are available ${filter.toLocaleLowerCase()} at the moment. Please check back later`}
          />
        )}
      </Grid2>

      {/* Button to Browse More */}
      {forRent.length > 0 && forSale.length > 0 && (
        <Box textAlign="center" mt={4}>
          <Button
            variant="contained"
            size="medium"
            color="primary"
            onClick={() =>
              router.push(
                filter === "For Sale"
                  ? adminId
                    ? `/demo/listings?category=${"For Sale"}&admin=${adminId}`
                    : `/demo/listings?category=${"For Sale"}`
                  : adminId
                  ? `/demo/listings?category=${"For Rent"}&admin=${adminId}`
                  : `/demo/listings?category=${"For Rent"}`
              )
            }
          >
            Browse{" "}
            {filter === "For Sale" ? "Homes for Sale" : "Rental Listings"}
          </Button>
        </Box>
      )}

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
    </Container>
  );
};

export default ListingsSection;
