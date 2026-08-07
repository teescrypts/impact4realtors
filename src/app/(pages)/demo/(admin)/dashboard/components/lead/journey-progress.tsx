"use client";

/**
 * Journey Progress Views
 *
 * Turns a LeadJourneyProgress record into something an agent can read at a
 * glance: where the automation has got to, what it did, and what happens next.
 *
 * Two views share the same derived data:
 *   JourneyTrack  - the whole path, done / current / upcoming
 *   ActivityFeed  - what actually happened, including failures
 */

import Calendar from "@/app/icons/untitled-ui/duocolor/calendar";
import Call from "@/app/icons/untitled-ui/duocolor/call";
import CheckedCircle from "@/app/icons/untitled-ui/duocolor/checked-circle";
import Close from "@/app/icons/untitled-ui/duocolor/close";
import HourGlass from "@/app/icons/untitled-ui/duocolor/hour-glass";
import LocalOffer from "@/app/icons/untitled-ui/duocolor/local-offer";
import MessageChatSquare from "@/app/icons/untitled-ui/duocolor/message-chat-square";
import Play from "@/app/icons/untitled-ui/duocolor/play";
import StackedEmail from "@/app/icons/untitled-ui/duocolor/stacked-email";
import Visibility from "@/app/icons/untitled-ui/duocolor/visibility";
import Zap from "@/app/icons/untitled-ui/duocolor/zap";
import { StepState, walkJourneyPath } from "@/app/lib/journey/path";
import { IExecutionRecord } from "@/app/model/journey/LeadJourneyProgress";
import { Box, Chip, Stack, SvgIcon, Tooltip, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { format, formatDistanceToNow } from "date-fns";
import { ReactNode } from "react";
import { IJourney, IJourneyNode } from "../journey/types/api";
import { Progress } from "./lead-detail-panel";

// ======================
//  DERIVING THE PATH
// ======================

export type { StepState };

export interface JourneyStep {
  node: IJourneyNode;
  state: StepState;
  /** Every record for this node, oldest first. More than one means retries. */
  records: IExecutionRecord[];
  /** Which branch was taken out of a condition, when known. */
  branchTaken?: "yes" | "no";
}

/**
 * The lead's path through the journey, with each node and its records
 * attached for rendering.
 *
 * The walk itself lives in lib/journey/path so the leads API can reuse it -
 * the list and this panel must not disagree about how far along a lead is.
 */
export function buildJourneyPath(
  journey: IJourney,
  progress: Progress,
): JourneyStep[] {
  const history = progress.executionHistory ?? [];
  const nodes = journey.nodes ?? [];

  return walkJourneyPath(journey, progress).flatMap<JourneyStep>((step) => {
    const node = nodes.find((candidate) => candidate.id === step.nodeId);
    if (!node) return [];

    return [
      {
        node,
        state: step.state,
        records: history.filter((record) => record.nodeId === step.nodeId),
        branchTaken: step.branchTaken,
      },
    ];
  });
}

// ======================
//  DESCRIBING A NODE
// ======================

const UNIT_LABELS: Record<string, string> = {
  minutes: "minute",
  hours: "hour",
  days: "day",
};

function plural(count: number, unit: string) {
  const label = UNIT_LABELS[unit] ?? unit;
  return `${count} ${label}${count === 1 ? "" : "s"}`;
}

/** Short human title for a node - what this step does. */
export function describeNode(node: IJourneyNode): string {
  const config = node.config as any;

  switch (node.type) {
    case "entry":
      return "Lead enters the automation";

    case "send_email":
      return config.subject ? `Email: ${config.subject}` : "Send an email";

    case "delay":
      return `Wait ${plural(config.duration, config.unit)}`;

    case "condition":
      return config.checkType === "email_opened"
        ? "Did they open the email?"
        : "Did their tag change?";

    case "trigger":
      return config.waitForTag
        ? `Wait for the tag "${config.waitForTag}"`
        : "Wait for a tag";

    case "meeting_reminder":
      return config.title ? `Reminder: ${config.title}` : "Meeting reminder";

    case "call_reminder":
      return "Reminder to call this lead";

    case "sms_reminder":
      return "Reminder to text this lead";

    default:
      return (node.type as string).replace(/_/g, " ");
  }
}

/** Extra line of context under the title, where there is something useful. */
export function detailNode(node: IJourneyNode): string | null {
  const config = node.config as any;

  switch (node.type) {
    case "condition":
      return config.waitFor
        ? `Waits up to ${plural(config.waitFor.duration, config.waitFor.unit)} before taking the "No" path`
        : null;

    case "call_reminder":
    case "sms_reminder":
    case "meeting_reminder":
      return config.message ?? null;

    default:
      return null;
  }
}

export function nodeIcon(nodeType: string): ReactNode {
  switch (nodeType) {
    case "send_email":
      return <StackedEmail />;
    case "delay":
      return <HourGlass />;
    case "condition":
      return <CheckedCircle />;
    case "trigger":
      return <LocalOffer />;
    case "call_reminder":
      return <Call />;
    case "sms_reminder":
      return <MessageChatSquare />;
    case "meeting_reminder":
      return <Calendar />;
    case "entry":
      return <Play />;
    default:
      return <Zap />;
  }
}

// ======================
//  THE TRACK
// ======================

function StepDot({ state, nodeType }: { state: StepState; nodeType: string }) {
  const theme = useTheme();

  const palette: Record<StepState, string> = {
    done: theme.palette.success.main,
    current: theme.palette.primary.main,
    failed: theme.palette.error.main,
    skipped: theme.palette.text.disabled,
    upcoming: theme.palette.text.disabled,
  };

  const color = palette[state];
  const filled = state === "done" || state === "current" || state === "failed";

  return (
    <Box
      sx={{
        width: 34,
        height: 34,
        flexShrink: 0,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid",
        borderColor: color,
        bgcolor: filled ? alpha(color, 0.12) : "transparent",
        color,
        // Draw attention to where the automation actually is.
        ...(state === "current" && {
          boxShadow: `0 0 0 4px ${alpha(color, 0.16)}`,
        }),
      }}
    >
      <SvgIcon sx={{ fontSize: 17 }}>
        {state === "failed" ? <Close /> : nodeIcon(nodeType)}
      </SvgIcon>
    </Box>
  );
}

/** What the lead is currently waiting on, in plain words. */
function waitingLabel(progress: Progress): string | null {
  const waiting = progress.waitingFor;
  if (!waiting) return null;

  if (waiting.type === "trigger" && waiting.waitingForTag)
    return `Paused until the tag "${waiting.waitingForTag}" is added`;

  if (waiting.resumeAt) {
    const when = new Date(waiting.resumeAt);
    const relative = formatDistanceToNow(when, { addSuffix: true });

    return waiting.type === "email_event"
      ? `Watching for an open — decides ${relative} if nothing happens`
      : `Resumes ${relative}`;
  }

  return null;
}

export function JourneyTrack({
  steps,
  progress,
}: {
  steps: JourneyStep[];
  progress: Progress;
}) {
  const theme = useTheme();
  const waiting = waitingLabel(progress);

  return (
    <Stack>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const title = describeNode(step.node);
        const detail = detailNode(step.node);
        const last = step.records.at(-1);
        const failedAttempts = step.records.filter(
          (record) => record.status === "failed",
        ).length;

        const muted = step.state === "upcoming" || step.state === "skipped";

        return (
          <Stack key={step.node.id} direction="row" spacing={1.75}>
            {/* Rail */}
            <Stack alignItems="center" sx={{ width: 34 }}>
              <StepDot state={step.state} nodeType={step.node.type} />
              {!isLast && (
                <Box
                  sx={{
                    width: "2px",
                    flex: 1,
                    minHeight: 26,
                    my: 0.5,
                    bgcolor:
                      step.state === "done"
                        ? theme.palette.success.main
                        : theme.palette.divider,
                    opacity: step.state === "done" ? 0.45 : 1,
                  }}
                />
              )}
            </Stack>

            {/* Body */}
            <Box sx={{ pb: isLast ? 0 : 2.5, flex: 1, minWidth: 0 }}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: step.state === "current" ? 700 : 600,
                    color: muted ? "text.disabled" : "text.primary",
                  }}
                >
                  {title}
                </Typography>

                {step.state === "current" && (
                  <Chip
                    size="small"
                    label="Here now"
                    color="primary"
                    sx={{ height: 19, fontSize: "0.65rem", fontWeight: 700 }}
                  />
                )}

                {step.state === "failed" && (
                  <Chip
                    size="small"
                    label="Failed"
                    color="error"
                    sx={{ height: 19, fontSize: "0.65rem", fontWeight: 700 }}
                  />
                )}

                {step.state === "skipped" && (
                  <Chip
                    size="small"
                    label="Skipped"
                    variant="outlined"
                    sx={{ height: 19, fontSize: "0.65rem" }}
                  />
                )}

                {step.branchTaken && (
                  <Chip
                    size="small"
                    label={`Went "${step.branchTaken}"`}
                    variant="outlined"
                    color={step.branchTaken === "yes" ? "success" : "default"}
                    sx={{ height: 19, fontSize: "0.65rem" }}
                  />
                )}
              </Stack>

              {detail && (
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    color: "text.secondary",
                    mt: 0.25,
                    lineHeight: 1.5,
                  }}
                >
                  {detail}
                </Typography>
              )}

              {/* When it ran */}
              {last && step.state !== "upcoming" && (
                <Typography
                  variant="caption"
                  sx={{ display: "block", color: "text.disabled", mt: 0.25 }}
                >
                  {formatDistanceToNow(new Date(last.executedAt), {
                    addSuffix: true,
                  })}
                  {failedAttempts > 1 && ` · ${failedAttempts} attempts`}
                </Typography>
              )}

              {/* Email engagement, where we know it */}
              {last?.result?.emailId && (
                <Stack direction="row" spacing={0.75} sx={{ mt: 0.75 }}>
                  <Chip
                    size="small"
                    variant="outlined"
                    label="Sent"
                    sx={{ height: 20, fontSize: "0.65rem" }}
                  />
                  {last.result.emailOpened && (
                    <Chip
                      size="small"
                      color="success"
                      variant="outlined"
                      icon={
                        <SvgIcon sx={{ fontSize: 13 }}>
                          <Visibility />
                        </SvgIcon>
                      }
                      label="Opened"
                      sx={{ height: 20, fontSize: "0.65rem" }}
                    />
                  )}
                  {last.result.emailClicked && (
                    <Chip
                      size="small"
                      color="success"
                      label="Clicked"
                      sx={{ height: 20, fontSize: "0.65rem" }}
                    />
                  )}
                </Stack>
              )}

              {/* Why it failed - the thing that was previously invisible */}
              {step.state === "failed" && last?.result?.error && (
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 0.75,
                    p: 1,
                    borderRadius: 1,
                    bgcolor: alpha(theme.palette.error.main, 0.08),
                    color: "error.main",
                    lineHeight: 1.5,
                    wordBreak: "break-word",
                  }}
                >
                  {last.result.error}
                </Typography>
              )}

              {/* What we are waiting on, attached to the live step */}
              {step.state === "current" && waiting && (
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 0.75,
                    p: 1,
                    borderRadius: 1,
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    color: "primary.main",
                    fontWeight: 600,
                    lineHeight: 1.5,
                  }}
                >
                  {waiting}
                </Typography>
              )}
            </Box>
          </Stack>
        );
      })}
    </Stack>
  );
}

// ======================
//  THE ACTIVITY FEED
// ======================

const STATUS_META: Record<
  string,
  { label: string; color: "success" | "error" | "warning" | "info" }
> = {
  success: { label: "Done", color: "success" },
  failed: { label: "Failed", color: "error" },
  skipped: { label: "Skipped", color: "warning" },
  pending: { label: "Pending", color: "info" },
};

/** One line of detail describing what a record actually produced. */
function recordDetail(record: IExecutionRecord): string | null {
  const result = record.result;
  if (!result) return null;

  if (result.error) return result.error;

  if (record.nodeType === "condition" && result.conditionMet !== undefined)
    return result.conditionMet
      ? "They engaged — took the Yes path"
      : "No engagement in the window — took the No path";

  if (result.receivedTag) return `Tag "${result.receivedTag}" was added`;

  if (result.emailId) {
    const engagement = [
      result.emailClicked && "clicked",
      result.emailOpened && "opened",
    ].filter(Boolean);

    return engagement.length > 0
      ? `Delivered and ${engagement.join(", ")}`
      : "Delivered — no open recorded yet";
  }

  return null;
}

export function ActivityFeed({
  steps,
  progress,
}: {
  steps: JourneyStep[];
  progress: Progress;
}) {
  const theme = useTheme();

  const nodeById = new Map(steps.map((step) => [step.node.id, step.node]));

  // Newest first - the most recent thing that happened matters most.
  const records = [...(progress.executionHistory ?? [])].sort(
    (a, b) =>
      new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime(),
  );

  if (records.length === 0) return null;

  return (
    <Stack spacing={1.25}>
      {records.map((record, index) => {
        const node = nodeById.get(record.nodeId);

        // The stop marker is not a node execution - it reads as its own event.
        const isStopMarker = record.nodeType === "cancelled";

        const meta = isStopMarker
          ? ({ label: "Stopped", color: "info" } as const)
          : (STATUS_META[record.status] ?? STATUS_META.pending);
        const color = theme.palette[meta.color].main;
        const detail = recordDetail(record);
        const executedAt = new Date(record.executedAt);

        return (
          <Box
            key={`${record.nodeId}-${index}`}
            sx={{
              p: 1.5,
              borderRadius: 1.5,
              border: "1px solid",
              borderColor:
                record.status === "failed"
                  ? alpha(theme.palette.error.main, 0.4)
                  : "divider",
              bgcolor:
                record.status === "failed"
                  ? alpha(theme.palette.error.main, 0.04)
                  : "background.paper",
            }}
          >
            <Stack direction="row" spacing={1.5}>
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  flexShrink: 0,
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: alpha(color, 0.12),
                  color,
                }}
              >
                <SvgIcon sx={{ fontSize: 16 }}>
                  {nodeIcon(record.nodeType)}
                </SvgIcon>
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  flexWrap="wrap"
                  useFlexGap
                >
                  <Typography variant="body2" fontWeight={600}>
                    {isStopMarker
                      ? "Automation stopped"
                      : node
                        ? describeNode(node)
                        : record.nodeType.replace(/_/g, " ")}
                  </Typography>
                  <Chip
                    size="small"
                    label={meta.label}
                    color={meta.color}
                    variant={record.status === "success" ? "outlined" : "filled"}
                    sx={{ height: 19, fontSize: "0.65rem", fontWeight: 700 }}
                  />
                </Stack>

                {detail && (
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mt: 0.4,
                      color:
                        record.status === "failed" && !isStopMarker
                          ? "error.main"
                          : "text.secondary",
                      lineHeight: 1.55,
                      wordBreak: "break-word",
                    }}
                  >
                    {detail}
                  </Typography>
                )}

                <Tooltip title={format(executedAt, "PPpp")}>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "inline-block",
                      mt: 0.4,
                      color: "text.disabled",
                    }}
                  >
                    {format(executedAt, "MMM d 'at' h:mm a")} ·{" "}
                    {formatDistanceToNow(executedAt, { addSuffix: true })}
                  </Typography>
                </Tooltip>
              </Box>
            </Stack>
          </Box>
        );
      })}
    </Stack>
  );
}
