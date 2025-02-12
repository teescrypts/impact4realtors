"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid2,
  Button,
  CardMedia,
  Stack,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  IconButton,
} from "@mui/material";
import Slider from "react-slick";
import { useRouter } from "next/navigation";
import Close from "@/app/icons/untitled-ui/duocolor/close";

const ListingDetailsPage = () => {
  // Dummy listing data (in a real app, fetch this by listing id)
  const listing = {
    id: 1,
    title: "Luxury Apartment in LA",
    price: 850000,
    bedrooms: 3,
    bathrooms: 2,
    size: 150,
    location: "Los Angeles, CA",
    description:
      "Experience luxury living in this stunning apartment located in the heart of Los Angeles. Enjoy modern amenities, spacious rooms, and breathtaking views that make every day extraordinary.",
    images: [
      "/images/luxury_apartment.jpeg",
      "/images/luxury_apartment.jpeg",
      "/images/luxury_apartment.jpeg",
      "/images/luxury_apartment.jpeg",
    ],
    floorPlan: "/images/floor-plan.png", // Floor plan image
    features: [
      "Modern Kitchen",
      "Spacious Living Area",
      "Hardwood Floors",
      "Energy Efficient Appliances",
      "Swimming Pool",
      "Gym",
      "24/7 Security",
    ],
    // Coordinates for Google Maps (if needed)
    lat: 34.0522,
    lng: -118.2437,
  };

  const router = useRouter();
  const [openFloorPlan, setOpenFloorPlan] = useState(false);

  // Slider settings for react-slick carousel
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const handleOpenFloorPlan = () => setOpenFloorPlan(true);
  const handleCloseFloorPlan = () => setOpenFloorPlan(false);

  return (
    <Container sx={{ my: 6 }}>
      <Box sx={{ mb: 4 }}>
        <Slider {...sliderSettings}>
          {listing.images.map((img, index) => (
            <Box
              key={index}
              sx={{
                position: "relative",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <CardMedia
                component="img"
                image={img}
                alt={listing.title}
                sx={{
                  width: "100%",
                  height: { xs: 400, md: 500 },
                  objectFit: "cover",
                }}
              />
            </Box>
          ))}
        </Slider>
      </Box>

      {/* Listing Details */}
      <Grid2 container spacing={4}>
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {listing.title}
          </Typography>
          <Typography variant="h6" color="primary" gutterBottom>
            ${listing.price.toLocaleString()}
          </Typography>
          <Stack direction="row" spacing={3} mb={2}>
            <Typography variant="body1">{listing.bedrooms} Beds</Typography>
            <Typography variant="body1">{listing.bathrooms} Baths</Typography>
            <Typography variant="body1">{listing.size} m²</Typography>
          </Stack>
          <Typography variant="body1" gutterBottom>
            <strong>Location:</strong> {listing.location}
          </Typography>
          <Typography variant="body1" paragraph>
            {listing.description}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Features
          </Typography>
          <List>
            {listing.features.map((feature, idx) => (
              <ListItem key={idx} disableGutters>
                <ListItemText primary={`• ${feature}`} />
              </ListItem>
            ))}
          </List>
          <Stack direction="row" spacing={2} mt={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push(`/book-tour/${listing.id}`)}
            >
              Book Tour
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => router.push(`/contact?listingId=${listing.id}`)}
            >
              Contact
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => router.push(`/estimate-mortgage/${listing.id}`)}
            >
              Est. Mortgages
            </Button>
          </Stack>
        </Grid2>

        {/* Floor Plan Section */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Box
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: 2,
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
            onClick={handleOpenFloorPlan}
          >
            <CardMedia
              component="img"
              image={listing.floorPlan}
              alt="Floor Plan"
              sx={{
                width: "100%",
                height: { xs: 200, md: 300 },
                objectFit: "cover",
              }}
            />
          </Box>
          <Typography
            variant="caption"
            display="block"
            textAlign="center"
            mt={1}
          >
            Floor Plan (Click to enlarge)
          </Typography>
        </Grid2>
      </Grid2>

      {/* Floor Plan Modal */}
      <Dialog
        open={openFloorPlan}
        onClose={handleCloseFloorPlan}
        fullWidth
        maxWidth="md"
      >
        <Box sx={{ position: "relative", p: 2 }}>
          <IconButton
            onClick={handleCloseFloorPlan}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 1,
            }}
          >
            <Close />
          </IconButton>
          <CardMedia
            component="img"
            image={listing.floorPlan}
            alt="Enlarged Floor Plan"
            sx={{
              width: "100%",
              maxHeight: { xs: 300, md: 600 },
              objectFit: "contain",
              margin: "0 auto",
            }}
          />
        </Box>
      </Dialog>
    </Container>
  );
};

export default ListingDetailsPage;
