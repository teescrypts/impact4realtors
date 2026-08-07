/**
 * Condition Node Executor
 *
 * Implements if/else branching based on previous action results
 * (email opened? tag changed?)
 *
 * An "email opened" check is not answerable at the moment the email is sent,
 * so this node behaves like delay/trigger: it parks the journey and resolves
 * when either the open arrives or the wait window expires.
 */

import {
  IJourneyNode,
  LeadJourneyProgress,
  ScheduledAction,
} from "@/app/model/journey";
import { IExecutionRecord } from "@/app/model/journey/LeadJourneyProgress";
import { validateNodeConfig, moveToNextNode, handleExecutionError } from ".";
import { addDuration, DurationUnit, scheduleJourneyResume } from "./scheduler";

/** Applied to condition nodes saved before the wait window was configurable. */
export const DEFAULT_OPEN_WINDOW: { duration: number; unit: DurationUnit } = {
  duration: 2,
  unit: "days",
};

type ConditionConfig = {
  type: "condition";
  checkType: "email_opened" | "tag_changed";
  description?: string;
  waitFor?: { duration: number; unit: DurationUnit };
};

/**
 * Find the most recent email this journey sent.
 *
 * Deliberately not `getLastExecution()`: any node between the email and the
 * condition (a delay, a reminder) would otherwise be the record we inspect,
 * and it carries no open state.
 */
function findLastEmailRecord(progress: any): IExecutionRecord | null {
  const history: IExecutionRecord[] = progress.executionHistory ?? [];

  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].nodeType === "send_email" && history[i].result?.emailId) {
      return history[i];
    }
  }

  return null;
}

/** A click implies engagement even when the tracking pixel never loaded. */
function wasEngaged(record: IExecutionRecord | null): boolean {
  return record?.result?.emailOpened === true ||
    record?.result?.emailClicked === true;
}

/**
 * Close out the timeout timer once the condition has resolved.
 *
 * When an open resolves the condition early the timer email is still queued at
 * Resend and will arrive later; the claim guard makes that harmless, but the
 * record should not sit "pending" forever.
 */
async function closeConditionTimer(
  progressId: string,
  nodeId: string,
  cancelled: boolean,
): Promise<void> {
  try {
    const action = await ScheduledAction.findOne({
      leadJourneyProgress: progressId,
      nodeId,
      actionType: "resume_journey",
      status: "pending",
    });

    if (!action) return;

    if (cancelled) {
      await action.cancel();
    } else {
      await action.markAsSent();
    }
  } catch (error) {
    // Bookkeeping only — never block the journey on this.
    console.error("Failed to close condition timer record:", error);
  }
}

/**
 * Write the condition's outcome and follow the matching branch.
 * Shared by all three resolution paths (immediate, on-open, on-timeout).
 */
async function resolveCondition(
  progress: any,
  node: IJourneyNode,
  conditionMet: boolean,
  reason: string,
): Promise<void> {
  const config = node.config as ConditionConfig;

  progress.addExecutionRecord({
    nodeId: node.id,
    nodeType: "condition",
    status: "success",
    result: {
      conditionMet,
      metadata: { checkType: config.checkType, reason },
    },
  });

  await progress.save();

  console.log(
    `Condition ${node.id} resolved ${conditionMet ? "YES" : "NO"} (${reason})`,
  );

  await moveToNextNode(progress, node, conditionMet ? "yes" : "no");
}

/**
 * Execute condition node
 *
 * @param progress - Lead journey progress
 * @param node - Condition node
 */
export async function executeCondition(
  progress: any,
  node: IJourneyNode,
): Promise<void> {
  try {
    if (!validateNodeConfig(node)) {
      throw new Error("Invalid condition node configuration");
    }

    const config = node.config as ConditionConfig;

    console.log(`Evaluating condition: ${config.checkType}`);

    // ── tag_changed resolves immediately off the last execution ──
    if (config.checkType === "tag_changed") {
      const lastExecution = progress.getLastExecution();
      const conditionMet = lastExecution?.result?.tagChanged === true;
      await resolveCondition(progress, node, conditionMet, "tag_changed check");
      return;
    }

    // ── email_opened ──
    const emailRecord = findLastEmailRecord(progress);

    if (!emailRecord) {
      // Mis-wired journey: a condition with no email before it. Take the "no"
      // branch rather than failing the whole journey over a builder mistake.
      console.error(
        `Condition ${node.id} has no preceding send_email; taking "no" branch`,
      );
      await resolveCondition(progress, node, false, "no preceding email");
      return;
    }

    // Already engaged — the webhook beat us here.
    if (wasEngaged(emailRecord)) {
      await resolveCondition(progress, node, true, "already opened");
      return;
    }

    // Park until the open arrives or the window closes.
    const waitFor = config.waitFor ?? DEFAULT_OPEN_WINDOW;
    const resumeAt = addDuration(new Date(), waitFor.duration, waitFor.unit);

    const { scheduledEmailId, scheduledFor } = await scheduleJourneyResume({
      progress,
      nodeId: node.id,
      resumeAt,
      kind: "condition_timeout",
    });

    progress.setWaiting({
      type: "email_event",
      resumeAt: scheduledFor,
      watchEmailId: emailRecord.result!.emailId,
      conditionNodeId: node.id,
      scheduledEmailId,
    });

    await progress.save();

    console.log(
      `Condition ${node.id} waiting up to ${waitFor.duration} ${waitFor.unit} ` +
        `for an open on email ${emailRecord.result!.emailId}`,
    );
  } catch (error: any) {
    await handleExecutionError(progress, node, error);
  }
}

/**
 * Resolve a parked condition because the lead opened (or clicked) the email.
 * Called from the Resend webhook handler.
 *
 * @param emailId - Resend email ID that was opened
 */
export async function resumeFromEmailEvent(emailId: string): Promise<void> {
  try {
    const waiting = await LeadJourneyProgress.findWaitingForEmail(emailId);

    if (!waiting) return; // Nothing parked on this email

    // Claim the wait so a simultaneous timeout cannot also resolve it.
    const progress: any = await LeadJourneyProgress.claimEmailWait(
      waiting._id as string,
    );

    if (!progress) {
      console.log(`Email wait for ${emailId} already resolved, skipping`);
      return;
    }

    const nodeId = waiting.waitingFor?.conditionNodeId;
    const node = progress.journey.nodes.find(
      (item: { id: string }) => item.id === nodeId,
    );

    if (!node) {
      console.error(`Condition node ${nodeId} not found; failing journey`);
      await progress.fail(`Condition node ${nodeId} missing on resume`);
      return;
    }

    await closeConditionTimer(progress._id.toString(), node.id, true);
    await resolveCondition(progress, node, true, "email opened");
  } catch (error) {
    console.error("Error resuming from email event:", error);
  }
}

/**
 * Resolve a parked condition because the wait window expired without an open.
 * Called by the timer webhook.
 *
 * @param progressId - Progress ID
 * @param nodeId - Condition node ID
 */
export async function resumeFromConditionTimeout(
  progressId: string,
  nodeId: string,
): Promise<void> {
  try {
    const progress: any = await LeadJourneyProgress.claimEmailWait(progressId);

    if (!progress) {
      console.log(
        `Condition timeout for ${progressId} arrived after resolution, skipping`,
      );
      return;
    }

    const node = progress.journey.nodes.find(
      (item: { id: string }) => item.id === nodeId,
    );

    if (!node) {
      console.error(`Condition node ${nodeId} not found; failing journey`);
      await progress.fail(`Condition node ${nodeId} missing on timeout`);
      return;
    }

    // Re-read the email record: an open may have been recorded without the
    // webhook resuming us (for example if it landed mid-write).
    const emailRecord = findLastEmailRecord(progress);
    const engaged = wasEngaged(emailRecord);

    await closeConditionTimer(progressId, nodeId, false);
    await resolveCondition(
      progress,
      node,
      engaged,
      engaged ? "opened before timeout" : "wait window expired",
    );
  } catch (error) {
    console.error("Error resuming from condition timeout:", error);
  }
}
