"use client";

import { useState } from "react";
import {
  DndContext,
  closestCorners,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Tabs, Tab, Paper, TextField, Button, Grid2 } from "@mui/material";
import { leadCategories, sampleLeads } from "./data";
import LeadColumn from "./lead-column";
import LeadCard from "./lead-card";
import { Scrollbar } from "@/app/component/scrollbar";

export default function LeadManagement() {
  const [selectedCategory, setSelectedCategory] = useState("House Tour Leads");
  const [leads, setLeads] = useState(sampleLeads);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [activeLead, setActiveLead] = useState<any>(null);

  // Drag-and-drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Handles lead movement between stages
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === active.id ? { ...lead, stage: over.id } : lead
      )
    );

    setActiveLead(null);
  };

  const toggleLeadSelection = (leadId: string) => {
    setSelectedLeads((prevSelected) =>
      prevSelected.includes(leadId)
        ? prevSelected.filter((id) => id !== leadId)
        : [...prevSelected, leadId]
    );
  };

  const handleBulkDelete = () => {
    setLeads((prevLeads) =>
      prevLeads.filter((lead) => !selectedLeads.includes(lead.id))
    );
    setSelectedLeads([]);
  };

  const handleBulkEmail = () => {
    alert(`Sending email to ${selectedLeads.length} leads`);
  };

  return (
    <Paper sx={{ p: 2, overflowX: "auto" }}>
      {/* Top Bar */}
      <Grid2 container spacing={2} alignItems="center" sx={{ mb: 2 }}>
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
        <Grid2 size={{ xs: 12, md: 3 }}>
          <TextField fullWidth label="Search Leads" variant="outlined" />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 3 }} sx={{ textAlign: "right" }}>
          <Button
            variant="contained"
            sx={{ mr: 1 }}
            disabled={selectedLeads.length === 0}
            onClick={handleBulkEmail}
          >
            Bulk Email
          </Button>
          <Button
            variant="outlined"
            color="error"
            disabled={selectedLeads.length === 0}
            onClick={handleBulkDelete}
          >
            Delete Selected
          </Button>
        </Grid2>
      </Grid2>

      {/* Kanban Board */}
      <DndContext
        collisionDetection={closestCorners}
        onDragStart={(event) => setActiveLead(event.active.id)}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveLead(null)}
        sensors={sensors}
      >
        <Scrollbar style={{ width: "100%", overflowX: "auto" }}>
          <Grid2 container wrap="nowrap" spacing={2}>
            <SortableContext
              items={leads.map((lead) => lead.id)}
              strategy={verticalListSortingStrategy}
            >
              {leadCategories[selectedCategory].map((stage) => (
                <LeadColumn
                  key={stage}
                  stage={stage}
                  leads={leads}
                  toggleSelection={toggleLeadSelection}
                  selectedLeads={selectedLeads}
                />
              ))}
            </SortableContext>
          </Grid2>
        </Scrollbar>

        {/* Drag Overlay for smooth dragging */}
        <DragOverlay>
          {activeLead ? (
            <LeadCard
              lead={leads.find((lead) => lead.id === activeLead)}
              toggleSelection={() => {}}
              isSelected={false}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </Paper>
  );
}
