/**
 * Delay Node Executor
 *
 * Waits for a specified duration before continuing
 * Uses Resend scheduled emails as the timer mechanism (no cron jobs!)
 */

import {
  IJourneyNode,
  LeadJourneyProgress,
  ScheduledAction,
} from "@/app/model/journey";
import { validateNodeConfig, getNextNode, handleExecutionError } from ".";
import { addDuration, scheduleJourneyResume } from "./scheduler";

/**
 * Execute delay node
 * Sets waiting state and schedules resume via Resend
 *
 * @param progress - Lead journey progress
 * @param node - Delay node
 */
export async function executeDelay(
  progress: any,
  node: IJourneyNode,
): Promise<void> {
  try {
    // Validate node configuration
    if (!validateNodeConfig(node)) {
      throw new Error("Invalid delay node configuration");
    }

    const config = node.config as {
      type: "delay";
      duration: number;
      unit: "minutes" | "hours" | "days";
    };

    console.log(`Delaying for ${config.duration} ${config.unit}`);

    // Calculate resume time
    const resumeAt = addDuration(new Date(), config.duration, config.unit);

    console.log(`Will resume at: ${resumeAt.toISOString()}`);

    // Get next node to resume to
    const nextNode = getNextNode(progress.journey, node.id);

    if (!nextNode) {
      // No next node - journey complete
      console.log("No next node after delay, completing journey");
      await progress.complete();
      return;
    }

    const { scheduledEmailId, scheduledFor } = await scheduleJourneyResume({
      progress,
      nodeId: node.id,
      resumeAt,
      kind: "delay",
      nextNodeId: nextNode.id,
    });

    // Set waiting state
    progress.setWaiting({
      type: "delay",
      resumeAt: scheduledFor,
      scheduledEmailId,
    });

    // Record execution
    progress.addExecutionRecord({
      nodeId: node.id,
      nodeType: "delay",
      status: "success",
      result: {
        resumeAt: resumeAt.toISOString(),
      },
    });

    await progress.save();

    console.log(`Delay set, journey will resume at ${resumeAt.toISOString()}`);
  } catch (error: any) {
    await handleExecutionError(progress, node, error);
  }
}

/**
 * Resume journey after delay
 * Called by webhook when scheduled email is received
 *
 * @param progressId - Progress ID
 * @param nextNodeId - Next node to execute
 */
export async function resumeFromDelay(
  progressId: string,
  nextNodeId: string,
): Promise<void> {
  try {
    const progress = await LeadJourneyProgress.findById(progressId)
      .populate("journey")
      .populate("lead");

    if (!progress) {
      console.error(`Progress ${progressId} not found`);
      return;
    }

    // Verify still in waiting state
    if (progress.status !== "active" || progress.waitingFor?.type !== "delay") {
      console.log(
        `Progress ${progressId} not waiting for delay, status: ${progress.status}`,
      );
      return;
    }

    // console.log(`Resuming journey ${progress.journey.name} from delay`);

    // Clear waiting state
    progress.clearWaiting();

    // Move to next node
    progress.moveToNode(nextNodeId);

    await progress.save();

    // Mark scheduled action as sent
    const action = await ScheduledAction.findOne({
      leadJourneyProgress: progressId,
      nodeId:
        progress.executionHistory[progress.executionHistory.length - 1]?.nodeId,
      actionType: "resume_journey",
      status: "pending",
    });

    if (action) {
      await action.markAsSent();
    }

    // Continue execution
    const { executeNextNode } = await import("./index");
    await executeNextNode(progressId);
  } catch (error) {
    console.error("Error resuming from delay:", error);
  }
}
