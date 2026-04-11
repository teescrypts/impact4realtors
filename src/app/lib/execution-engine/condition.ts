/**
 * Condition Node Executor
 *
 * Implements if/else branching based on previous action results
 * (email opened? tag changed?)
 */

import {  IJourneyNode } from "@/app/model/journey";
import { validateNodeConfig, moveToNextNode, handleExecutionError } from ".";

/**
 * Execute condition node
 * Evaluates condition and branches to yes/no path
 *
 * @param progress - Lead journey progress
 * @param node - Condition node
 */
export async function executeCondition(
  progress: any,
  node: IJourneyNode,
): Promise<void> {
  try {
    // Validate node configuration
    if (!validateNodeConfig(node)) {
      throw new Error("Invalid condition node configuration");
    }

    const config = node.config as {
      type: "condition";
      checkType: "email_opened" | "tag_changed";
      description?: string;
    };

    console.log(`Evaluating condition: ${config.checkType}`);

    // Get the last execution record (the action we're checking)
    const lastExecution = progress.getLastExecution();

    if (!lastExecution) {
      console.error("No previous execution to check condition against");
      throw new Error("Cannot evaluate condition: no previous execution");
    }

    let conditionMet = false;

    // Evaluate based on check type
    switch (config.checkType) {
      case "email_opened":
        conditionMet = lastExecution.result?.emailOpened === true;
        console.log(`Email opened: ${conditionMet}`);
        break;

      case "tag_changed":
        conditionMet = lastExecution.result?.tagChanged === true;
        console.log(`Tag changed: ${conditionMet}`);
        break;

      default:
        throw new Error(`Unknown check type: ${config.checkType}`);
    }

    // Record execution
    progress.addExecutionRecord({
      nodeId: node.id,
      nodeType: "condition",
      status: "success",
      result: {
        conditionMet,
        checkType: config.checkType,
      },
    });

    await progress.save();

    console.log(`Condition result: ${conditionMet ? "YES" : "NO"}`);

    // Move to appropriate branch (yes or no)
    await moveToNextNode(progress, node, conditionMet ? "yes" : "no");
  } catch (error: any) {
    await handleExecutionError(progress, node, error);
  }
}
