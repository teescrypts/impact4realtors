import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { clearModelInDev } from "@/app/lib/register-model";

// ======================
//  TYPE DEFINITIONS
// ======================

/**
 * `cancelled` is a terminal state, set when an agent stops the automation for
 * a lead - typically because they have made contact themselves and no longer
 * want the drip running.
 *
 * It is deliberately terminal rather than resumable. Delays are implemented as
 * scheduled emails that call back when they fire, and a stopped-then-restarted
 * journey would need those timers re-armed and de-duplicated. Re-tagging the
 * lead starts a fresh journey, which covers the same need without touching the
 * timer path.
 */
export type ProgressStatus =
  | "active"
  | "completed"
  | "paused"
  | "failed"
  | "cancelled";

export type ExecutionStatus = "success" | "failed" | "skipped" | "pending";

export type WaitingType = "delay" | "trigger" | "email_event";

// Execution Record for tracking node execution
export interface IExecutionRecord {
  nodeId: string;
  nodeType: string;
  executedAt: Date;
  status: ExecutionStatus;

  // Action-specific results
  result?: {
    emailId?: string; // Resend email ID
    emailOpened?: boolean;
    emailClicked?: boolean;
    tagChanged?: boolean;
    conditionMet?: boolean;
    error?: string;
    receivedTag?: string;
    metadata?: Record<string, any>; // Additional data
  };
}

// Waiting State for delays, triggers and email-event conditions
export interface IWaitingFor {
  type: WaitingType;
  resumeAt?: Date; // For delays - when to resume. For email_event - the deadline
  waitingForTag?: string; // For triggers - which tag we're waiting for
  scheduledEmailId?: string; // Resend scheduled email ID for resume trigger

  // For email_event - the email whose open/click we're watching, and the
  // condition node that will branch once it resolves either way.
  watchEmailId?: string;
  conditionNodeId?: string;
}

// ======================
//  LEAD JOURNEY PROGRESS INTERFACE
// ======================
export interface ILeadJourneyProgress extends Document {
  // References
  lead: Types.ObjectId;
  journey: Types.ObjectId;
  admin: Types.ObjectId;
  agent?: Types.ObjectId;

  // Current State
  currentNodeId: string;
  status: ProgressStatus;

  // Execution History
  executionHistory: IExecutionRecord[];

  // Waiting State
  waitingFor?: IWaitingFor;

  // Retry Logic
  retryCount: number;
  maxRetries: number;

  // Metadata
  startedAt: Date;
  completedAt?: Date;
  pausedAt?: Date;
  failedAt?: Date;
  lastActivityAt: Date;

  // Additional Context
  metadata?: Record<string, any>;

  createdAt: Date;
  updatedAt: Date;

  // ======================
  //  INSTANCE METHODS
  // ======================
  addExecutionRecord(record: Omit<IExecutionRecord, "executedAt">): this;
  getLastExecution(): IExecutionRecord | null;
  complete(): Promise<this>;
  fail(error?: string): Promise<this>;
  pause(): Promise<this>;
  resume(): Promise<this>;
  moveToNode(nodeId: string): this;
  setWaiting(waiting: IWaitingFor): this;
  clearWaiting(): this;
  canRetry(): boolean;
  incrementRetry(): this;
}

// ======================
//  POPULATED VARIANTS
// ======================

export interface IJourneyRef {
  _id: Types.ObjectId;
  name: string;
  nodes: any[];
  [key: string]: any;
}

export interface ILeadRef {
  _id: Types.ObjectId;
  [key: string]: any;
}

// Use this type when you call .populate("journey") or .populate(["journey", "lead"])
export interface ILeadJourneyProgressPopulated extends Omit<
  ILeadJourneyProgress,
  "journey" | "lead"
> {
  journey: IJourneyRef;
  lead: ILeadRef;
}

// ======================
//  MODEL STATICS INTERFACE
// ======================
export interface ILeadJourneyProgressModel extends Model<ILeadJourneyProgress> {
  findActiveByLead(leadId: string): Promise<ILeadJourneyProgressPopulated[]>;
  findWaitingForTag(
    leadId: string,
    tagName: string,
  ): Promise<ILeadJourneyProgressPopulated[]>;
  findReadyToResume(): Promise<ILeadJourneyProgressPopulated[]>;
  findWaitingForEmail(
    emailId: string,
  ): Promise<ILeadJourneyProgressPopulated | null>;
  claimEmailWait(
    progressId: string,
  ): Promise<ILeadJourneyProgressPopulated | null>;
}

// ======================
//  SCHEMA DEFINITION
// ======================
const ExecutionRecordSchema = new Schema<IExecutionRecord>(
  {
    nodeId: { type: String, required: true },
    nodeType: { type: String, required: true },
    executedAt: { type: Date, required: true, default: Date.now },
    status: {
      type: String,
      enum: ["success", "failed", "skipped", "pending"],
      required: true,
    },
    result: {
      emailId: { type: String },
      emailOpened: { type: Boolean },
      emailClicked: { type: Boolean },
      tagChanged: { type: Boolean },
      conditionMet: { type: Boolean },
      error: { type: String },
      receivedTag: { type: String },
      metadata: { type: Schema.Types.Mixed },
    },
  },
  { _id: false },
);

const WaitingForSchema = new Schema<IWaitingFor>(
  {
    type: {
      type: String,
      enum: ["delay", "trigger", "email_event"],
      required: true,
    },
    resumeAt: { type: Date },
    waitingForTag: { type: String },
    scheduledEmailId: { type: String },
    watchEmailId: { type: String },
    conditionNodeId: { type: String },
  },
  { _id: false },
);

const LeadJourneyProgressSchema = new Schema<
  ILeadJourneyProgress,
  ILeadJourneyProgressModel
>(
  {
    lead: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
      index: true,
    },

    journey: {
      type: Schema.Types.ObjectId,
      ref: "Journey",
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

    currentNodeId: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "completed", "paused", "failed", "cancelled"],
      required: true,
      default: "active",
      index: true,
    },

    executionHistory: {
      type: [ExecutionRecordSchema],
      default: [],
    },

    waitingFor: {
      type: WaitingForSchema,
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

    startedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },

    completedAt: {
      type: Date,
    },

    pausedAt: {
      type: Date,
    },

    failedAt: {
      type: Date,
    },

    lastActivityAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
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
LeadJourneyProgressSchema.index({ lead: 1, journey: 1 });
LeadJourneyProgressSchema.index({ admin: 1, status: 1 });
LeadJourneyProgressSchema.index({ status: 1, lastActivityAt: 1 });
LeadJourneyProgressSchema.index({
  "waitingFor.type": 1,
  "waitingFor.resumeAt": 1,
});
LeadJourneyProgressSchema.index({ "waitingFor.waitingForTag": 1, status: 1 });
LeadJourneyProgressSchema.index({ "waitingFor.watchEmailId": 1, status: 1 });

// Compound index for finding active progresses waiting for specific tags
LeadJourneyProgressSchema.index({
  lead: 1,
  status: 1,
  "waitingFor.type": 1,
  "waitingFor.waitingForTag": 1,
});

// ======================
//  METHODS
// ======================

// Add execution record
LeadJourneyProgressSchema.methods.addExecutionRecord = function (
  record: Omit<IExecutionRecord, "executedAt">,
) {
  this.executionHistory.push({
    ...record,
    executedAt: new Date(),
  });
  this.lastActivityAt = new Date();
  return this;
};

// Get last execution
LeadJourneyProgressSchema.methods.getLastExecution =
  function (): IExecutionRecord | null {
    if (this.executionHistory.length === 0) return null;
    return this.executionHistory[this.executionHistory.length - 1];
  };

// Mark as completed
LeadJourneyProgressSchema.methods.complete = function () {
  this.status = "completed";
  this.completedAt = new Date();
  this.lastActivityAt = new Date();
  this.waitingFor = undefined;
  return this.save();
};

// Mark as failed
LeadJourneyProgressSchema.methods.fail = function (error?: string) {
  this.status = "failed";
  this.failedAt = new Date();
  this.lastActivityAt = new Date();

  if (error) {
    this.addExecutionRecord({
      nodeId: this.currentNodeId,
      nodeType: "error",
      status: "failed",
      result: { error },
    });
  }

  return this.save();
};

// Pause journey
LeadJourneyProgressSchema.methods.pause = function () {
  this.status = "paused";
  this.pausedAt = new Date();
  this.lastActivityAt = new Date();
  return this.save();
};

// Resume journey
LeadJourneyProgressSchema.methods.resume = function () {
  this.status = "active";
  this.pausedAt = undefined;
  this.lastActivityAt = new Date();
  return this.save();
};

// Move to next node
LeadJourneyProgressSchema.methods.moveToNode = function (nodeId: string) {
  this.currentNodeId = nodeId;
  this.lastActivityAt = new Date();
  return this;
};

// Set waiting state
LeadJourneyProgressSchema.methods.setWaiting = function (waiting: IWaitingFor) {
  this.waitingFor = waiting;
  this.lastActivityAt = new Date();
  return this;
};

// Clear waiting state
LeadJourneyProgressSchema.methods.clearWaiting = function () {
  this.waitingFor = undefined;
  this.lastActivityAt = new Date();
  return this;
};

// Check if should retry
LeadJourneyProgressSchema.methods.canRetry = function (): boolean {
  return this.retryCount < this.maxRetries;
};

// Increment retry count
LeadJourneyProgressSchema.methods.incrementRetry = function () {
  this.retryCount += 1;
  this.lastActivityAt = new Date();
  return this;
};

// ======================
//  STATICS
// ======================

// Find all active progresses for a lead
LeadJourneyProgressSchema.statics.findActiveByLead = function (leadId: string) {
  return this.find({
    lead: leadId,
    status: "active",
  }).populate("journey");
};

// Find progresses waiting for a specific tag
LeadJourneyProgressSchema.statics.findWaitingForTag = function (
  leadId: string,
  tagName: string,
) {
  return this.find({
    lead: leadId,
    status: "active",
    "waitingFor.type": "trigger",
    "waitingFor.waitingForTag": tagName,
  }).populate("journey");
};

// Find the progress parked on a specific email's open/click
LeadJourneyProgressSchema.statics.findWaitingForEmail = function (
  emailId: string,
) {
  return this.findOne({
    status: "active",
    "waitingFor.type": "email_event",
    "waitingFor.watchEmailId": emailId,
  }).populate(["journey", "lead"]);
};

/**
 * Atomically take ownership of an email_event wait.
 *
 * An open event and the timeout timer can land at the same moment; whichever
 * call clears `waitingFor` first wins and resolves the condition. The loser
 * gets null back and must do nothing.
 */
LeadJourneyProgressSchema.statics.claimEmailWait = function (
  progressId: string,
) {
  return this.findOneAndUpdate(
    {
      _id: progressId,
      status: "active",
      "waitingFor.type": "email_event",
    },
    { $unset: { waitingFor: "" } },
    { new: true },
  ).populate(["journey", "lead"]);
};

// Find progresses ready to resume (delay expired)
LeadJourneyProgressSchema.statics.findReadyToResume = function () {
  return this.find({
    status: "active",
    "waitingFor.type": "delay",
    "waitingFor.resumeAt": { $lte: new Date() },
  }).populate(["journey", "lead"]);
};

// ======================
//  SAFE MODEL EXPORT
// ======================
clearModelInDev("LeadJourneyProgress");

const LeadJourneyProgress =
  (mongoose.models.LeadJourneyProgress as ILeadJourneyProgressModel) ||
  mongoose.model<ILeadJourneyProgress, ILeadJourneyProgressModel>(
    "LeadJourneyProgress",
    LeadJourneyProgressSchema,
  );

export default LeadJourneyProgress;
