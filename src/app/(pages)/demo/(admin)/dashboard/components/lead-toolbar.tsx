"use client";

import { Tabs, Tab, Button, Grid2, Stack } from "@mui/material";
import { leadCategories } from "./data";

interface LeadToolbarProps {
  selectedCategory: string;
  selectedLeads: string[];
  setSelectedCategory: (category: string) => void;
  handleBulkDelete: () => void;
  onAddNewLead: () => void; // new handler for adding a lead
}

export default function LeadToolbar({
  selectedCategory,
  selectedLeads,
  setSelectedCategory,
  handleBulkDelete,
  onAddNewLead,
}: LeadToolbarProps) {
  return (
    <Grid2
      container
      spacing={2}
      alignItems="center"
      justifyContent="space-between"
      sx={{ mb: 2 }}
    >
      {/* Tabs Section */}
      <Grid2 size={{ xs: 12, md: 6 }}>
        <Tabs
          value={selectedCategory}
          onChange={(_, value) => setSelectedCategory(value)}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
        >
          {Object.keys(leadCategories).map((category) => (
            <Tab key={category} label={category} value={category} />
          ))}
        </Tabs>
      </Grid2>

      {/* Action Buttons */}
      <Grid2
        size={{ xs: 12, md: 6 }}
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.5,
          flexWrap: "wrap",
        }}
      >
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            color="error"
            disabled={!selectedLeads.length}
            onClick={handleBulkDelete}
          >
            Delete Selected
          </Button>

          <Button variant="contained" color="primary" onClick={onAddNewLead}>
            + Add New Lead
          </Button>
        </Stack>
      </Grid2>
    </Grid2>
  );
}
