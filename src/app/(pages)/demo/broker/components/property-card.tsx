import {
  Grid2,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import { propertyType } from "../../(pages)/listings/page";

function PropertyCard({
  property,
  adminId,
}: {
  property: propertyType;
  adminId?: string;
}) {
  return (
    <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={property._id}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card
          sx={{
            boxShadow: 3,
            borderRadius: "12px",
            transition: "box-shadow 0.3s ease",
            "&:hover": { boxShadow: 6 },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardMedia sx={{ height: 250, position: "relative" }}>
            <Image
              src={property.images[0]?.url || "/placeholder.jpg"}
              alt={property.propertyTitle}
              fill
              style={{
                objectFit: "cover",
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px",
              }}
            />
          </CardMedia>
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h6" gutterBottom>
              {property.propertyTitle}
            </Typography>
            <Typography variant="h5" color="primary">
              ${property.price.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="textSecondary" mt={1}>
              {property.category} • {property.location.cityName},{" "}
              {property.location.stateCode}, {property.location.countryCode}
            </Typography>
            <Typography variant="body2" color="textSecondary" mt={2}>
              🛏️ {property.bedrooms} | 🛁 {property.bathrooms} | 📏{" "}
              {property.squareMeters} m²
            </Typography>
          </CardContent>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              borderBottomLeftRadius: "12px",
              borderBottomRightRadius: "12px",
            }}
            href={
              adminId
                ? `/demo/broker/listings/${
                    property.category === "For Sale" ? "sale" : "rent"
                  }/${property._id}?admin=${adminId}`
                : `/demo/broker/listings/${
                    property.category === "For Sale" ? "sale" : "rent"
                  }/${property._id}`
            }
          >
            View Details
          </Button>
        </Card>
      </motion.div>
    </Grid2>
  );
}

export default PropertyCard;
