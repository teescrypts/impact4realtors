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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Alert,
} from "@mui/material";
import { format, formatDistanceToNow } from "date-fns";
import { ClockIcon } from "@mui/x-date-pickers";
import { getTagColor } from "./data/tag-data";
import { Lead } from "./types/lead.types";
import Settings from "@/app/icons/untitled-ui/duocolor/settings";
import EventBusy from "@/app/icons/untitled-ui/duocolor/event-busy";
import CheckDone01 from "@/app/icons/untitled-ui/duocolor/check-done-01";
import Pause from "@/app/icons/untitled-ui/duocolor/pause";
import Close from "@/app/icons/untitled-ui/duocolor/close";

import Delete from "@/app/icons/untitled-ui/duocolor/delete";
import Play from "@/app/icons/untitled-ui/duocolor/play";
import {
  IExecutionRecord,
  IWaitingFor,
  ProgressStatus,
} from "@/app/model/journey/LeadJourneyProgress";
import { IJourney, IJourneyNode } from "../journey/types/api";
import { fetchLeadProgress } from "@/app/actions/server-actions";
import Automation from "@/app/icons/untitled-ui/duocolor/automation";
import { IScheduledAction } from "@/app/model/journey/ScheduledAction";

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
  onPauseJourney?: (leadId: string) => void;
  onResumeJourney?: (leadId: string) => void;
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
  onPauseJourney,
  onResumeJourney,
}: LeadDetailPanelProps) {
  console.log(onEdit, onEmail, onCall);
  const [activeTab, setActiveTab] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [currentJourney, setCurrentJourney] = useState<IJourney | null>(null);
  const [currentNode, setCurrentNode] = useState<IJourneyNode | null>(null);
  const [nextScheduledAction, setNextScheduledAction] =
    useState<IScheduledAction | null>(null);
  // const [errorMsg, setErroMsg] = useState("");
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (!fetched && lead) {
      if (activeTab === 1 || activeTab === 2) {
        setLoadingProgress(true);
        fetchLeadProgress(lead._id).then((res) => {
          if (res.error) {
            // setErroMsg(res.error);
            setLoadingProgress(false);
          }

          if (res.message) {
            const progress = res.message.progress;
            const journey = res.message.progress?.journey;
            const nextScheduledAction = res.message.nextScheduledAction;

            setProgress(progress);
            setCurrentJourney(journey ? journey : null);
            setNextScheduledAction(nextScheduledAction);

            const currentNode = journey
              ? journey.nodes.find(
                  (node) => node.id === progress!.currentNodeId,
                )
              : null;

            setCurrentNode(currentNode ? currentNode : null);
            setLoadingProgress(false);
            setFetched(true);
          }
        });
      }
    }
  }, [activeTab, lead, fetched]);

  if (!lead) return null;

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const getNodeTypeIcon = (nodeType: string) => {
    switch (nodeType) {
      case "send_email":
        // return <SendIcon fontSize="small" />;
        return <Settings />;
      case "call_reminder":
        // return <CallActionIcon fontSize="small" />;
        return <Settings />;
      case "meeting_reminder":
        return <EventBusy fontSize="small" />;
      case "sms_reminder":
        // return <SmsIcon fontSize="small" />;
        return <Settings />;
      case "delay":
        return <ClockIcon fontSize="small" />;
      case "condition":
        return <CheckDone01 fontSize="small" />;
      case "trigger":
        return <Pause fontSize="small" />;
      default:
        // return <ScheduleIcon fontSize="small" />;
        return <Settings />;
    }
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
            <Stack spacing={3}>
              {loadingProgress && <Typography>Loading...</Typography>}
              {!loadingProgress && progress && currentJourney ? (
                <>
                  {/* Journey Header */}
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Stack spacing={2}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="start"
                      >
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {currentJourney.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {currentJourney.isBuiltIn
                              ? "Built-in Journey"
                              : "Custom Journey"}
                          </Typography>
                        </Box>
                        <Chip
                          label={progress.status}
                          size="small"
                          color={getStatusColor(progress.status) as any}
                          sx={{ textTransform: "capitalize" }}
                        />
                      </Box>

                      <Divider />

                      {/* Progress */}
                      <Box>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          mb={1}
                        >
                          <Typography variant="body2" fontWeight={500}>
                            Progress
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {(progress.executionHistory.length /
                              currentJourney.nodes.length) *
                              100}
                            %
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={
                            (progress.executionHistory.length /
                              currentJourney.nodes.length) *
                            100
                          }
                          sx={{ height: 8, borderRadius: 1 }}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          mt={0.5}
                        >
                          {progress.executionHistory.length} of{" "}
                          {currentJourney.nodes.length} steps completed
                        </Typography>
                      </Box>

                      {/* Timeline */}
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Started
                        </Typography>
                        <Typography variant="body2">
                          {format(new Date(progress.startedAt), "MMM d, yyyy")}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          (
                          {formatDistanceToNow(new Date(progress.startedAt), {
                            addSuffix: true,
                          })}
                          )
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Last Activity
                        </Typography>
                        <Typography variant="body2">
                          {formatDistanceToNow(
                            new Date(progress.lastActivityAt),
                            { addSuffix: true },
                          )}
                        </Typography>
                      </Box>

                      {/* Actions */}
                      <Stack direction="row" spacing={1}>
                        {onViewJourney && (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Automation />}
                            onClick={() => onViewJourney(currentJourney!._id)}
                          >
                            View Journey Canvas
                          </Button>
                        )}
                        {progress.status === "active" && onPauseJourney && (
                          <Button
                            variant="outlined"
                            size="small"
                            color="warning"
                            startIcon={<Pause />}
                            onClick={() => onPauseJourney(lead._id)}
                          >
                            Pause
                          </Button>
                        )}
                        {progress.status === "paused" && onResumeJourney && (
                          <Button
                            variant="outlined"
                            size="small"
                            color="success"
                            startIcon={<Play />}
                            onClick={() => onResumeJourney(lead._id)}
                          >
                            Resume
                          </Button>
                        )}
                      </Stack>
                    </Stack>
                  </Paper>

                  {/* Current Step */}
                  {currentNode && (
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        bgcolor: "primary.light",
                        borderColor: "primary.main",
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                          sx={{
                            bgcolor: "primary.main",
                            color: "white",
                            p: 1,
                            borderRadius: 1,
                          }}
                        >
                          {getNodeTypeIcon(currentNode.type)}
                        </Box>
                        <Box flex={1}>
                          <Typography variant="subtitle2" fontWeight={600}>
                            Current Step
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ textTransform: "capitalize" }}
                          >
                            {currentNode.type.replace(/_/g, " ")}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  )}

                  {/* Next Scheduled Action */}
                  {nextScheduledAction && (
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        gutterBottom
                      >
                        Next Scheduled Action
                      </Typography>
                      <Stack spacing={1.5}>
                        <Box display="flex" alignItems="center" gap={1}>
                          {getNodeTypeIcon(nextScheduledAction.actionType)}
                          <Typography variant="body2" fontWeight={500}>
                            {nextScheduledAction.actionType.replace(/_/g, " ")}
                          </Typography>
                        </Box>
                        {/* <Typography variant="body2" color="text.secondary">
                          {nextScheduledAction.description}
                        </Typography> */}
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Scheduled for
                          </Typography>
                          <Typography variant="body2">
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
              {progress ? (
                <>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Journey Activity
                  </Typography>
                  <List>
                    {Array.from({
                      length: progress.executionHistory.length,
                    }).map((_, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          py: 1.5,
                          borderBottom: 1,
                          borderColor: "divider",
                        }}
                      >
                        <ListItemIcon>
                          <CheckDone01 color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Step ${index + 1} completed`}
                          secondary="Action executed successfully"
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              ) : (
                <Alert severity="info">
                  No activity history available. Activity will appear once this
                  lead enters a journey.
                </Alert>
              )}
            </Stack>
          )}
        </Box>
      </Box>
    </Drawer>
  );
}
