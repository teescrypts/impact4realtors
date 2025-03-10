"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Grid2,
  Tabs,
  Tab,
  Container,
  Stack,
} from "@mui/material";
import { useRouter } from "nextjs-toploader/app";
import EmptyState from "../empty-state";
import { propertyType } from "../../listings/page";
import BookHouseTour from "../book-house-tour";
import MortgageEstimationModal from "../calc-mortgage";
import PropertyCard from "./property-card";

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
      <Stack justifyContent={"center"} alignItems={"center"} mb={4}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Explore Our Latest Listings
        </Typography>
        <Typography
          maxWidth={800}
          textAlign={"center"}
          variant="subtitle1"
          color="text.secondary"
        >
          Find your dream home with our most recent and top-rated properties.
          Whether you&apos;re looking to buy or rent, we have the perfect place
          for you.
        </Typography>
      </Stack>

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
        {filteredListings.length > 0 &&
          filteredListings.map((property) => {
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

      {filteredListings.length === 0 && (
        <Stack justifyContent={"center"} alignItems={"center"}>
          <EmptyState
            title="No Property Found"
            description={`No properties are available ${filter.toLocaleLowerCase()} at the moment. Please check back later`}
          />
        </Stack>
      )}

      {/* Button to Browse More */}
      {forRent.length > 0 && filter === "For Rent" && (
        <Box textAlign="center" mt={4}>
          <Button
            variant="contained"
            size="medium"
            color="primary"
            onClick={() =>
              router.push(
                adminId
                  ? `/demo/listings?category=${"For Rent"}&admin=${adminId}`
                  : `/demo/listings?category=${"For Rent"}`
              )
            }
          >
            Browse Rental Listings
          </Button>
        </Box>
      )}

      {forSale.length > 0 && filter === "For Sale" && (
        <Box textAlign="center" mt={4}>
          <Button
            variant="contained"
            size="medium"
            color="primary"
            onClick={() =>
              router.push(
                adminId
                  ? `/demo/listings?category=${"For Sale"}&admin=${adminId}`
                  : `/demo/listings?category=${"For Sale"}`
              )
            }
          >
            Browse Homes for Sale
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
