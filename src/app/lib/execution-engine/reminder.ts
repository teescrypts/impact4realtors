/**
 * Reminder Node Executor
 *
 * Sends reminders to real estate agents
 * (meeting, SMS, call reminders)
 */

import Admin from "@/app/model/admin";
import { IJourneyNode, ScheduledAction } from "@/app/model/journey";
import { ILead } from "@/app/model/lead";
import { Resend } from "resend";
import { validateNodeConfig, moveToNextNode, handleExecutionError } from ".";
import replaceTemplateVariables from "@/app/utils/replace-template";
import Appointment, { IAppointment } from "@/app/model/appointment";
import { IProperty } from "@/app/model/property";

const resend = new Resend(process.env.RESEND_API_KEY!);

/**
 * Execute reminder node
 * Sends email reminder to the agent about the lead
 *
 * @param progress - Lead journey progress
 * @param node - Reminder node (meeting/sms/call)
 */
export async function executeReminder(
  progress: any,
  node: IJourneyNode,
): Promise<void> {
  try {
    // Validate node configuration
    if (!validateNodeConfig(node)) {
      throw new Error("Invalid reminder node configuration");
    }

    const config = node.config as
      | { type: "meeting_reminder"; message: string; title?: string }
      | { type: "sms_reminder"; message: string }
      | { type: "call_reminder"; message: string; phoneNumber?: string };

    const lead = progress.lead;

    // Get admin/agent details
    const admin = progress?.agent
      ? await Admin.findById(progress.agent)
      : await Admin.findById(progress.admin);

    if (!admin || !admin.email) {
      throw new Error("Admin email not found");
    }

    console.log(
      `Sending ${config.type} to agent ${admin.email} about lead ${lead.email}`,
    );

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

    console.log(appointmentDetails);

    // Build reminder email
    const reminderType = config.type.replace("_reminder", "").toUpperCase();
    const subject =
      config.type === "meeting_reminder" && config.title
        ? await replaceTemplateVariables(
            admin,
            config.title,
            lead,
            progress,
            undefined,
            appointmentDetails,
          )
        : `${reminderType} Reminder: ${lead.firstName} ${lead.lastName}`;

    const htmlContent = await buildReminderEmail(
      config,
      lead,
      admin,
      progress,
      appointmentDetails,
    );

    // Send reminder email to agent
    const emailResult = await resend.emails.send({
      from: "Automation <system@realtyillustration.com>",
      to: admin.email,
      subject,
      html: htmlContent,
      tags: [
        { name: "type", value: "agent_reminder" },
        { name: "reminder_type", value: config.type },
        { name: "lead_id", value: lead._id.toString() },
      ],
    });

    if (emailResult.error) {
      throw new Error(`Resend error: ${emailResult.error.message}`);
    }

    console.log(`Reminder sent successfully, ID: ${emailResult.data?.id}`);

    // Create scheduled action record
    await ScheduledAction.create({
      leadJourneyProgress: progress._id,
      journey: progress.journey._id,
      lead: lead._id,
      admin: progress.admin,
      ...(lead?.agent && { agent: lead.agent }),
      nodeId: node.id,
      actionType: config.type,
      scheduledFor: new Date(),
      resendEmailId: emailResult.data?.id,
      status: "sent",
      payload: {
        type: config.type,
        data: {
          agentEmail: admin.email,
          message: config.message,
          leadName: `${lead.firstName} ${lead.lastName}`,
          leadEmail: lead.email,
          leadPhone: lead.phone,
          metadata: {
            title:
              config.type === "meeting_reminder" ? config.title : undefined,
          },
        },
      },
    });

    // Record execution
    progress.addExecutionRecord({
      nodeId: node.id,
      nodeType: config.type,
      status: "success",
      result: {
        emailId: emailResult.data?.id,
        sentTo: admin.email,
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
 * Build reminder email HTML
 * Creates a nicely formatted email for the agent
 */
async function buildReminderEmail(
  config: any,
  lead: ILead,
  admin: any,
  progress: any,
  appointmentDetails?: {
    propertyId?: IProperty;
    date: string;
    bookedTime: { from: string; to: string };
  },
): Promise<string> {
  const reminderType = config.type.replace("_reminder", "").toUpperCase();

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 10px 10px 0 0;
          text-align: center;
        }
        .content {
          background: #f9fafb;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .lead-info {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .lead-info h3 {
          margin-top: 0;
          color: #667eea;
        }
        .info-row {
          padding: 10px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .label {
          font-weight: 600;
          color: #6b7280;
          display: inline-block;
          width: 120px;
        }
        .message {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .cta {
          text-align: center;
          margin: 30px 0;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: #667eea;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🔔 ${reminderType} Reminder</h1>
        <p>Action Required</p>
      </div>
      
      <div class="content">
        <div class="message">
          <strong>Note:</strong> ${await replaceTemplateVariables(admin, config.message, lead, progress, undefined, appointmentDetails)}
        </div>

        <div class="lead-info">
          <h3>Lead Information</h3>
          <div class="info-row">
            <span class="label">Name:</span>
            <span>${lead.firstName} ${lead.lastName}</span>
          </div>
          <div class="info-row">
            <span class="label">Email:</span>
            <span><a href="mailto:${lead.email}">${lead.email}</a></span>
          </div>
          <div class="info-row">
            <span class="label">Phone:</span>
            <span><a href="tel:${lead.phone}">${lead.phone}</a></span>
          </div>
          <div class="info-row">
            <span class="label">Type:</span>
            <span>${lead.category} - ${lead.intent}</span>
          </div>
          ${
            lead.notes
              ? `
          <div class="info-row">
            <span class="label">Notes:</span>
            <span>${lead.notes}</span>
          </div>
          `
              : ""
          }
        </div>

        ${
          config.type === "call_reminder"
            ? `
        <div class="cta">
          <a href="tel:${lead.phone}" class="button">📞 Call Now</a>
        </div>
        `
            : ""
        }

        ${
          config.type === "sms_reminder"
            ? `
        <div class="cta">
          <a href="sms:${lead.phone}" class="button">💬 Send SMS</a>
        </div>
        `
            : ""
        }

        ${
          config.type === "meeting_reminder"
            ? `
        <div class="cta">
          <a href="mailto:${lead.email}?subject=Meeting Request" class="button">📅 Schedule Meeting</a>
        </div>
        `
            : ""
        }

        <p style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px;">
          This is an automated reminder from your Journey Automation system.
        </p>
      </div>
    </body>
    </html>
  `;
}
