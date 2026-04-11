import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  InputLabel,
  Chip,
  Autocomplete,
  CircularProgress,
  Alert,
} from "@mui/material";
import User01 from "@/app/icons/untitled-ui/duocolor/user01";
import Loyalty from "@/app/icons/untitled-ui/duocolor/loyalty";
import Home from "@/app/icons/untitled-ui/duocolor/home";
import ArrowRight from "@/app/icons/untitled-ui/duocolor/arrow-right";
import { ContactType, IEntryAction, LeadIntent, TagActionType } from "./types/api";
import { ITag } from "../tag/types/tag";

// Lead intent options (matches backend exactly)
const LEAD_INTENTS: LeadIntent[] = [
  "House Tour",
  "Mortgage Inquiry",
  "Buyer Guide",
  "Sell Call Appointment",
  "Home valuation",
  "General Inquiry",
];

interface JourneyCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (
    name: string,
    contactType: ContactType,
    entryAction: IEntryAction,
    leadIntent: LeadIntent
  ) => void;
  loading?: boolean;
  tags: ITag[]; // ✅ Add tags prop
  tagsLoading?: boolean; // ✅ Add loading state
}

export function JourneyCreateDialog({
  isOpen,
  onClose,
  onCreate,
  loading = false,
  tags,
  tagsLoading = false,
}: JourneyCreateDialogProps) {
  const [name, setName] = useState("");
  const [contactType, setContactType] = useState<ContactType>("buyer");
  const [tagActionType, setTagActionType] = useState<TagActionType>("assign");
  const [tagName, setTagName] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [leadIntent, setLeadIntent] = useState<LeadIntent | "">("");

  // ✅ Filter tags by selected contactType
  const relevantTags = tags.filter((tag) => tag.category === contactType);
  const systemTags = relevantTags.filter((t) => t.isSystem);
  const customTags = relevantTags.filter((t) => !t.isSystem);

  const handleCreate = () => {
    if (!name.trim() || !tagName.trim() || !leadIntent) return;

    // Validate change action
    if (tagActionType === "change" && !newTagName.trim()) {
      alert("Please select a new tag for the change action");
      return;
    }

    const entryAction: IEntryAction = {
      tagAction: {
        type: tagActionType,
        tagName: tagName.trim(),
        ...(tagActionType === "change" && {
          newTagName: newTagName.trim(),
        }),
      },
    };

    onCreate(name.trim(), contactType, entryAction, leadIntent as LeadIntent);
    handleClose();
  };

  const handleClose = () => {
    setName("");
    setContactType("buyer");
    setTagActionType("assign");
    setTagName("");
    setNewTagName("");
    setLeadIntent("");
    onClose();
  };

  const isValid =
    name.trim() &&
    tagName.trim() &&
    leadIntent &&
    (tagActionType === "assign" || (tagActionType === "change" && newTagName.trim()));

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Journey</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          {/* Journey Name */}
          <TextField
            label="Journey Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., New Buyer Follow-up"
            fullWidth
            required
            autoFocus
          />

          {/* Contact Type */}
          <FormControl>
            <FormLabel>Contact Type</FormLabel>
            <RadioGroup
              value={contactType}
              onChange={(e) => {
                setContactType(e.target.value as ContactType);
                // Reset tag selections when contact type changes
                setTagName("");
                setNewTagName("");
              }}
            >
              <Stack direction="row" spacing={2}>
                <FormControlLabel
                  value="buyer"
                  control={<Radio />}
                  label={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <User01 />
                      <Typography>Buyer</Typography>
                    </Stack>
                  }
                />
                <FormControlLabel
                  value="seller"
                  control={<Radio />}
                  label={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Home />
                      <Typography>Seller</Typography>
                    </Stack>
                  }
                />
              </Stack>
            </RadioGroup>
          </FormControl>

          {/* Lead Intent */}
          <FormControl fullWidth>
            <InputLabel id="lead-intent-label">Lead Intent</InputLabel>
            <Select
              labelId="lead-intent-label"
              value={leadIntent}
              label="Lead Intent"
              onChange={(e) => setLeadIntent(e.target.value as LeadIntent)}
              required
            >
              {LEAD_INTENTS.map((intent) => (
                <MenuItem key={intent} value={intent}>
                  {intent}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Entry Trigger */}
          <Stack spacing={2}>
            <Typography variant="subtitle2" fontWeight={600}>
              Entry Trigger
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Define what action triggers this journey to start
            </Typography>

            <FormControl>
              <FormLabel>Tag Action</FormLabel>
              <RadioGroup
                value={tagActionType}
                onChange={(e) => {
                  setTagActionType(e.target.value as TagActionType);
                  setNewTagName(""); // Reset new tag when switching
                }}
              >
                <FormControlLabel
                  value="assign"
                  control={<Radio />}
                  label={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Loyalty />
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          Assign Tag
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Trigger when a specific tag is assigned to a contact
                        </Typography>
                      </Box>
                    </Stack>
                  }
                />
                <FormControlLabel
                  value="change"
                  control={<Radio />}
                  label={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <ArrowRight />
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          Change Tag
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Trigger when a tag is changed from one value to another
                        </Typography>
                      </Box>
                    </Stack>
                  }
                />
              </RadioGroup>
            </FormControl>

            {/* ✅ Dynamic Tag Selection */}
            <Stack spacing={2} pl={2}>
              {tagsLoading ? (
                <Box display="flex" justifyContent="center" py={2}>
                  <CircularProgress size={24} />
                </Box>
              ) : relevantTags.length === 0 ? (
                <Alert severity="warning">
                  No tags available for {contactType}s. Please create tags in Tag
                  Management first.
                </Alert>
              ) : (
                <>
                  {/* Tag count info */}
                  <Stack direction="row" spacing={1}>
                    <Chip
                      label={`${systemTags.length} System Tags`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={`${customTags.length} Custom Tags`}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  </Stack>

                  {/* First Tag Select (Assign tag OR Original tag) */}
                  <Autocomplete
                    options={relevantTags}
                    getOptionLabel={(tag) => tag.name}
                    groupBy={(tag) =>
                      tag.isSystem
                        ? "📋 System Pipeline Stages"
                        : "🏷️ Your Custom Tags"
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={
                          tagActionType === "assign" ? "Tag to Assign" : "Original Tag"
                        }
                        placeholder="Select a tag..."
                        required
                      />
                    )}
                    renderOption={(props, tag) => {
                      const { key, ...otherProps } = props;
                      return (
                        <li key={key} {...otherProps}>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            width="100%"
                          >
                            <Chip
                              label={tag.name}
                              size="small"
                              sx={{
                                bgcolor: tag.isSystem ? "primary.50" : "secondary.50",
                                color: tag.isSystem ? "primary.main" : "secondary.main",
                                fontWeight: 500,
                              }}
                            />
                            {tag.isSystem && (
                              <Chip
                                label="System"
                                size="small"
                                sx={{
                                  height: 18,
                                  fontSize: "0.65rem",
                                  bgcolor: "primary.100",
                                  color: "primary.dark",
                                }}
                              />
                            )}
                          </Stack>
                        </li>
                      );
                    }}
                    value={relevantTags.find((t) => t.name === tagName) || null}
                    onChange={(_, tag) => setTagName(tag?.name || "")}
                    isOptionEqualToValue={(option, value) =>
                      option.name === value.name
                    }
                  />

                  {/* Second Tag Select (for change action) */}
                  {tagActionType === "change" && (
                    <Autocomplete
                      options={relevantTags.filter((tag) => tag.name !== tagName)}
                      getOptionLabel={(tag) => tag.name}
                      groupBy={(tag) =>
                        tag.isSystem
                          ? "📋 System Pipeline Stages"
                          : "🏷️ Your Custom Tags"
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="New Tag"
                          placeholder="Select new tag..."
                          required
                        />
                      )}
                      renderOption={(props, tag) => {
                        const { key, ...otherProps } = props;
                        return (
                          <li key={key} {...otherProps}>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                              width="100%"
                            >
                              <Chip
                                label={tag.name}
                                size="small"
                                sx={{
                                  bgcolor: "success.50",
                                  color: "success.main",
                                  fontWeight: 500,
                                }}
                              />
                              {tag.isSystem && (
                                <Chip
                                  label="System"
                                  size="small"
                                  sx={{
                                    height: 18,
                                    fontSize: "0.65rem",
                                    bgcolor: "primary.100",
                                    color: "primary.dark",
                                  }}
                                />
                              )}
                            </Stack>
                          </li>
                        );
                      }}
                      value={relevantTags.find((t) => t.name === newTagName) || null}
                      onChange={(_, tag) => setNewTagName(tag?.name || "")}
                      isOptionEqualToValue={(option, value) =>
                        option.name === value.name
                      }
                    />
                  )}
                </>
              )}
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined" disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          disabled={!isValid || loading || tagsLoading}
        >
          {loading ? "Creating..." : "Create Journey"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
