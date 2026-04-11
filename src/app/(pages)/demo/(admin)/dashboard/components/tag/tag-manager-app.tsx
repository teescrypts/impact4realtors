"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Stack,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { TagSection } from "./tag-sections";
import ArrowBack from "@/app/icons/untitled-ui/duocolor/arrow-back";
import Settings from "@/app/icons/untitled-ui/duocolor/settings";
import Users03 from "@/app/icons/untitled-ui/duocolor/users-03";
import HomeSmile from "@/app/icons/untitled-ui/duocolor/home-smile";
import { TagCategory } from "./types/tag";
import {
  useTagMutations,
  useTags,
  useTagsByCategory,
} from "./interfaces/hooks/use-tags";
import { useRouter } from "nextjs-toploader/app";

export default function TagManagementPage() {
  const [tab, setTab] = useState<TagCategory>("buyer");
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const router = useRouter();

  // Fetch tags
  const { tags, loading, error, refetch } = useTags();
  const mutations = useTagMutations();

  // Filter tags by category
  const buyerTags = useTagsByCategory(tags, "buyer");
  const sellerTags = useTagsByCategory(tags, "seller");
  const activeTags = tab === "buyer" ? buyerTags : sellerTags;

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info",
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  /* -------------------- Actions -------------------- */

  const handleAddTag = async (category: TagCategory, name: string) => {
    try {
      await mutations.create({ name, category });
      showSnackbar(`Tag "${name}" created successfully`, "success");
      refetch();
    } catch (err: any) {
      showSnackbar(err.message || "Failed to create tag", "error");
    }
  };

  const handleRenameTag = async (tagId: string, newName: string) => {
    try {
      await mutations.update(tagId, { name: newName });
      showSnackbar("Tag renamed successfully", "success");
      refetch();
    } catch (err: any) {
      showSnackbar(err.message || "Failed to rename tag", "error");
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    const tag = tags.find((t) => t._id === tagId);
    if (!tag) return;

    // Confirm deletion
    if (
      !window.confirm(
        `Are you sure you want to delete "${tag.name}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      await mutations.delete(tagId);
      showSnackbar(`Tag "${tag.name}" deleted successfully`, "success");
      refetch();
    } catch (err: any) {
      // Handle specific error for tags in use
      if (err.message.includes("in use")) {
        showSnackbar(
          "Cannot delete tag: It is currently assigned to leads. Please reassign those leads first.",
          "error",
        );
      } else if (err.message.includes("System tags")) {
        showSnackbar("System tags cannot be deleted", "error");
      } else {
        showSnackbar(err.message || "Failed to delete tag", "error");
      }
    }
  };

  /* -------------------- Render -------------------- */

  // Loading state
  if (loading && tags.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography color="text.secondary">Loading tags...</Typography>
        </Stack>
      </Box>
    );
  }

  // Error state
  if (error && tags.length === 0) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box minHeight="100vh" bgcolor="background.default">
      {/* Header */}
      <Box
        position="sticky"
        top={0}
        zIndex={10}
        sx={{
          backdropFilter: "blur(8px)",
          backgroundColor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Container>
          <Stack direction="row" spacing={2} alignItems="center" py={2}>
            <IconButton onClick={() => router.push("/demo/dashboard/automations")}>
              <ArrowBack />
            </IconButton>

            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                width={40}
                height={40}
                borderRadius={2}
                display="flex"
                alignItems="center"
                justifyContent="center"
                bgcolor="primary.main"
                color="primary.contrastText"
              >
                <Settings />
              </Box>

              <Box>
                <Typography fontWeight={700}>Tag Management</Typography>
                <Typography variant="body2" color="text.secondary">
                  Configure pipeline stages for buyers and sellers
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Content */}
      <Container sx={{ py: 4 }}>
        {/* Info Alert */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <strong>System Tags</strong> are built-in pipeline stages that cannot
          be edited or deleted. You can add your own{" "}
          <strong>Custom Tags</strong> to extend the pipeline.
        </Alert>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 4 }}>
          <Tab
            value="buyer"
            label={
              <Stack direction="row" spacing={1} alignItems="center">
                <Users03 />
                <span>Buyer Pipeline ({buyerTags.length})</span>
              </Stack>
            }
          />
          <Tab
            value="seller"
            label={
              <Stack direction="row" spacing={1} alignItems="center">
                <HomeSmile />
                <span>Seller Pipeline ({sellerTags.length})</span>
              </Stack>
            }
          />
        </Tabs>

        <TagSection
          category={tab}
          tags={activeTags}
          onAddTag={(name) => handleAddTag(tab, name)}
          onRenameTag={handleRenameTag}
          onDeleteTag={handleDeleteTag}
          loading={mutations.loading}
        />
      </Container>

      {/* Snackbar for notifications */}
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
    </Box>
  );
}
