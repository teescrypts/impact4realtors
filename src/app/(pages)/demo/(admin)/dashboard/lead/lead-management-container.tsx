/**
 * Lead Management Container - Client Component
 *
 * Production-ready container that:
 * - Initializes Zustand store with server data
 * - Handles all mutations via server actions
 * - Optimistic updates for instant feedback
 * - Error handling with user notifications
 * - Manages all UI state
 */

"use client";

import { useEffect, useState, useTransition } from "react";
import { Box, Container, Typography, Alert, Snackbar } from "@mui/material";
import {
  createLead,
  bulkDeleteLeads,
  pauseLeadJourney,
  resumeLeadJourney,
  updateLeadStatus,
  deleteLead,
} from "@/app/actions/lead-actions";
import LeadDetailPanel from "../components/lead/lead-detail-panel";
import LeadTable from "../components/lead/lead-table";
import {
  useLeadStore,
  useFilteredAndSortedLeads,
} from "../components/lead/store/lead-store";
import {
  Lead,
  CreateLeadPayload,
  Tag,
  LeadCategory,
} from "../components/lead/types/lead.types";
import LeadToolbar from "../components/lead/lead-toolbar";
import AddLeadDialog from "../components/lead/add-lead-dialog";
import { useRouter } from "nextjs-toploader/app";
import LeadBoardView from "../components/lead/lead-board-view";

interface LeadManagementContainerProps {
  initialLeads: Lead[];
  initialTags: Tag[];
  initialCategory: LeadCategory;
  error?: string | null;
}

export default function LeadManagementContainer({
  initialLeads,
  initialTags,
  initialCategory,
  error: serverError,
}: LeadManagementContainerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  console.log(isPending);

  // Zustand store
  const {
    leads,
    tags,
    selectedCategory,
    viewMode,
    selectedLeads,
    filters,
    sort,
    detailPanelLeadId,
    setLeads,
    setTags,
    setViewMode,
    setSelectedCategory,
    setFilters,
    clearFilters,
    setSort,
    toggleLeadSelection,
    selectAllLeads,
    clearSelection,
    openDetailPanel,
    closeDetailPanel,
    updateLead: updateLeadInStore,
    removeLead: removeLeadFromStore,
  } = useLeadStore();

  const filteredAndSortedLeads = useFilteredAndSortedLeads();

  // UI State
  const [addLeadDialogOpen, setAddLeadDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // Find lead for detail panel
  const detailPanelLead = detailPanelLeadId
    ? leads.find((lead) => lead._id === detailPanelLeadId) || null
    : null;

  // Initialize store with server data
  useEffect(() => {
    setLeads(initialLeads);
    setTags(initialTags);
    setSelectedCategory(initialCategory);
  }, [
    initialLeads,
    initialTags,
    initialCategory,
    setLeads,
    setTags,
    setSelectedCategory,
  ]);

  // Show server error if any
  useEffect(() => {
    if (serverError) {
      showSnackbar(serverError, "error");
    }
  }, [serverError]);

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" = "success",
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // ============================================
  // ACTION HANDLERS
  // ============================================

  /**
   * Handle sort
   */
  const handleSort = (field: any) => {
    const newOrder =
      sort.field === field && sort.order === "asc" ? "desc" : "asc";
    setSort({ field, order: newOrder });
  };

  /**
   * Handle category change
   */
  const handleCategoryChange = (category: LeadCategory) => {
    setSelectedCategory(category);
    clearSelection();

    // Update URL
    startTransition(() => {
      router.push(`/demo/dashboard/lead?category=${category}`);
    });
  };

  /**
   * Handle create lead
   */
  const handleCreateLead = async (payload: CreateLeadPayload) => {
    try {
      const result = await createLead(payload);

      if (!result.success) {
        throw new Error(result.error);
      }

      // Optimistically add to store
      if (result.data) {
        setLeads([...leads, result.data]);
      }

      showSnackbar(result.message || "Lead created successfully", "success");

      // Refresh to get updated data with journey info
      startTransition(() => {
        router.refresh();
      });
    } catch (error: any) {
      showSnackbar(error.message || "Failed to create lead", "error");
      throw error; // Re-throw so dialog knows it failed
    }
  };

  /**
   * Handle update lead status (drag and drop or manual)
   */
  const handleUpdateStatus = async (leadId: string, newStatus: string) => {
    const lead = leads.find((l) => l._id === leadId);
    if (!lead) return;

    const oldStatus = lead.status;

    // Optimistic update
    updateLeadInStore(leadId, { status: newStatus });

    try {
      const result = await updateLeadStatus(leadId, newStatus, lead.category);

      if (!result.success) {
        // Rollback on error
        updateLeadInStore(leadId, { status: oldStatus });
        throw new Error(result.error);
      }

      showSnackbar(
        `Lead moved to "${newStatus}". Journey automation triggered!`,
        "success",
      );

      // Refresh to get updated journey info
      startTransition(() => {
        router.refresh();
      });
    } catch (error: any) {
      showSnackbar(error.message || "Failed to update lead status", "error");
    }
  };

  /**
   * Handle delete lead
   */
  const handleDeleteLead = async (leadId: string) => {
    const lead = leads.find((l) => l._id === leadId);
    if (!lead) return;

    if (!confirm("Are you sure you want to delete this lead?")) {
      return;
    }

    // Optimistic delete
    removeLeadFromStore(leadId);
    closeDetailPanel();

    try {
      const result = await deleteLead(leadId, lead.category);

      if (!result.success) {
        // Rollback on error
        setLeads([...leads, lead]);
        throw new Error(result.error);
      }

      showSnackbar(result.message || "Lead deleted successfully", "success");

      // Refresh
      startTransition(() => {
        router.refresh();
      });
    } catch (error: any) {
      showSnackbar(error.message || "Failed to delete lead", "error");
    }
  };

  /**
   * Handle bulk delete
   */
  const handleBulkDelete = async () => {
    if (selectedLeads.length === 0) return;

    if (
      !confirm(
        `Are you sure you want to delete ${selectedLeads.length} lead(s)?`,
      )
    ) {
      return;
    }

    const leadsToDelete = selectedLeads;
    const leadsCopy = [...leads];

    // Optimistic delete
    leadsToDelete.forEach((id) => removeLeadFromStore(id));
    clearSelection();

    try {
      const result = await bulkDeleteLeads(leadsToDelete, selectedCategory);

      if (!result.success) {
        // Rollback on error
        setLeads(leadsCopy);
        throw new Error(result.error);
      }

      showSnackbar(result.message || "Leads deleted successfully", "success");

      // Refresh
      startTransition(() => {
        router.refresh();
      });
    } catch (error: any) {
      showSnackbar(error.message || "Failed to delete leads", "error");
    }
  };

  /**
   * Handle pause journey
   */
  const handlePauseJourney = async (leadId: string) => {
    const lead = leads.find((l) => l._id === leadId);
    if (!lead || !lead.journeyProgress) return;

    try {
      const result = await pauseLeadJourney(leadId, lead.category);

      if (!result.success) {
        throw new Error(result.error);
      }

      showSnackbar(result.message || "Journey paused successfully", "success");

      // Refresh to get updated journey status
      startTransition(() => {
        router.refresh();
      });
    } catch (error: any) {
      showSnackbar(error.message || "Failed to pause journey", "error");
    }
  };

  /**
   * Handle resume journey
   */
  const handleResumeJourney = async (leadId: string) => {
    const lead = leads.find((l) => l._id === leadId);
    if (!lead || !lead.journeyProgress) return;

    try {
      const result = await resumeLeadJourney(leadId, lead.category);

      if (!result.success) {
        throw new Error(result.error);
      }

      showSnackbar(result.message || "Journey resumed successfully", "success");

      // Refresh to get updated journey status
      startTransition(() => {
        router.refresh();
      });
    } catch (error: any) {
      showSnackbar(error.message || "Failed to resume journey", "error");
    }
  };

  /**
   * Handle view journey (navigate to journey canvas)
   */
  const handleViewJourney = (journeyId: string) => {
    router.push(`/demo/dashboard/automations?journey=${journeyId}`);
  };

  /**
   * Handle email lead (placeholder)
   */
  const handleEmailLead = (leadId: string) => {
    console.log(leadId);
    showSnackbar("Email feature coming soon!", "info");
  };

  /**
   * Handle call lead (placeholder)
   */
  const handleCallLead = (leadId: string) => {
    console.log(leadId);
    showSnackbar("Call feature coming soon!", "info");
  };

  /**
   * Handle edit lead (placeholder)
   */
  const handleEditLead = (leadId: string) => {
    console.log(leadId);
    showSnackbar("Edit feature coming soon!", "info");
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        {/* Page Title */}
        <Typography variant="h4" sx={{ mb: 3 }}>
          Lead Management
        </Typography>

        {/* Toolbar */}
        <LeadToolbar
          selectedCategory={selectedCategory}
          viewMode={viewMode}
          filters={filters}
          selectedCount={selectedLeads.length}
          onCategoryChange={handleCategoryChange}
          onViewModeChange={setViewMode}
          onFilterChange={setFilters}
          onClearFilters={clearFilters}
          onAddLead={() => setAddLeadDialogOpen(true)}
          onBulkDelete={handleBulkDelete}
        />

        {/* Table View */}
        {viewMode === "table" && (
          <LeadTable
            leads={filteredAndSortedLeads}
            selectedLeads={selectedLeads}
            sort={sort}
            onSelectLead={toggleLeadSelection}
            onSelectAll={selectAllLeads}
            onSort={handleSort}
            onViewDetails={openDetailPanel}
            onEdit={handleEditLead}
            onEmail={handleEmailLead}
            onCall={handleCallLead}
            onDelete={handleDeleteLead}
            onViewJourney={handleViewJourney}
          />
        )}

        {/* Board View */}
        {viewMode === "board" && (
          <LeadBoardView
            leads={filteredAndSortedLeads}
            selectedCategory={selectedCategory}
            selectedLeads={selectedLeads}
            onSelectLead={toggleLeadSelection}
            onViewDetails={openDetailPanel}
            onDragEnd={handleUpdateStatus}
          />
        )}

        {/* List View - Coming Soon */}
        {viewMode === "list" && (
          <Box
            sx={{
              p: 4,
              textAlign: "center",
              bgcolor: "grey.50",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" color="text.secondary">
              List View Coming Soon
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Switch to Table or Board view for now
            </Typography>
          </Box>
        )}

        {/* Detail Panel */}
        <LeadDetailPanel
          lead={detailPanelLead}
          open={!!detailPanelLeadId}
          onClose={closeDetailPanel}
          onEdit={handleEditLead}
          onEmail={handleEmailLead}
          onCall={handleCallLead}
          onDelete={handleDeleteLead}
          onViewJourney={handleViewJourney}
          onPauseJourney={handlePauseJourney}
          onResumeJourney={handleResumeJourney}
        />

        {/* Add Lead Dialog */}
        <AddLeadDialog
          open={addLeadDialogOpen}
          onClose={() => setAddLeadDialogOpen(false)}
          onSubmit={handleCreateLead}
          tags={tags}
        />

        {/* Snackbar Notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}
