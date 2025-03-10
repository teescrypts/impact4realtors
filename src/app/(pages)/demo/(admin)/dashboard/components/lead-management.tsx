"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DndContext,
  closestCorners,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
  UniqueIdentifier,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Tabs,
  Tab,
  Paper,
  Button,
  Grid2,
  Typography,
  Stack,
  CircularProgress,
} from "@mui/material";
import { leadCategories } from "./data";
import LeadColumn from "./lead-column";
import LeadCard from "./lead-card";
import { Scrollbar } from "@/app/component/scrollbar";
import { LeadType } from "../lead/page";
import {
  deleteLead,
  fetchMoreLeads,
  updateLeadStatus,
} from "@/app/actions/server-actions";
import notify from "@/app/utils/toast";
import { useRouter } from "nextjs-toploader/app";
import { useSearchParams } from "next/navigation";
import EmptyState from "../../../(pages)/components/empty-state";

export default function LeadManagement({
  leads,
  hasMore,
  lastCreatedAt,
}: {
  leads: LeadType[];
  hasMore: boolean;
  lastCreatedAt: Date | null;
}) {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );

  const [currentHasMore, setCurrentHasMore] = useState<boolean>();
  const [currentLastCreated, setCurrentLastCreated] = useState<Date>();
  const [currentLeads, setCurrentLeads] = useState<LeadType[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [activeLead, setActiveLead] = useState<UniqueIdentifier | null>(null);
  const [updatingLeads, setUpdatingLeads] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (type) {
      setSelectedCategory(type);
    } else {
      setSelectedCategory("House Tour Leads");
    }
  }, [type]);

  // Drag-and-drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Handles lead movement between stages
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setUpdatingLeads(true);
    // Optimistically update the UI
    setCurrentLeads((prev) => {
      return prev.map((lead) =>
        lead._id === active.id
          ? { ...lead, status: over.id.toString().toLowerCase() }
          : lead
      );
    });

    // Perform the API update
    updateLeadStatus(
      over.id.toString().toLowerCase(),
      active.id.toString()
    ).then((result) => {
      if (result?.error) {
        setMessage(result.error);
      } else if (result?.message) {
        notify(result.message);
      }
    });

    setActiveLead(null);
    setUpdatingLeads(false);
  }, []);

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
    setCurrentHasMore(hasMore);
    if (lastCreatedAt) {
      setCurrentLastCreated(lastCreatedAt);
    }
  }, [leads, hasMore, lastCreatedAt]);

  const HandleLoadmore = useCallback(() => {
    if (selectedCategory && currentLastCreated) {
      fetchMoreLeads(selectedCategory, currentLastCreated).then((result) => {
        if (result?.error) setMessage(result.error);
        if (result?.data) {
          setCurrentLeads((prev) => [...prev, ...result.data.leads]);
          setCurrentHasMore(result.data.hasMore);
          if (result.data.lastCreatedAt) {
            setCurrentLastCreated(result.data.lastCreatedAt);
          }
        }
      });
    }
  }, [currentLastCreated, selectedCategory]);

  if (!selectedCategory) {
    return null;
  }

  return (
    <Paper sx={{ p: 2, overflowX: "auto" }}>
      {/* Top Bar */}
      <Grid2 container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Tabs
            value={selectedCategory}
            onChange={(_, value) => {
              const url = lastCreatedAt
                ? `/demo/dashboard/lead?lastCreatedAt=${currentLastCreated}&type=${value}`
                : `/demo/dashboard/lead?type=${value}`;
              router.push(url);
            }}
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
          >
            {Object.keys(leadCategories).map((category) => (
              <Tab key={category} label={category} value={category} />
            ))}
          </Tabs>
        </Grid2>
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

      {updatingLeads && (
        <Stack justifyContent={"cente"} alignItems={"center"}>
          <CircularProgress />
          <Typography variant="body2">Updating Status...</Typography>
        </Stack>
      )}

      {/* Kanban Board */}
      {currentLeads && currentLeads.length > 0 ? (
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
            {currentLeads.length > 0 && activeLead ? (
              <LeadCard
                lead={currentLeads.find((lead) => lead._id === activeLead)!}
                toggleSelection={() => {}}
                isSelected={false}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        <Stack justifyContent={"center"} alignItems={"center"}>
          <EmptyState
            title={`No ${selectedCategory.toLowerCase()}`}
            description="You will receive notifications about new leads."
          />
        </Stack>
      )}

      {currentHasMore && (
        <Button
          variant="contained"
          size="small"
          color="inherit"
          onClick={HandleLoadmore}
        >
          Load More Leads
        </Button>
      )}
    </Paper>
  );
}
