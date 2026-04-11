"use client";

import { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  TextField,
  Paper,
  Divider,
  Chip,
  Alert,
} from "@mui/material";
import { TagCard } from "./tag-card";
import User01 from "@/app/icons/untitled-ui/duocolor/user01";
import HomeSmile from "@/app/icons/untitled-ui/duocolor/home-smile";
import Add from "@/app/icons/untitled-ui/duocolor/add";
import { ITag, TagCategory } from "./types/tag";

interface TagSectionProps {
  category: TagCategory;
  tags: ITag[];
  onAddTag: (name: string) => void;
  onRenameTag: (tagId: string, newName: string) => void;
  onDeleteTag: (tagId: string) => void;
  loading?: boolean;
}

export function TagSection({
  category,
  tags,
  onAddTag,
  onRenameTag,
  onDeleteTag,
  loading = false,
}: TagSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  const isBuyer = category === "buyer";
  const Icon = isBuyer ? User01 : HomeSmile;

  const title = isBuyer ? "Buyer Pipeline" : "Seller Pipeline";
  const description = isBuyer
    ? "Track buyer journey from lead to closing"
    : "Track seller journey from listing to sold";

  const accentColor = isBuyer ? "#2563eb" : "#9333ea";
  const softBg = isBuyer ? "rgba(37,99,235,0.08)" : "rgba(147,51,234,0.08)";

  // Separate system and custom tags
  const systemTags = tags.filter((t) => t.isSystem);
  const customTags = tags.filter((t) => !t.isSystem);

  const handleAdd = () => {
    if (!newTagName.trim()) return;
    onAddTag(newTagName.trim());
    setNewTagName("");
    setIsAdding(false);
  };

  return (
    <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          p: 2,
          backgroundColor: softBg,
        }}
      >
        <Box
          sx={{
            height: 40,
            width: 40,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: accentColor,
            color: "#fff",
          }}
        >
          <Icon />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography fontWeight={600}>{title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Chip
            label={`${systemTags.length} system`}
            size="small"
            sx={{
              bgcolor: "primary.50",
              color: "primary.main",
              fontWeight: 500,
            }}
          />
          <Chip
            label={`${customTags.length} custom`}
            size="small"
            sx={{
              bgcolor: softBg,
              color: accentColor,
              fontWeight: 500,
            }}
          />
        </Stack>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2 }}>
        {/* System Tags Info */}
        {systemTags.length > 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <strong>{systemTags.length} System Tags</strong> - These are
            built-in pipeline stages that cannot be edited or deleted. You can
            reorder them and add custom tags below.
          </Alert>
        )}

        {tags.length === 0 ? (
          <Stack spacing={1} alignItems="center" py={6}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: "50%",
                bgcolor: "action.hover",
              }}
            >
              <Icon />
            </Box>
            <Typography variant="body2" color="text.secondary">
              No stages defined yet
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Add your first stage to get started
            </Typography>
          </Stack>
        ) : (
          <>
            {/* All Tags (System + Custom) */}
            <Stack spacing={1}>
              {tags.map((tag, index) => (
                <TagCard
                  key={tag._id}
                  tag={tag}
                  index={index}
                  totalTags={tags.length}
                  onRename={(name) => onRenameTag(tag._id, name)}
                  onDelete={() => onDeleteTag(tag._id)}
                />
              ))}
            </Stack>
          </>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Add Custom Tag */}
        <Typography
          variant="caption"
          fontWeight={600}
          textTransform="uppercase"
          color="text.secondary"
          sx={{ mb: 1, display: "block" }}
        >
          Add Custom Tag
        </Typography>

        {isAdding ? (
          <Stack direction="row" spacing={1}>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter custom tag name…"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd();
                if (e.key === "Escape") {
                  setNewTagName("");
                  setIsAdding(false);
                }
              }}
              autoFocus
              disabled={loading}
            />

            <Button
              variant="contained"
              onClick={handleAdd}
              disabled={!newTagName.trim() || loading}
            >
              Add
            </Button>

            <Button
              variant="text"
              onClick={() => {
                setNewTagName("");
                setIsAdding(false);
              }}
              disabled={loading}
            >
              Cancel
            </Button>
          </Stack>
        ) : (
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Add />}
            onClick={() => setIsAdding(true)}
            disabled={loading}
            sx={{
              borderStyle: "dashed",
              color: accentColor,
              borderColor: accentColor,
              "&:hover": {
                borderColor: accentColor,
                backgroundColor: softBg,
              },
            }}
          >
            Add Custom Tag
          </Button>
        )}
      </Box>
    </Paper>
  );
}
