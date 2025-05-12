"use client";

import {
  Box,
  Button,
  Container,
  Grid2,
  Typography,
  Tabs,
  Tab,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { propertyType } from "../../../(pages)/listings/page";
import PropertyCard from "../property-card";
import EmptyState from "../../../(pages)/components/empty-state";
import { useRouter } from "next/navigation";

const RecentListings = ({
  adminId,
  forSale,
  forRent,
}: {
  adminId: string | undefined;
  forSale: propertyType[];
  forRent: propertyType[];
}) => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<"For Sale" | "For Rent">(
    "For Sale"
  );

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue as "For Sale" | "For Rent");
  };

  const filteredProperties = [...forSale, ...forRent].filter(
    (p) => p.category === selectedTab
  );

  return (
    <Container maxWidth="lg" sx={{ my: 8 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Recent Listings
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Discover our latest properties available for sale and rent
        </Typography>
      </Box>

      <Box textAlign="center" mb={4}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="For Sale" value="For Sale" />
          <Tab label="For Rent" value="For Rent" />
        </Tabs>
      </Box>

      <Grid2 container spacing={3} justifyContent="center">
        {filteredProperties.length > 0 &&
          filteredProperties.map((property) => (
            <PropertyCard
              key={property._id}
              adminId={adminId}
              property={property}
            />
          ))}
      </Grid2>

      {filteredProperties.length === 0 && (
        <Stack justifyContent={"center"} alignItems={"center"}>
          <EmptyState
            title="No Property Found"
            description={`No properties are available ${selectedTab.toLocaleLowerCase()} at the moment. Please check back later`}
          />
        </Stack>
      )}

      {forRent.length > 0 && selectedTab === "For Rent" && (
        <Box textAlign="center" mt={4}>
          <Button
            variant="outlined"
            size="medium"
            color="primary"
            onClick={() =>
              router.push(
                adminId
                  ? `/demo/broker/listings?category=${"For Rent"}&admin=${adminId}`
                  : `/demo/broker/listings?category=${"For Rent"}`
              )
            }
          >
            Explore Rental Listings
          </Button>
        </Box>
      )}

      {forSale.length > 0 && selectedTab === "For Sale" && (
        <Box textAlign="center" mt={4}>
          <Button
            variant="outlined"
            size="medium"
            color="primary"
            onClick={() =>
              router.push(
                adminId
                  ? `/demo/broker/listings?category=${"For Sale"}&admin=${adminId}`
                  : `/demo/broker/listings?category=${"For Sale"}`
              )
            }
          >
            Explore Homes for Sale
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default RecentListings;
