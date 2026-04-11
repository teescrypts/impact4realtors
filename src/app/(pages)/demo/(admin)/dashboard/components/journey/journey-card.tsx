import { useState } from "react";
import {
  Paper,
  Stack,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Box,
  Chip,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import LoadMore from "@/app/icons/untitled-ui/duocolor/load-more";
import Edit from "@/app/icons/untitled-ui/duocolor/edit";
import Visibility from "@/app/icons/untitled-ui/duocolor/visibility";
import Copy from "@/app/icons/untitled-ui/duocolor/copy";
import Play from "@/app/icons/untitled-ui/duocolor/play";
import Pause from "@/app/icons/untitled-ui/duocolor/pause";
import { IJourney } from "./types/api";
import Delete from "@/app/icons/untitled-ui/duocolor/delete";

interface JourneyCardProps {
  journey: IJourney;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

export function JourneyCard({
  journey,
  onView,
  onEdit,
  onToggle,
  onDelete,
  onDuplicate,
}: JourneyCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleAction = (action: () => void) => {
    handleMenuClose();
    action();
  };

  // Get status label and color
  const getStatusInfo = () => {
    if (journey.isDraft) {
      return { label: "Draft", color: "default" as const };
    }
    if (journey.isActive) {
      return { label: "Active", color: "success" as const };
    }
    return { label: "Inactive", color: "warning" as const };
  };

  const statusInfo = getStatusInfo();

  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        transition: "all 0.2s",
        cursor: "pointer",
        "&:hover": {
          boxShadow: 6,
          borderColor: "primary.main",
        },
      }}
      onClick={() => onView(journey._id)}
    >
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={2}
      >
        <Box flex={1} minWidth={0}>
          <Typography variant="h6" noWrap mb={1}>
            {journey.name}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={0.5}>
            {/* Contact Type */}
            <Chip
              label={journey.contactType === "buyer" ? "Buyer" : "Seller"}
              size="small"
              color={journey.contactType === "buyer" ? "primary" : "secondary"}
              variant="outlined"
            />
            {/* Status */}
            <Chip
              label={statusInfo.label}
              size="small"
              color={statusInfo.color}
            />
            {/* Lead Intent */}
            <Chip label={journey.leadIntent} size="small" variant="outlined" />
          </Stack>
        </Box>

        {/* Menu */}
        <IconButton size="small" onClick={handleMenuOpen} sx={{ ml: 1 }}>
          <LoadMore />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem onClick={() => handleAction(() => onView(journey._id))}>
            <ListItemIcon>
              <Visibility fontSize="small" />
            </ListItemIcon>
            <ListItemText>View</ListItemText>
          </MenuItem>

          <MenuItem onClick={() => handleAction(() => onEdit(journey._id))}>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>

          <Divider />

          <MenuItem onClick={() => handleAction(() => onToggle(journey._id))}>
            <ListItemIcon>
              {journey.isActive ? (
                <Pause fontSize="small" />
              ) : (
                <Play fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemText>
              {journey.isActive ? "Deactivate" : "Activate"}
            </ListItemText>
          </MenuItem>

          {onDuplicate && (
            <MenuItem
              onClick={() => handleAction(() => onDuplicate(journey._id))}
            >
              <ListItemIcon>
                <Copy fontSize="small" />
              </ListItemIcon>
              <ListItemText>Duplicate</ListItemText>
            </MenuItem>
          )}

          {onDelete && (
            <Box>
              <Divider />
              <MenuItem
                onClick={() => handleAction(() => onDelete(journey._id))}
                sx={{ color: "error.main" }}
              >
                <ListItemIcon>
                  <Delete fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText>Delete</ListItemText>
              </MenuItem>
            </Box>
          )}
        </Menu>
      </Stack>

      {/* Entry Action */}
      <Box
        sx={{
          p: 2,
          bgcolor: "background.default",
          borderRadius: 1,
          mb: 2,
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          mb={0.5}
        >
          Entry Trigger
        </Typography>
        <Typography variant="body2" fontWeight={500}>
          {journey.entryAction.tagAction.type === "assign"
            ? `Tag "${journey.entryAction.tagAction.tagName}" assigned`
            : `Tag changes from "${journey.entryAction.tagAction.tagName}" to "${journey.entryAction.tagAction.newTagName}"`}
        </Typography>
      </Box>

      {/* Stats */}
      <Stack direction="row" spacing={3}>
        <Box>
          <Typography variant="caption" color="text.secondary" display="block">
            Nodes
          </Typography>
          <Typography variant="h6">{journey.nodes.length}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" display="block">
            Updated
          </Typography>
          <Typography variant="body2">
            {new Date(journey.updatedAt).toLocaleDateString()}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}
