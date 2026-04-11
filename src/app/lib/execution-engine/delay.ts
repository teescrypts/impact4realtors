/**
 * Delay Node Executor
 *
 * Waits for a specified duration before continuing
 * Uses Resend scheduled emails as the timer mechanism (no cron jobs!)
 */

import {
  IJourneyNode,
  ScheduledAction,
  LeadJourneyProgress,
} from "@/app/model/journey";
import { Resend } from "resend";
import { validateNodeConfig, getNextNode, handleExecutionError } from ".";
import Admin from "@/app/model/admin";

const resend = new Resend(process.env.RESEND_API_KEY!);

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
    const resumeAt = new Date();
    switch (config.unit) {
      case "minutes":
        resumeAt.setMinutes(resumeAt.getMinutes() + config.duration);
        break;
      case "hours":
        resumeAt.setHours(resumeAt.getHours() + config.duration);
        break;
      case "days":
        resumeAt.setDate(resumeAt.getDate() + config.duration);
        break;
    }

    console.log(`Will resume at: ${resumeAt.toISOString()}`);

    // Get next node to resume to
    const nextNode = getNextNode(progress.journey, node.id);

    if (!nextNode) {
      // No next node - journey complete
      console.log("No next node after delay, completing journey");
      await progress.complete();
      return;
    }

    const admin = await Admin.findById(progress.admin).select("email").lean();

    if (!admin) return;

    const resumePayload = {
      progressId: progress._id.toString(),
      nextNodeId: nextNode.id,
    };

    const scheduledEmail = await resend.emails.send({
      from: "system@realtyillustration.com", // Update domain
      to: admin.email, // Your webhook endpoint email
      subject: "Resume Journey",
      html: `<p>Resume journey</p><pre>${JSON.stringify(resumePayload, null, 2)}</pre>`,
      scheduledAt: resumeAt.toISOString(),
      tags: [
        {
          name: "progressId",
          value: progress._id.toString(),
        },
        {
          name: "nextNodeId",
          value: nextNode.id,
        },
      ],
    });

    if (scheduledEmail.error) {
      throw new Error(
        `Failed to schedule resume: ${scheduledEmail.error.message}`,
      );
    }

    console.log(`Scheduled resume email: ${scheduledEmail.data?.id}`);

    // Create scheduled action record
    await ScheduledAction.create({
      leadJourneyProgress: progress._id,
      journey: progress.journey._id,
      lead: progress.lead._id,
      admin: progress.admin,
      ...(progress?.agent && { agent: progress.agent }),
      nodeId: node.id,
      actionType: "resume_journey",
      scheduledFor: resumeAt,
      resendScheduledEmailId: scheduledEmail
        ? scheduledEmail.data?.id
        : `dev-${resumePayload.nextNodeId}`,
      status: "pending",
      payload: {
        type: "resume_journey",
        data: resumePayload,
      },
    });

    // Set waiting state
    progress.setWaiting({
      type: "delay",
      resumeAt: resumeAt,
      scheduledEmailId: scheduledEmail
        ? scheduledEmail.data?.id
        : `dev-${resumePayload.nextNodeId}`,
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
