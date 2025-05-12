"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  CardMedia,
  Stack,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Grid2,
  Paper,
} from "@mui/material";
import Slider from "react-slick";
import { propertyType } from "../listings/page";
import Share07 from "@/app/icons/untitled-ui/duocolor/share-07";
import Instagram from "@/app/icons/untitled-ui/duocolor/instaagram";
import Whatsapp from "@/app/icons/untitled-ui/duocolor/whatsapp";
import Linkedin from "@/app/icons/untitled-ui/duocolor/linkedin";
import Twitter from "@/app/icons/untitled-ui/duocolor/twitter";
import BookHouseTour from "../../(pages)/components/book-house-tour";
import MortgageEstimationModal from "./calc-mortgage";

const ListingDetailsPage = ({
  adminId,
  property,
}: {
  adminId: string | undefined;
  property: propertyType;
}) => {
  const [openMortgageModal, setOpenMortgageModal] = useState(false);
  const [openBookingModal, setOpenBookingModal] = useState(false);

  const handleOpenMortgageModal = () => setOpenMortgageModal(true);
  const handleOpenBookingModal = () => setOpenBookingModal(true);

  const sliderSettings = {
    dots: true,
    arrows: true,
    infinite: property.images.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  const listingUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `Check out this property: ${property.propertyTitle}`;

  const shareListing = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.propertyTitle,
          text: shareText,
          url: listingUrl,
        });
        return;
      } catch (error) {
        console.warn("Web Share API failed.", error);
      }
    }
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        listingUrl
      )}`,
      "_blank"
    );
  };

  return (
    <Container maxWidth="lg" sx={{ my: 10 }}>
      {/* Image Slider */}
      <Box sx={{ mb: 5 }}>
        <Slider {...sliderSettings}>
          {property.images.map((img, index) => (
            <Box
              key={index}
              sx={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 2,
              }}
            >
              <CardMedia
                component="img"
                image={img.url}
                alt={property.propertyTitle}
                sx={{
                  width: "100%",
                  height: { xs: 400, md: 550 },
                  objectFit: "cover",
                  transition: "transform 0.4s ease",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                }}
              />
            </Box>
          ))}
        </Slider>
      </Box>

      <Grid2 container spacing={6}>
        {/* Main Info */}
        <Grid2 sx={{ xs: 12, md: 8 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {property.propertyTitle}
          </Typography>

          <Typography variant="h5" color="primary" gutterBottom>
            ${property.price.toLocaleString()}
          </Typography>

          <Stack direction="row" spacing={2} mb={2}>
            <Typography>{property.bedrooms} Beds</Typography>
            <Typography>{property.bathrooms} Baths</Typography>
            <Typography>{property.squareMeters} m²</Typography>
          </Stack>

          <Typography variant="body1" gutterBottom>
            <strong>Location:</strong>{" "}
            {`${property.location.cityName}, ${property.location.stateName}`}
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            {property.description}
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Features */}
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Features
          </Typography>
          <List>
            {property.features.map((feature, idx) => (
              <ListItem key={idx} disableGutters>
                <ListItemText primary={`• ${feature}`} />
              </ListItem>
            ))}
          </List>

          {/* Social Sharing */}
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Share this Property
          </Typography>
          <Stack direction="row" spacing={1}>
            <IconButton color="primary" onClick={shareListing}>
              <Share07 />
            </IconButton>
            <IconButton
              component="a"
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                shareText
              )}&url=${encodeURIComponent(listingUrl)}`}
              target="_blank"
              color="primary"
            >
              <Twitter />
            </IconButton>
            <IconButton
              component="a"
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                listingUrl
              )}`}
              target="_blank"
              color="primary"
            >
              <Linkedin />
            </IconButton>
            <IconButton
              component="a"
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                shareText + " " + listingUrl
              )}`}
              target="_blank"
              color="success"
            >
              <Whatsapp />
            </IconButton>
            <IconButton
              component="a"
              href={`https://www.instagram.com/?url=${encodeURIComponent(
                listingUrl
              )}`}
              target="_blank"
              color="secondary"
            >
              <Instagram />
            </IconButton>
          </Stack>
        </Grid2>

        {/* Actions Sidebar */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              position: { md: "sticky" },
              top: 100,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Interested in this property?
            </Typography>
            <Stack direction="column" spacing={2} mt={2}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleOpenBookingModal}
              >
                Book a Tour
              </Button>
              {property.category === "For Sale" && (
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={handleOpenMortgageModal}
                >
                  Estimate Mortgage
                </Button>
              )}
            </Stack>
          </Paper>
        </Grid2>
      </Grid2>

      {/* Modals */}
      <MortgageEstimationModal
        agent={property.agent}
        adminId={adminId as string}
        open={openMortgageModal}
        onClose={() => setOpenMortgageModal(false)}
        listing={property}
      />

      <BookHouseTour
        agent={property.agent}
        houseTouringType={property.category}
        open={openBookingModal}
        onClose={() => setOpenBookingModal(false)}
        houseDetails={{
          id: property._id as string,
          name: property.propertyTitle,
          location: `${property.location.cityName}, ${property.location.stateName}, ${property.location.countryName}`,
          price: property.price,
        }}
        adminId={adminId as string}
      />
    </Container>
  );
};

export default ListingDetailsPage;
