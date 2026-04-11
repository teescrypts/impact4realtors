"use client";

import { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  TextField,
  Paper,
  Chip,
  Tooltip,
} from "@mui/material";
import CheckDone01 from "@/app/icons/untitled-ui/duocolor/check-done-01";
import Close from "@/app/icons/untitled-ui/duocolor/close";
import Edit from "@/app/icons/untitled-ui/duocolor/edit";
import Delete from "@/app/icons/untitled-ui/duocolor/delete";
import { ITag } from "./types/tag";
import Lock01 from "@/app/icons/untitled-ui/duocolor/lock-01";

interface TagCardProps {
  tag: ITag;
  index: number;
  totalTags: number;
  onRename: (newName: string) => void;
  onDelete: () => void;
}

export function TagCard({
  tag,
  index,
  totalTags,
  onRename,
  onDelete,
}: TagCardProps) {
  console.log(totalTags)
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(tag.name);

  const isBuyer = tag.category === "buyer";
  const accentColor = isBuyer ? "#2563eb" : "#9333ea";

  const handleSave = () => {
    if (!editValue.trim()) return;
    onRename(editValue.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(tag.name);
    setIsEditing(false);
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        borderRadius: 2,
        borderLeft: "4px solid",
        borderLeftColor: accentColor,
        bgcolor: tag.isSystem ? "action.hover" : "background.paper",
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: 3,
          borderColor: accentColor,
          "& .tag-actions": {
            opacity: 1,
          },
        },
      }}
    >
      {/* Order Badge */}
      <Box
        sx={{
          height: 32,
          width: 32,
          borderRadius: "50%",
          bgcolor: tag.isSystem ? "action.selected" : "action.hover",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          fontWeight: 600,
          color: "text.secondary",
          flexShrink: 0,
        }}
      >
        {index + 1}
      </Box>

      {/* Tag Name */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {isEditing ? (
          <Stack direction="row" spacing={0.5} alignItems="center">
            <TextField
              size="small"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
              autoFocus
              sx={{ flex: 1 }}
            />

            <IconButton
              size="small"
              onClick={handleSave}
              sx={{ color: "success.main" }}
            >
              <CheckDone01 />
            </IconButton>

            <IconButton
              size="small"
              onClick={handleCancel}
              sx={{ color: "text.secondary" }}
            >
              <Close />
            </IconButton>
          </Stack>
        ) : (
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography fontWeight={500} noWrap title={tag.name}>
              {tag.name}
            </Typography>
            
            {/* System Tag Badge */}
            {tag.isSystem && (
              <Tooltip title="System tag - Cannot be edited or deleted">
                <Chip
                  icon={<Lock01 />}
                  label="System"
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    bgcolor: "primary.50",
                    color: "primary.main",
                    "& .MuiChip-icon": {
                      fontSize: 14,
                      marginLeft: "4px",
                    },
                  }}
                />
              </Tooltip>
            )}
          </Stack>
        )}
      </Box>

      {/* Actions */}
      {!isEditing && !tag.isSystem && (
        <Stack
          direction="row"
          spacing={0.5}
          className="tag-actions"
          sx={{
            opacity: 0,
            transition: "opacity 0.2s ease",
          }}
        >
          <Tooltip title="Edit tag name">
            <IconButton size="small" onClick={() => setIsEditing(true)}>
              <Edit />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete tag">
            <IconButton
              size="small"
              onClick={onDelete}
              sx={{
                color: "error.main",
                "&:hover": { color: "error.dark" },
              }}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Stack>
      )}

      {/* System tag - show lock icon instead of actions */}
      {!isEditing && tag.isSystem && (
        <Tooltip title="System tags are read-only">
          <IconButton size="small" disabled>
            <Lock01 />
          </IconButton>
        </Tooltip>
      )}
    </Paper>
  );
}
