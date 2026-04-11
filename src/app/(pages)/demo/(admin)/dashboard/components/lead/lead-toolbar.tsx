/**
 * Lead Toolbar Component
 *
 * Category tabs (Buyer/Seller/Inquiry), filters, view toggle, and actions
 */

"use client";

import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Button,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Badge,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  SvgIcon,
} from "@mui/material";
import { ClearIcon } from "@mui/x-date-pickers";
import { LeadCategory, LeadViewMode, LeadFilters } from "./types/lead.types";
import Search from "@/app/icons/untitled-ui/duocolor/search";
import Filter from "@/app/icons/untitled-ui/duocolor/filter";
import Delete from "@/app/icons/untitled-ui/duocolor/delete";
import Add from "@/app/icons/untitled-ui/duocolor/add";
import Table from "@/app/icons/untitled-ui/duocolor/table";
import PinBoard from "@/app/icons/untitled-ui/duocolor/pin-board";

interface LeadToolbarProps {
  selectedCategory: LeadCategory;
  viewMode: LeadViewMode;
  filters: LeadFilters;
  selectedCount: number;
  onCategoryChange: (category: LeadCategory) => void;
  onViewModeChange: (mode: LeadViewMode) => void;
  onFilterChange: (filters: Partial<LeadFilters>) => void;
  onClearFilters: () => void;
  onAddLead: () => void;
  onBulkDelete?: () => void;
}

export default function LeadToolbar({
  selectedCategory,
  viewMode,
  filters,
  selectedCount,
  onCategoryChange,
  onViewModeChange,
  onFilterChange,
  onClearFilters,
  onAddLead,
  onBulkDelete,
}: LeadToolbarProps) {
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const [searchValue, setSearchValue] = useState(filters.search || "");

  const hasActiveFilters = Object.keys(filters).some(
    (key) =>
      key !== "category" && filters[key as keyof LeadFilters] !== undefined,
  );

  const activeFilterCount = Object.keys(filters).filter(
    (key) =>
      key !== "category" && filters[key as keyof LeadFilters] !== undefined,
  ).length;

  const handleFilterMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterAnchorEl(null);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    onFilterChange({ search: value || undefined });
  };

  const handleClearSearch = () => {
    setSearchValue("");
    onFilterChange({ search: undefined });
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Row 1: Tabs and View Toggle */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        {/* Category Tabs */}
        <Tabs
          value={selectedCategory}
          onChange={(_, value) => onCategoryChange(value)}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Buyer" value="buyer" />
          <Tab label="Seller" value="seller" />
          <Tab label="Inquiry" value="inquiry" />
        </Tabs>

        {/* View Mode Toggle */}
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, value) => value && onViewModeChange(value)}
          size="small"
        >
          <ToggleButton value="table">
            <Tooltip title="Table View">
              <SvgIcon fontSize="medium">
                <Table />
              </SvgIcon>
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="board">
            <Tooltip title="Board View">
              <SvgIcon fontSize="medium">
                <PinBoard />
              </SvgIcon>
            </Tooltip>
          </ToggleButton>
          {/* <ToggleButton value="list">
            <Tooltip title="List View">
                 <Calendar />
              <ListIcon fontSize="small" />
            </Tooltip>
          </ToggleButton> */}
        </ToggleButtonGroup>
      </Stack>

      {/* Row 2: Search, Filters, and Actions */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        {/* Left Side: Search and Filters */}
        <Stack direction="row" spacing={1.5} flex={1}>
          {/* Search */}
          <TextField
            placeholder="Search leads..."
            value={searchValue}
            onChange={handleSearchChange}
            size="small"
            sx={{ minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: searchValue && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={handleClearSearch}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Filter Button */}
          <Badge badgeContent={activeFilterCount} color="primary">
            <Button
              variant="outlined"
              startIcon={<Filter />}
              onClick={handleFilterMenuOpen}
            >
              Filters
            </Button>
          </Badge>

          {/* Active Filters Chips */}
          {hasActiveFilters && (
            <>
              {filters.intent && (
                <Chip
                  label={`Intent: ${filters.intent}`}
                  onDelete={() => onFilterChange({ intent: undefined })}
                  size="small"
                />
              )}
              {filters.status && (
                <Chip
                  label={`Status: ${filters.status}`}
                  onDelete={() => onFilterChange({ status: undefined })}
                  size="small"
                />
              )}
              {filters.hasJourney !== undefined && (
                <Chip
                  label={filters.hasJourney ? "In Journey" : "No Journey"}
                  onDelete={() => onFilterChange({ hasJourney: undefined })}
                  size="small"
                />
              )}
              {filters.progressRange && (
                <Chip
                  label={`Progress: ${filters.progressRange[0]}-${filters.progressRange[1]}%`}
                  onDelete={() => onFilterChange({ progressRange: undefined })}
                  size="small"
                />
              )}
              <Button
                variant="text"
                size="small"
                startIcon={<ClearIcon />}
                onClick={onClearFilters}
              >
                Clear All
              </Button>
            </>
          )}
        </Stack>

        {/* Right Side: Actions */}
        <Stack direction="row" spacing={1}>
          {selectedCount > 0 && onBulkDelete && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={onBulkDelete}
            >
              Delete ({selectedCount})
            </Button>
          )}
          <Button variant="contained" startIcon={<Add />} onClick={onAddLead}>
            Add Lead
          </Button>
        </Stack>
      </Stack>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterMenuClose}
        PaperProps={{ sx: { minWidth: 250 } }}
      >
        <MenuItem>
          <strong>Quick Filters</strong>
        </MenuItem>
        <MenuItem
          onClick={() => {
            onFilterChange({ hasJourney: true });
            handleFilterMenuClose();
          }}
        >
          In Active Journey
        </MenuItem>
        <MenuItem
          onClick={() => {
            onFilterChange({ hasJourney: false });
            handleFilterMenuClose();
          }}
        >
          No Journey
        </MenuItem>
        <MenuItem
          onClick={() => {
            onFilterChange({ progressRange: [0, 25] });
            handleFilterMenuClose();
          }}
        >
          Just Started (0-25%)
        </MenuItem>
        <MenuItem
          onClick={() => {
            onFilterChange({ progressRange: [26, 75] });
            handleFilterMenuClose();
          }}
        >
          In Progress (26-75%)
        </MenuItem>
        <MenuItem
          onClick={() => {
            onFilterChange({ progressRange: [76, 100] });
            handleFilterMenuClose();
          }}
        >
          Almost Done (76-100%)
        </MenuItem>
      </Menu>
    </Box>
  );
}
