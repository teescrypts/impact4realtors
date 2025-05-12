import BathTub from "@/app/icons/untitled-ui/duocolor/bath-tub";
import Locations from "@/app/icons/untitled-ui/duocolor/location";
import SquareFoot from "@/app/icons/untitled-ui/duocolor/sqr-meters";
import {
  Grid2,
  Card,
  CardMedia,
  CardContent,
  Stack,
  Chip,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import React from "react";
import { propertyType } from "../../listings/page";
import KingBed from "@/app/icons/untitled-ui/duocolor/king-bed";
import Image from "next/image";

function PropertyCard({
  property,
  adminId,
  onOpenBookingModal,
  onOpenMortageModal,
}: {
  property: propertyType;
  adminId?: string;
  onOpenBookingModal: (property: propertyType) => void;
  onOpenMortageModal: (property: propertyType) => void;
}) {
  return (
    <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
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
          <CardMedia
            sx={{ height: 300, position: "relative", overflow: "hidden" }}
          >
            <Image
              src={property.images[0].url}
              alt={property.propertyTitle}
              fill
              style={{
                objectFit: "cover",
              }}
              
            />
          </CardMedia>
        </Link>
        <CardContent>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={`Listed ${formatDistanceToNow(
                new Date(property.createdAt),
                { addSuffix: true }
              )}`}
              size="small"
            />
            {property.status !== "Active" && (
              <Chip
                label={property.status === "Sold" ? "SOLD" : "RENTED"}
                color="error"
                size="small"
              />
            )}
          </Stack>
          <Typography variant="h6" fontWeight={600} mt={1}>
            {property.propertyTitle}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Locations fontSize="small" color="primary" />
            <Typography variant="body2" color="text.secondary">
              {property.location.cityName}, {property.location.stateName},{" "}
              {property.location.countryName}
            </Typography>
          </Stack>
          <Typography variant="h6" color="primary" mt={1}>
            ${property.price.toLocaleString()}
          </Typography>
          <Stack direction="row" spacing={1} mt={1}>
            <IconButton size="small" color="primary">
              <KingBed /> {property.bedrooms}
            </IconButton>
            <IconButton size="small" color="primary">
              <BathTub /> {property.bathrooms}
            </IconButton>
            <IconButton size="small" color="primary">
              <SquareFoot /> {property.squareMeters}m²
            </IconButton>
          </Stack>
          {property.status === "Active" && (
            <Stack direction="row" spacing={2} mt={2}>
              <Button
                variant="contained"
                size="small"
                onClick={() => onOpenBookingModal(property)}
              >
                Book Tour
              </Button>
              {property.category === "For Sale" && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => onOpenMortageModal(property)}
                >
                  Estimate Mortgage
                </Button>
              )}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Grid2>
  );
}

export default PropertyCard;
  