"use client";

import { useState, useEffect } from "react";
import { Box, CircularProgress, Alert, Snackbar } from "@mui/material";
import { JourneyList } from "./journey-list";
import { JourneyHeader } from "./canvas/journey-header";
import { JourneyCanvas } from "./canvas/journey-canvas";
import { useJourneyStore } from "./canvas/journey-store";
import { useJourneyMutations, useJourneys } from "./hooks/use-journeys";
import { ContactType } from "./type";
import { IEntryAction, LeadIntent } from "./types/api";
import { apiToCanvas, canvasToApi } from "./utils/transformers";
import { useTags } from "../tag/interfaces/hooks/use-tags";

type View = "list" | "canvas";

const AutomationPage = ({ ijourneyd }: { ijourneyd?: string }) => {
  const [currentView, setCurrentView] = useState<View>(
    ijourneyd ? "canvas" : "list",
  );
  const [selectedJourneyId, setSelectedJourneyId] = useState<string | null>(
    ijourneyd ? ijourneyd : null,
  );
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // API hooks
  const { journeys, loading, error, refetch } = useJourneys();
  const mutations = useJourneyMutations();

  // ✅ Fetch tags
  const { tags, loading: tagsLoading } = useTags();

  // Canvas store - get methods
  const loadJourney = useJourneyStore((state) => state.loadJourney);
  const canvasJourney = useJourneyStore((state) => state.journey);

  const selectedJourney = journeys.find((j) => j._id === selectedJourneyId);

  // Load journey into canvas when selected
  useEffect(() => {
    if (selectedJourney && currentView === "canvas") {
      console.log("Transforming journey for canvas:", selectedJourney);

      // Transform API journey to canvas format
      const canvasFormat = apiToCanvas(selectedJourney);
      console.log("Canvas format:", canvasFormat);

      // Load into canvas store
      loadJourney(canvasFormat);
    }
  }, [selectedJourney, currentView, loadJourney]);

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleView = (id: string) => {
    setSelectedJourneyId(id);
    setCurrentView("canvas");
  };

  const handleEdit = (id: string) => {
    setSelectedJourneyId(id);
    setCurrentView("canvas");
  };

  const handleToggle = async (id: string) => {
    const journey = journeys.find((j) => j._id === id);
    if (!journey) return;

    try {
      if (journey.isActive) {
        await mutations.deactivate(id);
        showSnackbar("Journey deactivated successfully", "success");
      } else {
        await mutations.activate(id);
        showSnackbar("Journey activated successfully", "success");
      }
      refetch();
    } catch (err: any) {
      showSnackbar(err.message || "Failed to toggle journey", "error");
    }
  };

  const handleBack = () => {
    setCurrentView("list");
    setSelectedJourneyId(null);
  };

  const handleCreateNew = async (
    name: string,
    contactType: ContactType,
    entryAction: IEntryAction,
    leadIntent: LeadIntent,
  ) => {
    try {
      const newJourney = await mutations.create({
        name,
        contactType,
        leadIntent,
        entryAction,
        // Create default entry node
        nodes: [
          {
            id: "entry_1",
            type: "entry",
            config: { type: "entry" },
          },
        ],
        edges: [],
        entryNodeId: "entry_1",
      });

      showSnackbar("Journey created successfully", "success");
      setSelectedJourneyId(newJourney._id);
      setCurrentView("canvas");
      refetch();
    } catch (err: any) {
      showSnackbar(err.message || "Failed to create journey", "error");
    }
  };

  const handleSaveCanvas = async () => {
    if (!selectedJourneyId || !selectedJourney) return;

    try {
      console.log("Saving canvas journey:", canvasJourney);

      // Transform canvas to API format
      const updates = canvasToApi(canvasJourney, selectedJourney);
      console.log("API format:", updates);

      await mutations.update(selectedJourneyId, updates);
      showSnackbar("Journey saved successfully", "success");
      refetch();
    } catch (err: any) {
      showSnackbar(err.message || "Failed to save journey", "error");
    }
  };

  const handleDeleteJourney = async (id: string) => {
    if (!confirm("Are you sure you want to delete this journey?")) return;

    try {
      await mutations.delete(id, false);
      showSnackbar("Journey deleted successfully", "success");
      if (selectedJourneyId === id) {
        handleBack();
      }
      refetch();
    } catch (err: any) {
      // If there are active progresses, ask if they want to force delete
      if (err.message.includes("active progresses")) {
        if (
          confirm(
            "This journey has active leads. Do you want to force delete and cancel all progresses?",
          )
        ) {
          try {
            await mutations.delete(id, true);
            showSnackbar("Journey force deleted successfully", "success");
            if (selectedJourneyId === id) {
              handleBack();
            }
            refetch();
          } catch (forceErr: any) {
            showSnackbar(
              forceErr.message || "Failed to delete journey",
              "error",
            );
          }
        }
      } else {
        showSnackbar(err.message || "Failed to delete journey", "error");
      }
    }
  };

  const handleDuplicateJourney = async (id: string) => {
    try {
      const duplicated = await mutations.duplicate(id);
      showSnackbar(`Journey duplicated: ${duplicated.name}`, "success");
      refetch();
    } catch (err: any) {
      showSnackbar(err.message || "Failed to duplicate journey", "error");
    }
  };

  // Loading state
  if (loading && journeys.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error && journeys.length === 0) {
    return (
      <Box p={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // Canvas view
  if (currentView === "canvas" && selectedJourney) {
    return (
      <>
        <JourneyHeader
          journey={selectedJourney}
          onBack={handleBack}
          onSave={handleSaveCanvas}
          onActivate={() => handleToggle(selectedJourney._id)}
          onDelete={() => handleDeleteJourney(selectedJourney._id)}
          saving={mutations.loading}
        />
        {/* ✅ Pass tags to canvas */}
        <JourneyCanvas
          journey={selectedJourney}
          tags={tags}
          tagsLoading={tagsLoading}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </>
    );
  }

  // List view
  return (
    <>
      <JourneyList
        journeys={journeys}
        onView={handleView}
        onEdit={handleEdit}
        onToggle={handleToggle}
        onCreateNew={handleCreateNew}
        onDelete={handleDeleteJourney}
        onDuplicate={handleDuplicateJourney}
        loading={mutations.loading}
        tags={tags} // ✅ Pass tags for entry action dialog
        tagsLoading={tagsLoading}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AutomationPage;
