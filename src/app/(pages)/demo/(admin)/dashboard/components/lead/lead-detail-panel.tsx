/**
 * Lead Detail Panel Component
 *
 * Slide-in drawer showing full lead details, journey timeline,
 * automation history, and quick actions
 */

"use client";

import React, { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  IconButton,
  Typography,
  Stack,
  Chip,
  Divider,
  Avatar,
  LinearProgress,
  Button,
  Tabs,
  Tab,
  Paper,
  Alert,
  SvgIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { format, formatDistanceToNow } from "date-fns";
import { getTagColor } from "./data/tag-data";
import { Lead } from "./types/lead.types";
import Stop from "@/app/icons/untitled-ui/duocolor/stop";
import Close from "@/app/icons/untitled-ui/duocolor/close";

import Delete from "@/app/icons/untitled-ui/duocolor/delete";
import {
  IExecutionRecord,
  IWaitingFor,
  ProgressStatus,
} from "@/app/model/journey/LeadJourneyProgress";
import { IJourney } from "../journey/types/api";
import { fetchLeadProgress } from "@/app/actions/server-actions";
import Automation from "@/app/icons/untitled-ui/duocolor/automation";
import { IScheduledAction } from "@/app/model/journey/ScheduledAction";
import {
  ActivityFeed,
  buildJourneyPath,
  JourneyTrack,
  nodeIcon,
} from "./journey-progress";

export interface Progress {
  lead: string;
  journey: IJourney;
  admin: string;
  agent?: string;

  // Current State
  currentNodeId: string;
  status: ProgressStatus;

  // Execution History
  executionHistory: IExecutionRecord[];

  // Waiting State
  waitingFor?: IWaitingFor;

  // Retry Logic
  retryCount: number;
  maxRetries: number;

  // Metadata
  startedAt: Date;
  completedAt?: Date;
  pausedAt?: Date;
  failedAt?: Date;
  lastActivityAt: Date;

  // Additional Context
  metadata?: Record<string, any>;

  createdAt: Date;
  updatedAt: Date;
}

interface LeadDetailPanelProps {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (leadId: string) => void;
  onEmail?: (leadId: string) => void;
  onCall?: (leadId: string) => void;
  onDelete?: (leadId: string) => void;
  onViewJourney?: (journeyId: string) => void;
  onStopJourney?: (leadId: string) => void;
}

export default function LeadDetailPanel({
  lead,
  open,
  onClose,
  onEdit,
  onEmail,
  onCall,
  onDelete,
  onViewJourney,
  onStopJourney,
}: LeadDetailPanelProps) {
  console.log(onEdit, onEmail, onCall);
  const [activeTab, setActiveTab] = useState(0);
  const [loadedProgress, setLoadedProgress] = useState<Progress | null>(null);
  const [loadedJourney, setLoadedJourney] = useState<IJourney | null>(null);
  const [loadedNextAction, setLoadedNextAction] =
    useState<IScheduledAction | null>(null);
  // const [errorMsg, setErroMsg] = useState("");
  // Which lead the loaded data belongs to. A boolean "fetched" flag never
  // reset when the drawer was reused for a different lead, which left the
  // previous lead's automation on screen.
  const [fetchedFor, setFetchedFor] = useState<string | null>(null);
  const [confirmStopOpen, setConfirmStopOpen] = useState(false);

  const leadId = lead?._id ?? null;
  const isDataTab = activeTab === 1 || activeTab === 2;

  // Derived rather than cleared in an effect: data that belongs to a different
  // lead simply does not count, so nothing stale can render even for a frame.
  const isStale = fetchedFor !== leadId;
  const progress = isStale ? null : loadedProgress;
  const currentJourney = isStale ? null : loadedJourney;
  const nextScheduledAction = isStale ? null : loadedNextAction;
  const loadingProgress = isStale && isDataTab;

  useEffect(() => {
    if (!leadId || !isDataTab || fetchedFor === leadId) return;

    let cancelled = false;

    fetchLeadProgress(leadId).then((res) => {
      // A slower request for a previously viewed lead must not land on this one.
      if (cancelled) return;

      if (res.message) {
        setLoadedProgress(res.message.progress);
        setLoadedJourney(res.message.progress?.journey ?? null);
        setLoadedNextAction(res.message.nextScheduledAction);
      }

      // Marked on failure too, so a failing lookup is not retried on every
      // tab switch.
      setFetchedFor(leadId);
    });

    return () => {
      cancelled = true;
    };
  }, [isDataTab, leadId, fetchedFor]);

  // The ordered path this lead is actually on, with each step's state.
  // Empty until the journey and progress have both loaded.
  const journeySteps =
    progress && currentJourney
      ? buildJourneyPath(currentJourney, progress)
      : [];

  const completedSteps = journeySteps.filter(
    (step) => step.state === "done",
  ).length;

  const percentComplete =
    journeySteps.length > 0
      ? Math.round((completedSteps / journeySteps.length) * 100)
      : 0;

  if (!lead) return null;

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };


  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "paused":
        return "warning";
      case "completed":
        return "info";
      case "failed":
        return "error";
      case "cancelled":
        // Stopping is a deliberate choice, not a problem - keep it neutral.
        return "default";
      default:
        return "default";
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { width: { xs: "100%", sm: 500, md: 600 } },
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: "primary.main",
                fontSize: "1.25rem",
              }}
            >
              {getInitials(lead.firstName, lead.lastName)}
            </Avatar>
            <Box>
              <Typography variant="h6">
                {lead.firstName} {lead.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {lead.email}
              </Typography>
            </Box>
          </Stack>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        {/* Quick Actions */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Stack direction="row" spacing={1}>
            {/* {onEmail && (
              <Button
                variant="outlined"
                startIcon={<StackedEmail />}
                onClick={() => onEmail(lead._id)}
                size="small"
              >
                Email
              </Button>
            )}
            {onCall && (
              <Button
                variant="outlined"
                startIcon={<Call />}
                onClick={() => onCall(lead._id)}
                size="small"
              >
                Call
              </Button>
            )}
            {onEdit && (
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => onEdit(lead._id)}
                size="small"
              >
                Edit
              </Button>
            )} */}
            {onDelete && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={() => onDelete(lead._id)}
                size="small"
              >
                Delete
              </Button>
            )}
          </Stack>
        </Box>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
          sx={{ borderBottom: 1, borderColor: "divider", px: 4 }}
        >
          <Tab label="Info" />
          <Tab label="Journey" />
          <Tab label="Activity" />
        </Tabs>

        {/* Content */}
        <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
          {/* Tab 1: Info */}
          {activeTab === 0 && (
            <Stack spacing={3}>
              {/* Contact Info */}
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                  Contact Information
                </Typography>
                <Stack spacing={1.5}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body2">{lead.email}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="body2">{lead.phone}</Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* Lead Details */}
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                  Lead Details
                </Typography>
                <Stack spacing={1.5}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Category
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {lead.category}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Intent
                    </Typography>
                    <Typography variant="body2">
                      {lead.intent || "None"}
                    </Typography>
                  </Box>
                  {lead.buyerProfile && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Buyer Profile
                      </Typography>
                      <Typography variant="body2">
                        {lead.buyerProfile}
                      </Typography>
                    </Box>
                  )}
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={lead.status}
                      size="small"
                      sx={{
                        bgcolor: getTagColor(lead.status),
                        color: "white",
                        fontWeight: 500,
                        textTransform: "capitalize",
                        mt: 0.5,
                      }}
                    />
                  </Box>
                  {lead.source && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Source
                      </Typography>
                      <Typography variant="body2">{lead.source}</Typography>
                    </Box>
                  )}
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Created
                    </Typography>
                    <Typography variant="body2">
                      {format(
                        new Date(lead.createdAt),
                        "MMM d, yyyy 'at' h:mm a",
                      )}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      (
                      {formatDistanceToNow(new Date(lead.createdAt), {
                        addSuffix: true,
                      })}
                      )
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* Notes */}
              {lead.notes && (
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                    Notes
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {lead.notes}
                  </Typography>
                </Paper>
              )}
            </Stack>
          )}

          {/* Tab 2: Journey */}
          {activeTab === 1 && (
            <Stack spacing={2.5}>
              {loadingProgress && <Typography>Loading...</Typography>}
              {!loadingProgress && progress && currentJourney ? (
                <>
                  {/* Summary */}
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Stack spacing={2}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="start"
                        gap={1}
                      >
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {currentJourney.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {currentJourney.isBuiltIn
                              ? "Built-in automation"
                              : "Custom automation"}
                          </Typography>
                        </Box>
                        <Chip
                          label={progress.status}
                          size="small"
                          color={getStatusColor(progress.status) as any}
                          sx={{ textTransform: "capitalize" }}
                        />
                      </Box>

                      {/* Progress counts completed steps on this lead's path,
                          not history entries - retries used to inflate it. */}
                      <Box>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          mb={0.75}
                        >
                          <Typography variant="body2" fontWeight={500}>
                            {completedSteps} of {journeySteps.length} steps done
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {percentComplete}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={percentComplete}
                          color={
                            progress.status === "failed" ? "error" : "primary"
                          }
                          sx={{ height: 8, borderRadius: 1 }}
                        />
                      </Box>

                      <Divider />

                      <Stack direction="row" spacing={3}>
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                          >
                            Started
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {format(new Date(progress.startedAt), "MMM d")}
                          </Typography>
                          <Typography variant="caption" color="text.disabled">
                            {formatDistanceToNow(new Date(progress.startedAt), {
                              addSuffix: true,
                            })}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                          >
                            Last activity
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {format(
                              new Date(progress.lastActivityAt),
                              "MMM d, h:mm a",
                            )}
                          </Typography>
                          <Typography variant="caption" color="text.disabled">
                            {formatDistanceToNow(
                              new Date(progress.lastActivityAt),
                              { addSuffix: true },
                            )}
                          </Typography>
                        </Box>
                      </Stack>

                      {progress.status === "failed" && (
                        <Alert severity="error" sx={{ py: 0.5 }}>
                          This automation stopped after{" "}
                          {progress.retryCount || progress.maxRetries} failed
                          attempts. The step below shows why.
                        </Alert>
                      )}

                      {progress.status === "cancelled" && (
                        <Alert severity="info" sx={{ py: 0.5 }}>
                          You stopped this automation. Change this lead&apos;s
                          tag to start them on a new one.
                        </Alert>
                      )}

                      {/* Actions */}
                      <Stack direction="row" spacing={1}>
                        {(progress.status === "active" ||
                          progress.status === "paused") &&
                          onStopJourney && (
                            <Button
                              variant="outlined"
                              size="small"
                              color="error"
                              startIcon={<Stop />}
                              onClick={() => setConfirmStopOpen(true)}
                            >
                              Stop automation
                            </Button>
                          )}
                        {onViewJourney && (
                          <Button
                            size="small"
                            startIcon={<Automation />}
                            onClick={() => onViewJourney(currentJourney!._id)}
                          >
                            Open canvas
                          </Button>
                        )}
                      </Stack>
                    </Stack>
                  </Paper>

                  {/* The path itself */}
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      sx={{ mb: 2 }}
                    >
                      Automation steps
                    </Typography>
                    <JourneyTrack steps={journeySteps} progress={progress} />
                  </Paper>

                  {/* Next Scheduled Action */}
                  {nextScheduledAction && (
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        gutterBottom
                      >
                        Next scheduled action
                      </Typography>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                        sx={{ mt: 1 }}
                      >
                        <SvgIcon sx={{ fontSize: 18, color: "primary.main" }}>
                          {nodeIcon(nextScheduledAction.actionType)}
                        </SvgIcon>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {format(
                              new Date(nextScheduledAction.scheduledFor),
                              "MMM d, yyyy 'at' h:mm a",
                            )}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="primary.main"
                            fontWeight={600}
                          >
                            {formatDistanceToNow(
                              new Date(nextScheduledAction.scheduledFor),
                              { addSuffix: true },
                            )}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  )}
                </>
              ) : (
                !loadingProgress && (
                  <Alert severity="info">
                    This lead is not currently in any journey. Tag changes will
                    automatically trigger appropriate journeys based on their
                    category and intent.
                  </Alert>
                )
              )}
            </Stack>
          )}

          {/* Tab 3: Activity */}
          {activeTab === 2 && (
            <Stack spacing={2}>
              {loadingProgress && <Typography>Loading...</Typography>}
              {!loadingProgress &&
              progress &&
              progress.executionHistory?.length ? (
                <>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Automation activity
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Everything this automation has done, most recent first.
                    </Typography>
                  </Box>
                  <ActivityFeed steps={journeySteps} progress={progress} />
                </>
              ) : (
                !loadingProgress && (
                  <Alert severity="info">
                    No activity history available. Activity will appear once this
                    lead enters a journey.
                  </Alert>
                )
              )}
            </Stack>
          )}
        </Box>
      </Box>

      {/* Stopping cannot be undone, so it is confirmed rather than instant. */}
      <Dialog
        open={confirmStopOpen}
        onClose={() => setConfirmStopOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Stop this automation?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {lead.firstName} will stop receiving the remaining automated emails
            and reminders in this sequence.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
            This can&apos;t be undone. To put them back on an automation later,
            change their tag.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmStopOpen(false)}>Keep running</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setConfirmStopOpen(false);
              onStopJourney?.(lead._id);
              // Clear the marker so the journey tab refetches and shows the
              // stopped state rather than the automation still running.
              setFetchedFor(null);
            }}
          >
            Stop automation
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
}
