"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Card,
  CardMedia,
  CardContent,
  TextField,
  Select,
  MenuItem as SelectItem,
  FormControl,
  InputLabel,
  Pagination,
  CircularProgress,
  SelectChangeEvent,
  Grid2,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import ExpendMore from "@/app/icons/untitled-ui/duocolor/expand-more";
import Link from "next/link";
import { PropertyType } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import {
  deleteProperty,
  updatePropertyStatus,
} from "@/app/actions/server-actions";
import notify from "@/app/utils/toast";
import EmptyState from "../../../(pages)/components/empty-state";

export default function ListingsPage({
  properties,
  pagination,
}: {
  properties: PropertyType[];
  pagination: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
  };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // States for search, filter, and pagination
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const [selectedListingStatus, setSelectedListingStatus] = useState("");
  const [search, setSearch] = useState(searchParams.get("query") || "");
  const [filter, setFilter] = useState(searchParams.get("status") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [loading, setLoading] = useState(false);

  // Handle search input with debounce
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      setLoading(true);
      setPage(1); // Reset to page 1 when searching
      router.push(`?query=${search}&status=${filter}&page=1`, {
        scroll: false,
      });
      setLoading(false);
    }, 1000); // Delay API call by 500ms

    return () => clearTimeout(delaySearch);
  }, [search, filter, router]);

  // Handle filter change
  const handleFilterChange = (e: SelectChangeEvent<string>) => {
    setLoading(true);
    setFilter(e.target.value as string);
    setPage(1); // Reset to page 1 when filtering
    router.push(`?query=${search}&status=${e.target.value}&page=1`, {
      scroll: false,
    });
    setLoading(false);
  };

  // Handle pagination change
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setLoading(true);
    setPage(value);
    router.push(`?query=${search}&status=${filter}&page=${value}`, {
      scroll: false,
    });
    setLoading(false);
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    id: string,
    status: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedListing(id);
    setSelectedListingStatus(status);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedListing(null);
  };

  const [message, setMesaage] = useState("");

  const handleUpdateProperty = useCallback(
    async (status: string) => {
      if (selectedListing && selectedListingStatus) {
        const result = await updatePropertyStatus(selectedListing, status);

        if (result?.error) setMesaage(result.error);
        if (result?.message) notify(result.message);

        handleMenuClose();
      }
    },
    [selectedListing, selectedListingStatus]
  );

  const handleDeleteProperty = useCallback(async () => {
    if (selectedListing) {
      const result = await deleteProperty(selectedListing);

      if (result?.error) setMesaage(result.error);
      if (result?.message) notify(result.message);

      handleMenuClose();
    }
  }, [selectedListing]);

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

      {/* Search and Filter Section */}
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
          <Select value={filter} onChange={handleFilterChange} label="Status">
            <SelectItem value="">All</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Sold">Sold</SelectItem>
          </Select>
        </FormControl>
      </Box>

      {properties.length === 0 && !loading && (
        <Stack justifyContent={"center"} alignItems={"center"}>
          <EmptyState
            title="No Property Listed"
            description="You have not listed any property."
          />
        </Stack>
      )}

      {/* Property Listings */}
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid2 container spacing={2}>
          {properties.length > 0 &&
            properties.map((property) => (
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={property._id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={property.images[0].url}
                    alt={property.propertyTitle}
                  />
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {property.propertyTitle}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {`${property.location.stateName}, ${property.location.stateCode}`}{" "}
                          - {property.price}
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color={
                            property.status === "Active" ? "green" : "orange"
                          }
                        >
                          {property.status}
                        </Typography>
                      </Box>
                      <IconButton
                        onClick={(event) =>
                          handleMenuClick(event, property._id!, property.status)
                        }
                      >
                        <ExpendMore />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
        </Grid2>
      )}

      <Typography variant="subtitle2" color="error" textAlign={"center"}>
        {message}
      </Typography>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={pagination.totalPages}
          page={page}
          onChange={handlePageChange}
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
        {selectedListingStatus === "Active" ? (
          <MenuItem onClick={() => handleUpdateProperty("Sold")}>
            Mark as Sold
          </MenuItem>
        ) : (
          <MenuItem onClick={() => handleUpdateProperty("Active")}>
            Relist Property
          </MenuItem>
        )}

        <MenuItem sx={{ color: "red" }} onClick={handleDeleteProperty}>
          Remove Listing
        </MenuItem>
      </Menu>
    </Box>
  );
}
