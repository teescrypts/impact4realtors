"use client";

import { useCallback, useEffect, useState } from "react";
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
import {
  Tabs,
  Tab,
  Paper,
  TextField,
  Button,
  Grid2,
  Typography,
} from "@mui/material";
import { leadCategories, sampleLeads } from "./data";
import LeadColumn from "./lead-column";
import LeadCard from "./lead-card";
import { Scrollbar } from "@/app/component/scrollbar";
import { LeadType } from "../lead/page";
import { deleteLead, updateLeadStatus } from "@/app/actions/server-actions";
import notify from "@/app/utils/toast";
import { useRouter } from "nextjs-toploader/app";

export default function LeadManagement({
  leads,
  hasMore,
  lastCreatedAt,
}: {
  leads: LeadType[];
  hasMore: boolean;
  lastCreatedAt: Date;
}) {
  const [selectedCategory, setSelectedCategory] = useState("House Tour Leads");
  const [currentLeads, setCurrentLeads] = useState(leads);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [activeLead, setActiveLead] = useState<any>(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Drag-and-drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Handles lead movement between stages
  const handleDragEnd = useCallback(
    (event: any) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      // Optimistically update the UI
      setCurrentLeads((prev) => {
        return prev.map((lead) =>
          lead._id === active.id
            ? { ...lead, status: over.id.toLowerCase() }
            : lead
        );
      });

      // Perform the API update
      updateLeadStatus(over.id.toLowerCase(), active.id).then((result) => {
        if (result?.error) {
          setMessage(result.error);
        } else if (result?.message) {
          notify(result.message);
        }
      });

      setActiveLead(null);
    },
    [currentLeads]
  );

  const toggleLeadSelection = (leadId: string) => {
    setSelectedLeads((prevSelected) =>
      prevSelected.includes(leadId)
        ? prevSelected.filter((id) => id !== leadId)
        : [...prevSelected, leadId]
    );
  };

  const handleBulkDelete = () => {
    if (selectedLeads.length > 0) {
      selectedLeads.forEach((leadId) => {
        deleteLead(leadId).then((result) => {
          if (result?.error) {
            setMessage(result.error);
            return;
          }
        });
      });

      notify("leads Deleted");
    }
  };

  useEffect(() => {
    setCurrentLeads(leads);
  }, [leads]);

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
        {/* <Grid2 size={{ xs: 12, md: 3 }}>
          <TextField fullWidth label="Search Leads" variant="outlined" />
        </Grid2> */}
        <Grid2 size={{ xs: 12, md: 3 }} sx={{ textAlign: "right" }}>
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

      {message && (
        <Typography variant="subtitle2" color="red" textAlign={"center"}>
          {message}
        </Typography>
      )}

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
              items={leads.map((lead) => lead._id)}
              strategy={verticalListSortingStrategy}
            >
              {leadCategories[selectedCategory].map((stage) => (
                <LeadColumn
                  category={selectedCategory}
                  key={stage}
                  stage={stage}
                  leads={currentLeads}
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
              lead={leads.find((lead) => lead._id === activeLead)}
              toggleSelection={() => {}}
              isSelected={false}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {hasMore && (
        <Button
          variant="contained"
          size="small"
          onClick={() =>
            router.push(`/demo/dashboard/lead?lastCreatedAt=${lastCreatedAt}`, {
              scroll: false,
            })
          }
        >
          Load More Leads
        </Button>
      )}
    </Paper>
  );
}
