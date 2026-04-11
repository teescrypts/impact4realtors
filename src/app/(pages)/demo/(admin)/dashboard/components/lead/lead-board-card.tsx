/**
 * Lead Board Card Component
 *
 * Individual lead card with journey progress, next action, and quick view
 */

"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Card,
  CardContent,
  Typography,
  Checkbox,
  Stack,
  Box,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Avatar,
  SvgIcon,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { Lead } from "./types/lead.types";
import Visibility from "@/app/icons/untitled-ui/duocolor/visibility";
import TrendingUp from "@/app/icons/untitled-ui/duocolor/trending-up";
import EventAvailable from "@/app/icons/untitled-ui/duocolor/event-available";

interface LeadBoardCardProps {
  lead: Lead;
  isSelected: boolean;
  onSelect: () => void;
  onViewDetails: () => void;
  isDragging?: boolean;
}

export default function LeadBoardCard({
  lead,
  isSelected,
  onSelect,
  onViewDetails,
  isDragging = false,
}: LeadBoardCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: lead._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  return (
    <Card
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      sx={{
        ...style,
        cursor: isDragging ? "grabbing" : "grab",
        border: isSelected ? 2 : 1,
        borderColor: isSelected ? "primary.main" : "divider",
        boxShadow: isDragging ? 4 : 1,
        "&:hover": {
          boxShadow: 3,
          borderColor: "primary.light",
        },
        touchAction: "none",
      }}
    >
      <CardContent sx={{ p: 1.5, pb: "12px !important" }}>
        {/* Header Row */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="start"
          mb={1}
        >
          <Checkbox
            size="small"
            checked={isSelected}
            onChange={onSelect}
            onClick={(e) => e.stopPropagation()}
            sx={{ p: 0, mr: 1 }}
          />

          <Stack direction="row" spacing={0.5} alignItems="center">
            {lead.intent && (
              <Chip
                label={lead.intent}
                size="small"
                sx={{
                  fontSize: "0.7rem",
                  height: 20,
                  bgcolor: "info.light",
                  color: "info.dark",
                }}
              />
            )}
            <Tooltip title="View details">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails();
                }}
                sx={{ p: 0.5 }}
              >
                <Visibility fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {/* Lead Info */}
        <Stack spacing={0.5} mb={1.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar
              sx={{
                width: 28,
                height: 28,
                bgcolor: "primary.main",
                fontSize: "0.75rem",
              }}
            >
              {getInitials(lead.firstName, lead.lastName)}
            </Avatar>
            <Box
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails();
              }}
              sx={{
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              <Typography variant="body2" fontWeight={600}>
                {lead.firstName} {lead.lastName}
              </Typography>
            </Box>
          </Stack>

          {lead.buyerProfile && (
            <Typography variant="caption" color="text.secondary">
              {lead.buyerProfile}
            </Typography>
          )}

          <Typography variant="caption" color="text.secondary" noWrap>
            {lead.email}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {lead.phone}
          </Typography>
        </Stack>

        {/* Journey Info */}
        {lead.currentJourney && lead.journeyProgress && (
          <Box
            sx={{
              p: 1,
              bgcolor: "primary.lighter",
              borderRadius: 1,
              border: "1px solid",
              borderColor: "primary.light",
              mb: 1,
            }}
          >
            <Stack spacing={0.5}>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                {/* <JourneyIcon sx={{ fontSize: 14, color: "primary.main" }} /> */}
                <SvgIcon sx={{ fontSize: 14, color: "primary.main" }}>
                  <TrendingUp />
                </SvgIcon>

                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="primary.dark"
                  noWrap
                >
                  {lead.currentJourney.name}
                </Typography>
              </Stack>

              <Box>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={0.3}
                >
                  <Typography variant="caption" color="text.secondary">
                    Progress
                  </Typography>
                  <Typography variant="caption" fontWeight={600}>
                    {lead.journeyProgress.progressPercentage}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={lead.journeyProgress.progressPercentage}
                  sx={{ height: 4, borderRadius: 1 }}
                />
              </Box>

              <Typography variant="caption" color="text.secondary">
                {lead.journeyProgress.completedNodes} of{" "}
                {lead.journeyProgress.totalNodes} steps •{" "}
                {lead.journeyProgress.status === "active" && "🟢 Active"}
                {lead.journeyProgress.status === "paused" && "⏸️ Paused"}
                {lead.journeyProgress.status === "completed" && "✅ Done"}
                {lead.journeyProgress.status === "failed" && "❌ Failed"}
              </Typography>
            </Stack>
          </Box>
        )}

        {/* Next Action */}
        {lead.nextScheduledAction && (
          <Box
            sx={{
              p: 1,
              bgcolor: "warning.lighter",
              borderRadius: 1,
              border: "1px solid",
              borderColor: "warning.light",
            }}
          >
            <Stack direction="row" spacing={0.5} alignItems="start">
              {/* <ScheduleIcon
                sx={{ fontSize: 14, color: "warning.main", mt: 0.2 }}
              /> */}
              <SvgIcon sx={{ fontSize: 14, color: "warning.main", mt: 0.2 }}>
                <EventAvailable />
              </SvgIcon>
              <Box flex={1}>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="warning.dark"
                >
                  Next: {lead.nextScheduledAction.type.replace(/_/g, " ")}
                </Typography>
                <Typography
                  variant="caption"
                  display="block"
                  color="text.secondary"
                  sx={{ fontSize: "0.65rem" }}
                >
                  {formatDistanceToNow(
                    new Date(lead.nextScheduledAction.scheduledFor),
                    { addSuffix: true },
                  )}
                </Typography>
              </Box>
            </Stack>
          </Box>
        )}

        {/* Source (if no journey) */}
        {!lead.currentJourney && lead.source && (
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            mt={1}
          >
            Source: {lead.source}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
