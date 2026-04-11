/**
 * Lead Table Component
 *
 * Modern table view with journey progress, status badges,
 * sortable columns, and quick actions
 */

"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Chip,
  LinearProgress,
  Box,
  Typography,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Avatar,
} from "@mui/material";
import { formatDistanceToNow, format } from "date-fns";
import { Lead, LeadSort } from "./types/lead.types";
import { getTagColor } from "./data/tag-data";
import DownArrow from "@/app/icons/untitled-ui/duocolor/down-arrow";
import PlayArrow from "@/app/icons/untitled-ui/duocolor/play-arrow";
import Calendar from "@/app/icons/untitled-ui/duocolor/calendar";
import LoadMore from "@/app/icons/untitled-ui/duocolor/load-more";
import Visibility from "@/app/icons/untitled-ui/duocolor/visibility";
import Edit from "@/app/icons/untitled-ui/duocolor/edit";
import StackedEmail from "@/app/icons/untitled-ui/duocolor/stacked-email";
import Call from "@/app/icons/untitled-ui/duocolor/call";
import Delete from "@/app/icons/untitled-ui/duocolor/delete";
import TrendingDown from "@/app/icons/untitled-ui/duocolor/trending-down";

interface LeadTableProps {
  leads: Lead[];
  selectedLeads: string[];
  sort: LeadSort;
  onSelectLead: (leadId: string) => void;
  onSelectAll: () => void;
  onSort: (field: LeadSort["field"]) => void;
  onViewDetails: (leadId: string) => void;
  onEdit?: (leadId: string) => void;
  onEmail?: (leadId: string) => void;
  onCall?: (leadId: string) => void;
  onDelete?: (leadId: string) => void;
  onViewJourney?: (journeyId: string) => void;
}

export default function LeadTable({
  leads,
  selectedLeads,
  sort,
  onSelectLead,
  onSelectAll,
  onSort,
  onViewDetails,
  onEdit,
  onEmail,
  onCall,
  onDelete,
  onViewJourney,
}: LeadTableProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);

  const allSelected = leads.length > 0 && selectedLeads.length === leads.length;
  const someSelected =
    selectedLeads.length > 0 && selectedLeads.length < leads.length;

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    leadId: string,
  ) => {
    setAnchorEl(event.currentTarget);
    setActiveLeadId(leadId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveLeadId(null);
  };

  const handleAction = (action: () => void) => {
    action();
    handleMenuClose();
  };

  const SortableHeader = ({
    field,
    label,
  }: {
    field: LeadSort["field"];
    label: string;
  }) => {
    const isActive = sort.field === field;
    const Icon = isActive && sort.order === "desc" ? DownArrow : PlayArrow;

    return (
      <TableCell
        onClick={() => onSort(field)}
        sx={{
          cursor: "pointer",
          userSelect: "none",
          fontWeight: 600,
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <Box display="flex" alignItems="center" gap={0.5}>
          {label}
          {isActive && <Icon fontSize="small" />}
        </Box>
      </TableCell>
    );
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const formatPhoneNumber = (phone: string) => {
    return phone
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  };

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "calc(100vh - 250px)" }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={onSelectAll}
                />
              </TableCell>
              <SortableHeader field="firstName" label="Name" />
              <SortableHeader field="intent" label="Intent" />
              <SortableHeader field="status" label="Status" />
              <TableCell sx={{ fontWeight: 600 }}>Journey</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Progress
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Next Action</TableCell>
              <SortableHeader field="createdAt" label="Created" />
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                  <Typography variant="body1" color="text.secondary">
                    No leads found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => (
                <TableRow
                  key={lead._id}
                  hover
                  selected={selectedLeads.includes(lead._id)}
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  {/* Checkbox */}
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedLeads.includes(lead._id)}
                      onChange={() => onSelectLead(lead._id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>

                  {/* Name */}
                  <TableCell onClick={() => onViewDetails(lead._id)}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar
                        sx={{ width: 32, height: 32, bgcolor: "primary.main" }}
                      >
                        {getInitials(lead.firstName, lead.lastName)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {lead.firstName} {lead.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {lead.email}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatPhoneNumber(lead.phone)}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>

                  {/* Intent */}
                  <TableCell>
                    {lead.intent ? (
                      <Chip
                        label={lead.intent}
                        size="small"
                        sx={{
                          bgcolor: "info.light",
                          color: "info.dark",
                          fontWeight: 500,
                        }}
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        None
                      </Typography>
                    )}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Chip
                      label={lead.status}
                      size="small"
                      sx={{
                        bgcolor: getTagColor(lead.status),
                        color: "white",
                        fontWeight: 500,
                        textTransform: "capitalize",
                      }}
                    />
                  </TableCell>

                  {/* Journey */}
                  <TableCell>
                    {lead.currentJourney ? (
                      <Tooltip title="View journey canvas">
                        <Box
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewJourney?.(lead.currentJourney!._id);
                          }}
                          sx={{
                            cursor: "pointer",
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          <Typography variant="body2" fontWeight={500}>
                            {lead.currentJourney.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {lead.journeyProgress?.status === "active" &&
                              "🟢 Active"}
                            {lead.journeyProgress?.status === "paused" &&
                              "⏸️ Paused"}
                            {lead.journeyProgress?.status === "completed" &&
                              "✅ Completed"}
                            {lead.journeyProgress?.status === "failed" &&
                              "❌ Failed"}
                          </Typography>
                        </Box>
                      </Tooltip>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No journey
                      </Typography>
                    )}
                  </TableCell>

                  {/* Progress */}
                  <TableCell align="center" sx={{ minWidth: 120 }}>
                    {lead.journeyProgress ? (
                      <Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <LinearProgress
                            variant="determinate"
                            value={lead.journeyProgress.progressPercentage}
                            sx={{ flex: 1, height: 6, borderRadius: 1 }}
                          />
                          <Typography variant="caption" fontWeight={600}>
                            {lead.journeyProgress.progressPercentage}%
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {lead.journeyProgress.completedNodes}/
                          {lead.journeyProgress.totalNodes} steps
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        —
                      </Typography>
                    )}
                  </TableCell>

                  {/* Next Action */}
                  <TableCell>
                    {lead.nextScheduledAction ? (
                      <Tooltip
                        title={`${lead.nextScheduledAction.type}: ${lead.nextScheduledAction.description}`}
                      >
                        <Box>
                          <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="center"
                          >
                            {/* <ScheduleIcon fontSize="small" color="action" /> */}
                            <Calendar />
                            <Typography variant="body2">
                              {lead.nextScheduledAction.type
                                .replace("_", " ")
                                .replace("send ", "")}
                            </Typography>
                          </Stack>
                          <Typography variant="caption" color="text.secondary">
                            {formatDistanceToNow(
                              new Date(lead.nextScheduledAction.scheduledFor),
                              { addSuffix: true },
                            )}
                          </Typography>
                        </Box>
                      </Tooltip>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        None
                      </Typography>
                    )}
                  </TableCell>

                  {/* Created */}
                  <TableCell>
                    <Typography variant="body2">
                      {format(new Date(lead.createdAt), "MMM d, yyyy")}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDistanceToNow(new Date(lead.createdAt), {
                        addSuffix: true,
                      })}
                    </Typography>
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuOpen(e, lead._id);
                      }}
                    >
                      <LoadMore />
                      {/* <MoreVertIcon /> */}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => handleAction(() => onViewDetails(activeLeadId!))}
        >
          <ListItemIcon>
            <Visibility />
            {/* <VisibilityIcon fontSize="small" /> */}
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>

        {onEdit && (
          <MenuItem onClick={() => handleAction(() => onEdit(activeLeadId!))}>
            <ListItemIcon>
              <Edit />
              {/* <EditIcon fontSize="small" /> */}
            </ListItemIcon>
            <ListItemText>Edit Lead</ListItemText>
          </MenuItem>
        )}

        {onEmail && (
          <MenuItem onClick={() => handleAction(() => onEmail(activeLeadId!))}>
            <ListItemIcon>
              <StackedEmail />
              {/* <EmailIcon fontSize="small" /> */}
            </ListItemIcon>
            <ListItemText>Send Email</ListItemText>
          </MenuItem>
        )}

        {onCall && (
          <MenuItem onClick={() => handleAction(() => onCall(activeLeadId!))}>
            <ListItemIcon>
              <Call />
              {/* <PhoneIcon fontSize="small" /> */}
            </ListItemIcon>
            <ListItemText>Make Call</ListItemText>
          </MenuItem>
        )}

        {activeLeadId &&
          leads.find((l) => l._id === activeLeadId)?.currentJourney &&
          onViewJourney && (
            <MenuItem
              onClick={() =>
                handleAction(() =>
                  onViewJourney(
                    leads.find((l) => l._id === activeLeadId)!.currentJourney!
                      ._id,
                  ),
                )
              }
            >
              <ListItemIcon>
                <TrendingDown />
                {/* <JourneyIcon fontSize="small" /> */}
              </ListItemIcon>
              <ListItemText>View Journey</ListItemText>
            </MenuItem>
          )}

        {onDelete && (
          <MenuItem
            onClick={() => handleAction(() => onDelete(activeLeadId!))}
            sx={{ color: "error.main" }}
          >
            <ListItemIcon>
              <Delete />
              {/* <DeleteIcon fontSize="small" color="error" /> */}
            </ListItemIcon>
            <ListItemText>Delete Lead</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
