import { useState } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  Grid2,
} from "@mui/material";
import { JourneyCard } from "./journey-card";
import { JourneyCreateDialog } from "./journey-create-dialog";
import Add from "@/app/icons/untitled-ui/duocolor/add";
import Settings from "@/app/icons/untitled-ui/duocolor/settings";
import { useRouter } from "nextjs-toploader/app";
import EmptyState from "@/app/(pages)/demo/(pages)/components/empty-state";
import { ContactType, IEntryAction, IJourney, LeadIntent } from "./types/api";
import Search from "@/app/icons/untitled-ui/duocolor/search";
import { ITag } from "../tag/types/tag";

interface JourneyListProps {
  journeys: IJourney[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onCreateNew: (
    name: string,
    contactType: ContactType,
    entryAction: IEntryAction,
    leadIntent: LeadIntent,
  ) => void;
  tags: ITag[];
  tagsLoading: boolean;
  loading?: boolean;
}

export function JourneyList({
  journeys,
  onView,
  onEdit,
  onToggle,
  onDelete,
  onDuplicate,
  onCreateNew,
  loading = false,
  tags,
  tagsLoading,
}: JourneyListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "buyer" | "seller">(
    "all",
  );
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "draft">(
    "all",
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const router = useRouter();

  // Filter journeys
  const filteredJourneys = journeys.filter((journey) => {

    const matchesSearch =
      journey.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      journey.entryAction.tagAction.tagName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (journey.leadIntent?.toLowerCase() || "").includes(
        searchQuery.toLowerCase(),
      ); // ✅ Handle null

    const matchesType =
      filterType === "all" || journey.contactType === filterType;

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && journey.isActive && !journey.isDraft) ||
      (filterStatus === "draft" && journey.isDraft);

    return matchesSearch && matchesType && matchesStatus;
  });

  // Count by status
  const activeCount = journeys.filter((j) => j.isActive && !j.isDraft).length;
  const draftCount = journeys.filter((j) => j.isDraft).length;

  const handleCreate = (
    name: string,
    contactType: ContactType,
    entryAction: IEntryAction,
    leadIntent: LeadIntent,
  ) => {
    onCreateNew(name, contactType, entryAction, leadIntent);
    setIsCreateDialogOpen(false);
  };

  return (
    <Box minHeight="100vh" bgcolor="background.default">
      {/* Header */}
      <Box
        component="header"
        bgcolor="background.paper"
        borderBottom={1}
        borderColor="divider"
      >
        <Stack maxWidth="xl" mx="auto" px={3} py={4} spacing={3}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h4" fontWeight={600}>
                Journeys
              </Typography>
              <Typography color="text.secondary">
                Automate your follow-up sequences for buyers and sellers
              </Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<Settings />}
                onClick={() => router.push("/demo/dashboard/automations/tags")}
              >
                Manage tags
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setIsCreateDialogOpen(true)}
                disabled={loading}
              >
                New Journey
              </Button>
            </Stack>
          </Stack>

          {/* Filters */}
          <Stack direction="row" spacing={2} alignItems="center">
            {/* Search */}
            <TextField
              size="small"
              placeholder="Search journeys..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ minWidth: 300 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* Contact Type Filter */}
            <ToggleButtonGroup
              size="small"
              value={filterType}
              exclusive
              onChange={(_, value) => value && setFilterType(value)}
            >
              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value="buyer">Buyers</ToggleButton>
              <ToggleButton value="seller">Sellers</ToggleButton>
            </ToggleButtonGroup>

            {/* Status Filter */}
            <ToggleButtonGroup
              size="small"
              value={filterStatus}
              exclusive
              onChange={(_, value) => value && setFilterStatus(value)}
            >
              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value="active">
                Active
                {activeCount > 0 && (
                  <Chip
                    label={activeCount}
                    size="small"
                    sx={{ ml: 1, height: 20 }}
                  />
                )}
              </ToggleButton>
              <ToggleButton value="draft">
                Drafts
                {draftCount > 0 && (
                  <Chip
                    label={draftCount}
                    size="small"
                    sx={{ ml: 1, height: 20 }}
                  />
                )}
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Stack>
      </Box>

      {/* Journey grid */}
      <Box maxWidth="xl" mx="auto" px={3} py={6}>
        {filteredJourneys.length === 0 ? (
          <Stack alignItems="center" py={12} spacing={3}>
            <EmptyState
              title={
                searchQuery
                  ? "No journeys found"
                  : journeys.length === 0
                    ? "No journeys yet"
                    : "No journeys match your filters"
              }
              description={
                searchQuery
                  ? "Try adjusting your search query"
                  : journeys.length === 0
                    ? "Create your first automation journey"
                    : "Try changing your filters"
              }
            />

            {journeys.length === 0 && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setIsCreateDialogOpen(true)}
                disabled={loading}
              >
                Create Journey
              </Button>
            )}
          </Stack>
        ) : (
          <Grid2 container spacing={3}>
            {filteredJourneys.map((journey) => (
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={journey._id}>
                <JourneyCard
                  journey={journey}
                  onView={onView}
                  onEdit={onEdit}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onDuplicate={onDuplicate}
                />
              </Grid2>
            ))}
          </Grid2>
        )}
      </Box>

      {/* Create Dialog */}
      <JourneyCreateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreate={handleCreate}
        loading={loading}
        tags={tags}
        tagsLoading={tagsLoading}
      />
    </Box>
  );
}
