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
} from "@mui/material";
import Slider from "react-slick";
import { propertyType } from "../listings/page";
import BookHouseTour from "./book-house-tour";
import MortgageEstimationModal from "./calc-mortgage";
import Share07 from "@/app/icons/untitled-ui/duocolor/share-07";
import Instagram from "@/app/icons/untitled-ui/duocolor/instaagram";
import Whatsapp from "@/app/icons/untitled-ui/duocolor/whatsapp";
import Linkedin from "@/app/icons/untitled-ui/duocolor/linkedin";
import Twitter from "@/app/icons/untitled-ui/duocolor/twitter";

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

  // Slider settings for react-slick
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
        console.warn("Web Share API failed, falling back to links.");
      }
    }

    // Fallback: open Facebook share as default
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        listingUrl
      )}`,
      "_blank"
    );
  };

  return (
    <Container sx={{ my: 6 }}>
      {/* Property Image Slider */}
      <Box sx={{ mb: 4 }}>
        <Slider {...sliderSettings}>
          {property.images.map((img, index) => (
            <Box key={index} sx={{ position: "relative", borderRadius: 2 }}>
              <CardMedia
                component="img"
                image={img.url}
                alt={property.propertyTitle}
                sx={{
                  width: "100%",
                  height: { xs: 500, md: 500 },
                  objectFit: "cover",
                }}
              />
            </Box>
          ))}
        </Slider>
      </Box>

      {/* Property Details */}
      <Typography variant="h4" fontWeight="bold">
        {property.propertyTitle}
      </Typography>
      <Typography variant="h6" color="primary">
        ${property.price.toLocaleString()}
      </Typography>
      <Stack direction="row" spacing={3} mb={2}>
        <Typography variant="body1">{property.bedrooms} Beds</Typography>
        <Typography variant="body1">{property.bathrooms} Baths</Typography>
        <Typography variant="body1">{property.squareMeters} m²</Typography>
      </Stack>
      <Typography variant="body1" gutterBottom>
        <strong>Location:</strong>{" "}
        {`${property.location.cityName}, ${property.location.stateName}`}
      </Typography>
      <Typography variant="body1">{property.description}</Typography>
      <Divider sx={{ my: 2 }} />

      {/* Features List */}
      <Typography variant="h6" fontWeight="bold">
        Features
      </Typography>
      <List>
        {property.features.map((feature, idx) => (
          <ListItem key={idx} disableGutters>
            <ListItemText primary={`• ${feature}`} />
          </ListItem>
        ))}
      </List>

      {/* Call-to-Action Buttons */}
      <Stack direction="row" spacing={2} mt={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenBookingModal}
        >
          Book Tour
        </Button>
        {property.category === "For Sale" && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleOpenMortgageModal}
          >
            Est. Mortgages
          </Button>
        )}
      </Stack>

      {/* Social Sharing Section */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Share this Property
      </Typography>
      <Stack direction="row" spacing={1} mt={1}>
        <IconButton color="primary" onClick={shareListing}>
          <Share07 />
        </IconButton>
        <IconButton
          component="a"
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
            shareText
          )}&url=${encodeURIComponent(listingUrl)}`}
          target="_blank"
          aria-label="Share on Twitter"
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
          aria-label="Share on LinkedIn"
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
          aria-label="Share on WhatsApp"
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
          aria-label="Share on Instagram"
          color="secondary"
        >
          <Instagram />
        </IconButton>
      </Stack>

      {/* Modals */}
      <MortgageEstimationModal
        adminId={adminId as string}
        open={openMortgageModal}
        onClose={() => setOpenMortgageModal(false)}
        listing={property}
      />
      <BookHouseTour
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
