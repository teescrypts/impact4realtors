"use client";

import { useEffect, useState } from "react";
import {
  Paper,
  Stack,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import notify from "@/app/utils/toast";
import { LeadType } from "../lead/page";
import useLeadData from "@/app/hooks/use-lead-data";
import useLeadDragDrop from "@/app/hooks/use-lead-drag-drop";
import LeadToolbar from "./lead-toolbar";
import LeadBoard from "./leadboard";
import LeadEmptyState from "./lead-empty-state";
import AddLeadDialog from "./add-lead-dialogue";

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
  const router = useRouter();
  const type = searchParams.get("type");

  const {
    currentLeads,
    selectedCategory,
    selectedLeads,
    updatingLeads,
    currentHasMore,
    message,
    HandleLoadmore,
    toggleLeadSelection,
    handleBulkDelete,
    setSelectedCategory,
  } = useLeadData({ leads, hasMore, lastCreatedAt, notify });

  const { sensors, handleDragEnd, activeLead, setActiveLead } = useLeadDragDrop(
    {
      setUpdatingLeads: updatingLeads.set,
      setCurrentLeads: currentLeads.set,
      notify,
    }
  );

  useEffect(() => {
    setSelectedCategory(type || "House Tour Leads");
  }, [type, setSelectedCategory]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Paper sx={{ p: 2, overflowX: "auto" }}>
        {/* Toolbar */}
        <LeadToolbar
          selectedCategory={selectedCategory.value}
          selectedLeads={selectedLeads.value}
          setSelectedCategory={(value: string) =>
            router.push(`/demo/agent/dashboard/lead?type=${value}`)
          }
          handleBulkDelete={handleBulkDelete}
          onAddNewLead={handleOpen}
        />

        {message && (
          <Typography variant="subtitle2" color="red" textAlign="center">
            {message}
          </Typography>
        )}

        {updatingLeads.value && (
          <Stack justifyContent="center" alignItems="center">
            <CircularProgress />
            <Typography variant="body2">Updating Status...</Typography>
          </Stack>
        )}

        {currentLeads.value?.length > 0 ? (
          <LeadBoard
            selectedCategory={selectedCategory.value}
            leads={currentLeads.value}
            sensors={sensors}
            activeLead={activeLead}
            setActiveLead={setActiveLead}
            handleDragEnd={handleDragEnd}
            toggleSelection={toggleLeadSelection}
            selectedLeads={selectedLeads.value}
          />
        ) : (
          <LeadEmptyState category={selectedCategory.value} />
        )}

        {currentHasMore.value && (
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

      <AddLeadDialog open={open} onClose={handleClose} />
    </>
  );
}
