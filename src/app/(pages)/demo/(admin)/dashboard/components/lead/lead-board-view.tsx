/**
 * Lead Board View Component
 *
 * Kanban-style board with drag-and-drop, journey progress,
 * and automation integration
 * FIXED: Proper drag detection to get column status, not lead ID
 */

"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Box, Paper } from "@mui/material";
import LeadBoardColumn from "./lead-board-column";
import LeadBoardCard from "./lead-board-card";
import { Lead, LeadCategory } from "./types/lead.types";
import { BUYER_TAGS, SELLER_TAGS } from "./data/tag-data";

interface LeadBoardViewProps {
  leads: Lead[];
  selectedCategory: LeadCategory;
  selectedLeads: string[];
  onSelectLead: (leadId: string) => void;
  onViewDetails: (leadId: string) => void;
  onDragEnd: (leadId: string, newStatus: string) => void;
}

export default function LeadBoardView({
  leads,
  selectedCategory,
  selectedLeads,
  onSelectLead,
  onViewDetails,
  onDragEnd,
}: LeadBoardViewProps) {
  const [activeLead, setActiveLead] = React.useState<Lead | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts
      },
    }),
  );

  // Get tags/columns for current category
  const getColumnsForCategory = () => {
    if (selectedCategory === "buyer") return BUYER_TAGS;
    if (selectedCategory === "seller") return SELLER_TAGS;
    // For inquiry, use a subset of buyer tags (they don't have specific journeys yet)
    return ["new lead", "contacted", "cold lead", "lost lead"];
  };

  const columns = getColumnsForCategory();

  // Get leads for a specific column
  // ✅ FIXED: Case-insensitive comparison for both status AND category
  const getLeadsForColumn = (status: string) => {
    return leads.filter(
      (lead) =>
        lead.status.toLowerCase() === status.toLowerCase() &&
        lead.category.toLowerCase() === selectedCategory.toLowerCase(),
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    const lead = leads.find((l) => l._id === event.active.id);
    setActiveLead(lead || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveLead(null);

    if (!over) return;

    const leadId = active.id as string;
    const overId = over.id as string;

    // ✅ FIX: Determine if we're over a column or another card
    let newStatus: string;

    // Check if overId is a valid column (status tag)
    const isColumn = columns.some(
      (col) => col.toLowerCase() === overId.toLowerCase(),
    );

    if (isColumn) {
      // Dropped directly on column
      newStatus = overId;
    } else {
      // Dropped on another card - find which column that card belongs to
      const targetLead = leads.find((l) => l._id === overId);
      if (!targetLead) return;
      newStatus = targetLead.status;
    }

    // Don't update if dropping in the same column
    const currentLead = leads.find((l) => l._id === leadId);
    if (
      currentLead &&
      currentLead.status.toLowerCase() === newStatus.toLowerCase()
    ) {
      return;
    }

    console.log("🔄 Drag completed:");
    console.log("  Lead ID:", leadId);
    console.log("  New Status:", newStatus);
    console.log("  Old Status:", currentLead?.status);

    // Call the parent handler
    onDragEnd(leadId, newStatus);
  };

  const handleDragCancel = () => {
    setActiveLead(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter} // ✅ Changed from closestCorners
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {/* Board Columns */}
      <Box
        sx={{
          overflowX: "auto",
          pb: 2,
          "&::-webkit-scrollbar": {
            height: 8,
          },
          "&::-webkit-scrollbar-track": {
            bgcolor: "grey.200",
            borderRadius: 1,
          },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "grey.400",
            borderRadius: 1,
            "&:hover": {
              bgcolor: "grey.500",
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            minWidth: "min-content",
          }}
        >
          {columns.map((status) => {
            const columnLeads = getLeadsForColumn(status);
            return (
              <LeadBoardColumn
                key={status}
                status={status}
                leads={columnLeads}
                selectedLeads={selectedLeads}
                onSelectLead={onSelectLead}
                onViewDetails={onViewDetails}
              />
            );
          })}
        </Box>
      </Box>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeLead ? (
          <Paper
            elevation={8}
            sx={{
              width: 300,
              opacity: 0.9,
              transform: "rotate(-2deg)",
            }}
          >
            <LeadBoardCard
              lead={activeLead}
              isSelected={selectedLeads.includes(activeLead._id)}
              onSelect={() => {}}
              onViewDetails={() => {}}
              isDragging
            />
          </Paper>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
