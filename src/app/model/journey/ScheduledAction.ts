import mongoose, { Schema, Document, Model } from "mongoose";
import { clearModelInDev } from "@/app/lib/register-model";

// ======================
//  TYPE DEFINITIONS
// ======================

export type ActionType =
  | "send_email"
  | "meeting_reminder"
  | "sms_reminder"
  | "call_reminder"
  | "resume_journey"; // Special type for resuming after delays

export type ActionStatus = "pending" | "sent" | "failed" | "cancelled";

// Email Payload
export interface IEmailPayload {
  to: string;
  subject: string;
  htmlContent: string;
  fromName?: string;
  replyTo?: string;
}

// Reminder Payload
export interface IReminderPayload {
  agentEmail: string;
  message: string;
  title?: string;
  leadName?: string;
  leadEmail?: string;
  leadPhone?: string;
  metadata?: Record<string, any>;
}

// Resume Journey Payload
export interface IResumeJourneyPayload {
  progressId: string;
  nextNodeId: string;
}

// Union of all possible payloads
export type ActionPayload =
  | { type: "send_email"; data: IEmailPayload }
  | { type: "meeting_reminder"; data: IReminderPayload }
  | { type: "sms_reminder"; data: IReminderPayload }
  | { type: "call_reminder"; data: IReminderPayload }
  | { type: "resume_journey"; data: IResumeJourneyPayload };

// ======================
//  SCHEDULED ACTION INTERFACE
// ======================
export interface IScheduledAction extends Document, IScheduledActionMethods {
  // References
  leadJourneyProgress: Schema.Types.ObjectId;
  journey: Schema.Types.ObjectId;
  lead: Schema.Types.ObjectId;
  admin: Schema.Types.ObjectId;
  agent?: Schema.Types.ObjectId;

  // Node Info
  nodeId: string;
  actionType: ActionType;

  // Scheduling
  scheduledFor: Date;
  resendScheduledEmailId?: string; // Resend's scheduled email ID
  resendEmailId?: string; // Resend's final email ID (after sent)

  // Status
  status: ActionStatus;

  // Action Data
  payload: ActionPayload;

  // Execution Details
  executedAt?: Date;
  failedAt?: Date;
  cancelledAt?: Date;

  // Error Tracking
  error?: string;
  retryCount: number;
  maxRetries: number;

  // Metadata
  metadata?: Record<string, any>;

  createdAt: Date;
  updatedAt: Date;
}

// ======================
//  STATICS INTERFACE
// ======================

// export interface IScheduledActionModel extends Model<
//   IScheduledAction,
//   {},
//   IScheduledActionMethods
// > {
//   findReadyToExecute(): Promise<IScheduledAction[]>;
//   findPendingByProgress(progressId: string): Promise<IScheduledAction[]>;
//   cancelAllByProgress(progressId: string): Promise<number>;
//   findByResendEmailId(emailId: string): Promise<IScheduledAction | null>;
//   getStatsByAdmin(adminId: string): Promise<Record<ActionStatus, number>>;
// }

export interface IScheduledActionModel extends Model<
  IScheduledAction,
  Record<string, never>,
  IScheduledActionMethods
> {
  findReadyToExecute(): Promise<IScheduledAction[]>;
  findPendingByProgress(progressId: string): Promise<IScheduledAction[]>;
  cancelAllByProgress(progressId: string): Promise<number>;
  findByResendEmailId(emailId: string): Promise<IScheduledAction | null>;
  getStatsByAdmin(adminId: string): Promise<Record<ActionStatus, number>>;
}

export interface IScheduledActionMethods {
  markAsSent(emailId?: string): Promise<IScheduledAction>;
  markAsFailed(error: string): Promise<IScheduledAction>;
  cancel(): Promise<IScheduledAction>;
  canRetry(): boolean;
  incrementRetry(): Promise<IScheduledAction>;
  isOverdue(): boolean;
}

// ======================
//  SCHEMA DEFINITION
// ======================
const ScheduledActionSchema = new Schema<IScheduledAction>(
  {
    leadJourneyProgress: {
      type: Schema.Types.ObjectId,
      ref: "LeadJourneyProgress",
      required: true,
      index: true,
    },

    journey: {
      type: Schema.Types.ObjectId,
      ref: "Journey",
      required: true,
      index: true,
    },

    lead: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
      index: true,
    },

    admin: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      index: true,
    },

    agent: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      index: true,
    },

    nodeId: {
      type: String,
      required: true,
    },

    actionType: {
      type: String,
      enum: [
        "send_email",
        "meeting_reminder",
        "sms_reminder",
        "call_reminder",
        "resume_journey",
      ],
      required: true,
      index: true,
    },

    scheduledFor: {
      type: Date,
      required: true,
      index: true,
    },

    resendScheduledEmailId: {
      type: String,
      // index: true,
    },

    resendEmailId: {
      type: String,
      // index: true,
    },

    status: {
      type: String,
      enum: ["pending", "sent", "failed", "cancelled"],
      required: true,
      default: "pending",
      index: true,
    },

    payload: {
      type: Schema.Types.Mixed,
      required: true,
    },

    executedAt: {
      type: Date,
    },

    failedAt: {
      type: Date,
    },

    cancelledAt: {
      type: Date,
    },

    error: {
      type: String,
    },

    retryCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    maxRetries: {
      type: Number,
      default: 3,
      min: 0,
    },

    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

// ======================
//  INDEXES
// ======================
ScheduledActionSchema.index({ admin: 1, status: 1 });
ScheduledActionSchema.index({ status: 1, scheduledFor: 1 });
ScheduledActionSchema.index({ leadJourneyProgress: 1, status: 1 });
ScheduledActionSchema.index({ resendScheduledEmailId: 1 });
ScheduledActionSchema.index({ resendEmailId: 1 });

// Compound index for finding pending actions ready to execute
ScheduledActionSchema.index({
  status: 1,
  scheduledFor: 1,
  actionType: 1,
});

// ======================
//  METHODS
// ======================

// Mark as sent
ScheduledActionSchema.methods.markAsSent = function (emailId?: string) {
  this.status = "sent";
  this.executedAt = new Date();
  if (emailId) {
    this.resendEmailId = emailId;
  }
  return this.save();
};

// Mark as failed
ScheduledActionSchema.methods.markAsFailed = function (error: string) {
  this.status = "failed";
  this.failedAt = new Date();
  this.error = error;
  return this.save();
};

// Mark as cancelled
ScheduledActionSchema.methods.cancel = function () {
  this.status = "cancelled";
  this.cancelledAt = new Date();
  return this.save();
};

// Check if can retry
ScheduledActionSchema.methods.canRetry = function (): boolean {
  return this.retryCount < this.maxRetries;
};

// Increment retry count
ScheduledActionSchema.methods.incrementRetry = function () {
  this.retryCount += 1;
  return this.save();
};

// Check if overdue
ScheduledActionSchema.methods.isOverdue = function (): boolean {
  return this.status === "pending" && new Date() > this.scheduledFor;
};

// ======================
//  STATICS
// ======================

// Find pending actions ready to execute
ScheduledActionSchema.statics.findReadyToExecute = function () {
  return this.find({
    status: "pending",
    scheduledFor: { $lte: new Date() },
  })
    .populate(["lead", "journey", "leadJourneyProgress"])
    .sort({ scheduledFor: 1 });
};

// Find all pending actions for a lead journey
ScheduledActionSchema.statics.findPendingByProgress = function (
  progressId: string,
) {
  return this.find({
    leadJourneyProgress: progressId,
    status: "pending",
  }).sort({ scheduledFor: 1 });
};

// Cancel all pending actions for a journey progress
ScheduledActionSchema.statics.cancelAllByProgress = async function (
  progressId: string,
) {
  const actions = await this.find({
    leadJourneyProgress: progressId,
    status: "pending",
  });

  for (const action of actions) {
    await action.cancel();
  }

  return actions.length;
};

// Find action by Resend email ID
ScheduledActionSchema.statics.findByResendEmailId = function (emailId: string) {
  return this.findOne({
    $or: [{ resendScheduledEmailId: emailId }, { resendEmailId: emailId }],
  }).populate(["lead", "journey", "leadJourneyProgress"]);
};

// Get stats for admin
ScheduledActionSchema.statics.getStatsByAdmin = async function (
  adminId: string,
) {
  const stats = await this.aggregate([
    { $match: { admin: new mongoose.Types.ObjectId(adminId) } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  return stats.reduce(
    (acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    },
    {} as Record<ActionStatus, number>,
  );
};

// ======================
//  PRE-SAVE HOOKS
// ======================

// Validate payload structure based on action type
ScheduledActionSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("payload")) {
    const { type, data } = this.payload as ActionPayload;

    if (type !== this.actionType) {
      return next(
        new Error(
          `Payload type "${type}" does not match actionType "${this.actionType}"`,
        ),
      );
    }

    // Type-specific validations
    switch (type) {
      case "send_email":
        if (!data.to || !data.subject || !data.htmlContent) {
          return next(
            new Error("Invalid email payload: missing required fields"),
          );
        }
        break;

      case "meeting_reminder":
      case "sms_reminder":
      case "call_reminder":
        if (!data.agentEmail || !data.message) {
          return next(
            new Error("Invalid reminder payload: missing required fields"),
          );
        }
        break;

      case "resume_journey":
        if (!data.progressId || !data.nextNodeId) {
          return next(
            new Error(
              "Invalid resume journey payload: missing required fields",
            ),
          );
        }
        break;
    }
  }

  next();
});

// ======================
//  SAFE MODEL EXPORT
// ======================
clearModelInDev("ScheduledAction");

const ScheduledAction =
  (mongoose.models.ScheduledAction as IScheduledActionModel) ||
  mongoose.model<IScheduledAction, IScheduledActionModel>(
    "ScheduledAction",
    ScheduledActionSchema,
  );

export default ScheduledAction;
