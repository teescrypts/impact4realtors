"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Grid2,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Card,
  CardMedia,
  CardContent,
  TextField,
  Select,
  MenuItem as SelectItem,
  FormControl,
  InputLabel,
  Pagination,
} from "@mui/material";
import ExpendMore from "@/app/icons/untitled-ui/duocolor/expand-more";
import Link from "next/link";

const listings = [
  {
    id: "1",
    title: "Luxury Apartment in Downtown",
    price: "$500,000",
    location: "New York, NY",
    image: "/images/apartment1.jpg",
    status: "Active",
  },
  {
    id: "2",
    title: "Cozy Suburban Home",
    price: "$350,000",
    location: "Los Angeles, CA",
    image: "/images/house1.jpg",
    status: "Pending",
  },
];

export default function ListingsPage() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    id: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedListing(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedListing(null);
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4" fontWeight="bold">
          Property Listings
        </Typography>
        <Link href={"/demo/dashboard/listing/add"}>
          <Button variant="contained" color="primary">
            Add New Listing
          </Button>
        </Link>
      </Box>

      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Search Listings"
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            label="Status"
          >
            <SelectItem value="">All</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
          </Select>
        </FormControl>
      </Box>

      <Grid2 container spacing={2}>
        {listings.map((listing) => (
          <Grid2 size={{xs:12, sm:6, md:4}} key={listing.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={listing.image}
                alt={listing.title}
              />
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {listing.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {listing.location} - {listing.price}
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      color={listing.status === "Active" ? "green" : "orange"}
                    >
                      {listing.status}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={(event) => handleMenuClick(event, listing.id)}
                  >
                    <ExpendMore />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>

      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={5}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          {" "}
          <Link href={`/demo/dashboard/listing/${selectedListing}`}>
            Edit Listing
          </Link>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>Mark as Sold</MenuItem>
        <MenuItem onClick={handleMenuClose}>Remove Listing</MenuItem>
      </Menu>
    </Box>
  );
}
