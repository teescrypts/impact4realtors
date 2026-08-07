/**
 * Send Email Node Executor
 *
 * Sends automated emails to leads using Resend API
 */

import {
  IJourneyNode,
  LeadJourneyProgress,
  ScheduledAction,
} from "@/app/model/journey";
import { Resend } from "resend";
import { getNodeConfigError, moveToNextNode, handleExecutionError } from ".";
import { ObjectId } from "mongoose";
import replaceTemplateVariables from "@/app/utils/replace-template";
import Admin from "@/app/model/admin";
import Appointment from "@/app/model/appointment";
import HomeValuationRequest from "@/app/model/home-valuation-request";
import { capitalizeFirst } from "@/app/utils/capitalize-first-letter";
import { IProperty } from "@/app/model/property";
import { EmailBlock } from "@/app/lib/email/blocks";
import { renderEmail } from "@/app/lib/email/render";

const resend = new Resend(process.env.RESEND_API_KEY!);

/**
 * Execute send email node
 * Sends email immediately using Resend
 *
 * @param progress - Lead journey progress (populated with journey and lead)
 * @param node - Send email node
 */
export async function executeSendEmail(
  progress: any,
  node: IJourneyNode,
): Promise<void> {
  try {
    // Validate node configuration
    const configError = getNodeConfigError(node);
    if (configError) {
      throw new Error(`Invalid send_email node configuration: ${configError}`);
    }

    const config = node.config as {
      type: "send_email";
      subject: string;
      emailContent: string;
      emailBlocks?: EmailBlock[];
      fromName?: string;
    };

    const lead = progress.lead;

    console.log(`Sending email "${config.subject}" to ${lead.email}`);

    const agentDetails = await Admin.findById(lead.admin);

    let appointmentDetails;
    if (lead.appointmentId) {
      appointmentDetails = (await Appointment.findById(lead.appointmentId)
        .select("propertyId date bookedTime")
        .populate("propertyId")) as {
        propertyId?: IProperty;
        date: string;
        bookedTime: { from: string; to: string };
      };
    }

    const valuation = await HomeValuationRequest.findOne({ lead: lead._id });

    if (!agentDetails) return;

    // Blocks are the source of truth when present; the layout is composed here
    // so a design change applies to every email without touching journeys.
    const contentHtml =
      config.emailBlocks && config.emailBlocks.length > 0
        ? renderEmail(config.emailBlocks, {
            agentName: `${agentDetails.fname} ${agentDetails.lname}`,
            agentEmail: agentDetails.email,
            agentPhone: agentDetails.emailBranding?.phone,
            companyName: agentDetails.emailBranding?.companyName,
            logoUrl: agentDetails.emailBranding?.logoUrl,
            brandColor: agentDetails.emailBranding?.brandColor,
            footerNote: agentDetails.emailBranding?.footerNote,
          })
        : config.emailContent;

    // ✅ REPLACE TEMPLATE VARIABLES
    const replacedSubject = await replaceTemplateVariables(
      agentDetails,
      config.subject,
      lead,
      progress,
      valuation ? valuation : undefined,
      appointmentDetails,
    );

    const replacedContent = await replaceTemplateVariables(
      agentDetails,
      contentHtml,
      lead,
      progress,
      valuation ? valuation : undefined,
      appointmentDetails,
    );

    const emailDomain = `${capitalizeFirst(agentDetails.fname)} <support@realtyillustration.com>`;
    const progressId = progress._id as ObjectId;

    // Send email via Resend
    const emailResult = await resend.emails.send({
      from: config.fromName
        ? `${config.fromName} <support@realtyillustration.com>`
        : emailDomain,
      to: lead.email,
      subject: replacedSubject, // ✅ Use replaced subject
      html: replacedContent, // ✅ Use replaced content
      tags: [
        { name: "journey_id", value: progress.journey._id.toString() },
        { name: "progress_id", value: progressId.toString() },
        { name: "node_id", value: node.id },
      ],
    });

    if (emailResult.error) {
      throw new Error(`Resend error: ${emailResult.error.message}`);
    }

    console.log(`Email sent successfully, ID: ${emailResult.data?.id}`);

    // Create scheduled action record (for tracking)
    await ScheduledAction.create({
      leadJourneyProgress: progress._id,
      journey: progress.journey._id,
      lead: lead._id,
      admin: progress.admin,
      ...(progress.agent && { agent: progress.agent }),
      nodeId: node.id,
      actionType: "send_email",
      scheduledFor: new Date(),
      resendEmailId: emailResult.data?.id,
      status: "sent",
      payload: {
        type: "send_email",
        data: {
          to: lead.email,
          subject: replacedSubject, // ✅ Store replaced version
          htmlContent: replacedContent, // ✅ Store replaced version
          fromName: config.fromName,
        },
      },
    });

    // Record successful execution
    progress.addExecutionRecord({
      nodeId: node.id,
      nodeType: "send_email",
      status: "success",
      result: {
        emailId: emailResult.data?.id,
        emailOpened: false,
      },
    });

    await progress.save();

    // Move to next node
    await moveToNextNode(progress, node);
  } catch (error: any) {
    await handleExecutionError(progress, node, error);
  }
}

/**
 * Handle Resend webhook events (email opened, clicked, etc.)
 * Updates execution history when email is opened
 *
 * @param emailId - Resend email ID
 * @param event - Event type (opened, clicked, delivered, etc.)
 */
export async function handleResendWebhook(
  emailId: string,
  event: "opened" | "clicked" | "delivered" | "bounced" | "complained" | "sent",
): Promise<void> {
  try {
    // Find the scheduled action
    const action = await ScheduledAction.findByResendEmailId(emailId);

    if (!action) {
      console.log(`No action found for email ${emailId}`);
      return;
    }

    // Find the progress
    const progress: any = await LeadJourneyProgress.findById(
      action.leadJourneyProgress,
    );

    if (!progress) {
      console.log(`No progress found for action ${action._id}`);
      return;
    }

    // Update execution history
    const executionRecord = progress.executionHistory.find(
      (record: { result?: { emailId: string } }) =>
        record.result?.emailId === emailId,
    );

    if (executionRecord) {
      if (event === "opened") {
        executionRecord.result = {
          ...executionRecord.result,
          emailOpened: true,
        };
      } else if (event === "clicked") {
        executionRecord.result = {
          ...executionRecord.result,
          emailClicked: true,
        };
      }

      progress.markModified("executionHistory");
      await progress.save();
      console.log(`Updated email ${emailId} status: ${event}`);
    }

    // A condition node may be parked waiting on this email. Engagement
    // resolves it straight away instead of sitting out the whole window.
    if (event === "opened" || event === "clicked") {
      const { resumeFromEmailEvent } = await import("./condition");
      await resumeFromEmailEvent(emailId);
    }
  } catch (error) {
    console.error("Error handling Resend webhook:", error);
  }
}
