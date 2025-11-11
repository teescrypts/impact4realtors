"use client";
import {
  DndContext,
  closestCorners,
  DragOverlay,
  DragEndEvent,
  SensorDescriptor,
  SensorOptions,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Grid2 } from "@mui/material";
import { Scrollbar } from "@/app/component/scrollbar";
import { leadCategories } from "./data";
import LeadColumn from "./lead-column";
import LeadCard from "./lead-card";
import { LeadType } from "../lead/page";
import { Dispatch, SetStateAction } from "react";

export default function LeadBoard({
  selectedCategory,
  leads,
  sensors,
  activeLead,
  setActiveLead,
  handleDragEnd,
  toggleSelection,
  selectedLeads,
}: {
  selectedCategory: string;
  leads: LeadType[];
  sensors: SensorDescriptor<SensorOptions>[];
  activeLead: string | null;
  setActiveLead: Dispatch<SetStateAction<string | null>>;
  handleDragEnd: (event: DragEndEvent) => void;
  toggleSelection: (leadId: string) => void;
  selectedLeads: string[];
}) {
  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={(e) => setActiveLead(e.active.id as string)}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveLead(null)}
      sensors={sensors}
    >
      <Scrollbar style={{ width: "100%", overflowX: "auto" }}>
        <Grid2 container wrap="nowrap" spacing={2}>
          <SortableContext
            items={leads.map((l: { _id: string }) => l._id)}
            strategy={verticalListSortingStrategy}
          >
            {leadCategories[selectedCategory].map((stage: string) => (
              <LeadColumn
                key={stage}
                category={selectedCategory}
                stage={stage}
                leads={leads}
                toggleSelection={toggleSelection}
                selectedLeads={selectedLeads}
              />
            ))}
          </SortableContext>
        </Grid2>
      </Scrollbar>

      <DragOverlay>
        {leads.length > 0 && activeLead ? (
          <LeadCard
            lead={leads.find((l: { _id: string }) => l._id === activeLead)!}
            toggleSelection={() => {}}
            isSelected={false}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
