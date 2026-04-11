/**
 * Journey Execution Engine - Core Module
 *
 * This is the brain of the journey automation system.
 * It handles executing nodes, moving leads through journeys,
 * and managing waiting states.
 */

import {
  LeadJourneyProgress,
  IJourney,
  IJourneyNode,
} from "@/app/model/journey";
import { ILead } from "@/app/model/lead";
import { executeCondition } from "./condition";
import { executeDelay } from "./delay";
import { executeReminder } from "./reminder";
import { executeSendEmail } from "./send-email";
import { executeTrigger } from "./trigger";

/**
 * Main execution dispatcher
 * Routes to appropriate executor based on node type
 *
 * @param progressId - LeadJourneyProgress ID
 */
export async function executeNextNode(progressId: string): Promise<void> {
  try {
    // Fetch progress with populated data
    const progress = await LeadJourneyProgress.findById(progressId)
      .populate<{ journey: IJourney }>("journey")
      .populate<{ lead: ILead }>("lead");

    if (!progress) {
      console.error(`Progress ${progressId} not found`);
      return;
    }

    // Check if progress is still active
    if (progress.status !== "active") {
      console.log(
        `Progress ${progressId} is ${progress.status}, skipping execution`,
      );
      return;
    }

    // Get current node
    const currentNode = progress.journey.nodes.find(
      (node: { id: string }) => node.id === progress.currentNodeId,
    );

    if (!currentNode) {
      // Journey complete - no more nodes
      console.log(
        `Journey ${progress.journey.name} completed for lead ${progress.lead.email}`,
      );
      await progress.complete();
      return;
    }

    console.log(
      `Executing node ${currentNode.id} (${currentNode.type}) for lead ${progress.lead.email}`,
    );

    // Dispatch to appropriate executor based on node type
    switch (currentNode.type) {
      case "entry":
        // Entry node - just move to next
        await moveToNextNode(progress, currentNode);
        break;

      case "send_email":
        await executeSendEmail(progress, currentNode);
        break;

      case "delay":
        await executeDelay(progress, currentNode);
        break;

      case "trigger":
        await executeTrigger(progress, currentNode);
        break;

      case "condition":
        await executeCondition(progress, currentNode);
        break;

      case "meeting_reminder":
      case "sms_reminder":
      case "call_reminder":
        await executeReminder(progress, currentNode);
        break;

      default:
        console.error(`Unknown node type: ${currentNode.type}`);
        progress.addExecutionRecord({
          nodeId: currentNode.id,
          nodeType: currentNode.type,
          status: "failed",
          result: { error: `Unknown node type: ${currentNode.type}` },
        });
        await progress.save();
    }
  } catch (error: any) {
    console.error("Error executing node:", error);

    // Try to mark progress as failed
    try {
      const progress = await LeadJourneyProgress.findById(progressId);
      if (progress && progress.canRetry()) {
        progress.incrementRetry();
        await progress.save();

        // Retry after a delay (exponential backoff)
        const retryDelay = Math.pow(2, progress.retryCount) * 1000; // 2s, 4s, 8s
        setTimeout(() => executeNextNode(progressId), retryDelay);
      } else if (progress) {
        await progress.fail(`Execution error: ${error.message}`);
      }
    } catch (failError) {
      console.error("Error marking progress as failed:", failError);
    }
  }
}

/**
 * Move to the next node in the journey
 * Handles finding the next node via edges and continuing execution
 *
 * @param progress - Lead journey progress
 * @param currentNode - Current node
 * @param edgeLabel - Optional edge label for branching (yes/no)
 */
export async function moveToNextNode(
  progress: any,
  currentNode: IJourneyNode,
  edgeLabel?: "yes" | "no",
): Promise<void> {
  const journey = progress.journey;

  // Find outgoing edges from current node
  let edges = journey.edges.filter(
    (edge: { source: string }) => edge.source === currentNode.id,
  );

  if (edges.length === 0) {
    // No more nodes - journey complete
    console.log(`No more nodes after ${currentNode.id}, completing journey`);
    await progress.complete();
    return;
  }

  if (edges.length > 1 && !edgeLabel) {
    // Multiple edges but no label specified - this shouldn't happen
    console.error(
      `Node ${currentNode.id} has multiple edges but no label specified. Using first edge.`,
    );
  }

  // If edge label specified (for conditions), filter by label
  if (edgeLabel) {
    edges = edges.filter((edge: { label: string }) => edge.label === edgeLabel);
  }

  // Take the first matching edge
  const nextEdge = edges[0];
  const nextNodeId = nextEdge.target;

  // Update progress to next node
  progress.moveToNode(nextNodeId);
  await progress.save();

  console.log(`Moved to next node: ${nextNodeId}`);

  // Continue execution
  await executeNextNode(progress._id.toString());
}

/**
 * Get the next node(s) from current node
 * Helper function for executors
 *
 * @param journey - Journey document
 * @param currentNodeId - Current node ID
 * @param edgeLabel - Optional edge label for branching
 * @returns Next node or null
 */
export function getNextNode(
  journey: IJourney,
  currentNodeId: string,
  edgeLabel?: "yes" | "no",
): IJourneyNode | null {
  let edges = journey.edges.filter(
    (edge: { source: string }) => edge.source === currentNodeId,
  );

  if (edgeLabel) {
    edges = edges.filter((edge: any) => edge.label === edgeLabel);
  }

  if (edges.length === 0) {
    return null;
  }

  const nextEdge = edges[0];
  return (
    journey.nodes.find((node: { id: string }) => node.id === nextEdge.target) ||
    null
  );
}

/**
 * Handle error in node execution
 * Records error and decides whether to retry or fail
 *
 * @param progress - Lead journey progress
 * @param currentNode - Current node
 * @param error - Error that occurred
 */
export async function handleExecutionError(
  progress: any,
  currentNode: IJourneyNode,
  error: Error,
): Promise<void> {
  console.error(
    `Error executing node ${currentNode.id} (${currentNode.type}):`,
    error,
  );

  // Record the error
  progress.addExecutionRecord({
    nodeId: currentNode.id,
    nodeType: currentNode.type,
    status: "failed",
    result: { error: error.message },
  });

  // Check if we can retry
  if (progress.canRetry()) {
    console.log(
      `Retrying node ${currentNode.id}, attempt ${progress.retryCount + 1}`,
    );
    progress.incrementRetry();
    await progress.save();

    // Retry with exponential backoff
    const retryDelay = Math.pow(2, progress.retryCount) * 1000;
    setTimeout(() => executeNextNode(progress._id.toString()), retryDelay);
  } else {
    // Max retries reached - fail the journey
    console.error(
      `Max retries reached for node ${currentNode.id}, failing journey`,
    );
    await progress.fail(`Node execution failed: ${error.message}`);
  }
}

/**
 * Validate node configuration before execution
 * Ensures node has all required fields
 *
 * @param node - Journey node
 * @returns true if valid, false otherwise
 */
export function validateNodeConfig(node: IJourneyNode): boolean {
  const config = node.config;

  switch (config.type) {
    case "send_email":
      return !!(config.subject && config.emailContent);

    case "delay":
      return !!(config.duration && config.unit);

    case "trigger":
      return !!config.waitForTag;

    case "condition":
      return !!config.checkType;

    case "meeting_reminder":
    case "sms_reminder":
    case "call_reminder":
      return !!config.message;

    case "entry":
      return true;

    default:
      return false;
  }
}
