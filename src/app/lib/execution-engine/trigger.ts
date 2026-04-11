/**
 * Trigger Node Executor
 *
 * Waits for a specific tag to be assigned to the lead
 * Journey pauses until the tag change occurs
 */

import {
  IJourneyNode,
  LeadJourneyProgress,
} from "@/app/model/journey";
import { validateNodeConfig, getNextNode, handleExecutionError } from ".";

/**
 * Execute trigger node
 * Sets waiting state for specific tag
 *
 * @param progress - Lead journey progress
 * @param node - Trigger node
 */
export async function executeTrigger(
  progress: any,
  node: IJourneyNode,
): Promise<void> {
  try {
    // Validate node configuration
    if (!validateNodeConfig(node)) {
      throw new Error("Invalid trigger node configuration");
    }

    const config = node.config as {
      type: "trigger";
      waitForTag: string;
      description?: string;
    };

    console.log(`Waiting for tag: ${config.waitForTag}`);

    // Get next node to resume to
    const nextNode = getNextNode(progress.journey, node.id);

    if (!nextNode) {
      // No next node - journey complete
      console.log("No next node after trigger, completing journey");
      await progress.complete();
      return;
    }

    // Set waiting state
    progress.setWaiting({
      type: "trigger",
      waitingForTag: config.waitForTag,
    });

    // Record execution
    progress.addExecutionRecord({
      nodeId: node.id,
      nodeType: "trigger",
      status: "success",
      result: {
        waitingForTag: config.waitForTag,
      },
    });

    await progress.save();

    console.log(
      `Journey paused, waiting for tag "${config.waitForTag}" on lead ${progress.lead.email}`,
    );
  } catch (error: any) {
    await handleExecutionError(progress, node, error);
  }
}

/**
 * Resume journey after tag trigger
 * Called when a lead gets the tag we're waiting for
 *
 * @param leadId - Lead ID
 * @param tagName - Tag that was assigned
 */
export async function resumeFromTrigger(
  leadId: string,
  tagName: string,
): Promise<void> {
  try {
    console.log(
      `Checking for journeys waiting for tag "${tagName}" on lead ${leadId}`,
    );

    // Find all active progresses waiting for this tag
    const waitingProgresses: any = await LeadJourneyProgress.findWaitingForTag(
      leadId,
      tagName,
    );

    if (waitingProgresses.length === 0) {
      console.log(`No progresses waiting for tag "${tagName}"`);
      return;
    }

    console.log(
      `Found ${waitingProgresses.length} progresses waiting for tag "${tagName}"`,
    );

    // Resume each waiting progress
    for (const progress of waitingProgresses) {
      try {
        console.log(`Resuming journey ${progress.journey.name}`);

        // Update execution history to record tag was received
        const lastExecution = progress.getLastExecution();
        if (lastExecution) {
          lastExecution.result = {
            ...lastExecution.result,
            tagChanged: true,
            receivedTag: tagName,
          };
        }

        // Clear waiting state
        progress.clearWaiting();

        // Get the next node from the trigger node
        const triggerNodeId = lastExecution?.nodeId;
        if (triggerNodeId) {
          const nextNode = getNextNode(progress.journey, triggerNodeId);
          if (nextNode) {
            progress.moveToNode(nextNode.id);
          }
        }

        await progress.save();

        // Continue execution
        const { executeNextNode } = await import("./index");
        await executeNextNode(progress._id.toString());
      } catch (error) {
        console.error(`Error resuming progress ${progress._id}:`, error);
      }
    }
  } catch (error) {
    console.error("Error resuming from trigger:", error);
  }
}
