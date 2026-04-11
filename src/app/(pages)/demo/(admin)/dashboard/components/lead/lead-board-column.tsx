/**
 * Lead Board Column Component
 * 
 * Individual column in the Kanban board (e.g., "New Lead", "Contacted", etc.)
 */

"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Paper, Typography, Box, Stack, Chip } from "@mui/material";
import LeadBoardCard from "./lead-board-card";
import { getTagColor } from "./data/tag-data";
import { Lead } from "./types/lead.types";

interface LeadBoardColumnProps {
  status: string;
  leads: Lead[];
  selectedLeads: string[];
  onSelectLead: (leadId: string) => void;
  onViewDetails: (leadId: string) => void;
}

export default function LeadBoardColumn({
  status,
  leads,
  selectedLeads,
  onSelectLead,
  onViewDetails,
}: LeadBoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <Paper
      ref={setNodeRef}
      sx={{
        minWidth: 320,
        maxWidth: 320,
        p: 2,
        bgcolor: isOver ? "action.hover" : "background.paper",
        transition: "background-color 0.2s ease",
        height: "fit-content",
        maxHeight: "calc(100vh - 280px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Column Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        pb={1.5}
        borderBottom={2}
        borderColor={getTagColor(status)}
      >
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{ textTransform: "capitalize" }}
        >
          {status}
        </Typography>
        <Chip
          label={leads.length}
          size="small"
          sx={{
            bgcolor: getTagColor(status),
            color: "white",
            fontWeight: 600,
            minWidth: 32,
          }}
        />
      </Stack>

      {/* Lead Cards */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          "&::-webkit-scrollbar": {
            width: 6,
          },
          "&::-webkit-scrollbar-track": {
            bgcolor: "grey.100",
            borderRadius: 1,
          },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "grey.300",
            borderRadius: 1,
            "&:hover": {
              bgcolor: "grey.400",
            },
          },
        }}
      >
        <SortableContext
          items={leads.map((lead) => lead._id)}
          strategy={verticalListSortingStrategy}
        >
          <Stack spacing={1.5}>
            {leads.length === 0 ? (
              <Box
                sx={{
                  p: 3,
                  textAlign: "center",
                  color: "text.secondary",
                  bgcolor: "grey.50",
                  borderRadius: 1,
                  border: "1px dashed",
                  borderColor: "grey.300",
                }}
              >
                <Typography variant="body2">No leads</Typography>
              </Box>
            ) : (
              leads.map((lead) => (
                <LeadBoardCard
                  key={lead._id}
                  lead={lead}
                  isSelected={selectedLeads.includes(lead._id)}
                  onSelect={() => onSelectLead(lead._id)}
                  onViewDetails={() => onViewDetails(lead._id)}
                />
              ))
            )}
          </Stack>
        </SortableContext>
      </Box>
    </Paper>
  );
}
