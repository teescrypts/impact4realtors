import mongoose, { Schema, Document, Model } from "mongoose";
import { EmailBlock } from "@/app/lib/email/blocks";
import { clearModelInDev } from "@/app/lib/register-model";

// ======================
//  TYPE DEFINITIONS
// ======================

export type ContactType = "Buyer" | "Seller" | "Inquiry";

export type LeadIntent =
  | "House Tour"
  | "Mortgage Inquiry"
  | "Buyer Guide"
  | "Sell Call Appointment"
  | "Home valuation"
  | "General Inquiry";

export type TagActionType = "assign" | "change";

export type NodeType =
  | "entry"
  | "condition"
  | "delay"
  | "trigger"
  | "send_email"
  | "meeting_reminder"
  | "sms_reminder"
  | "call_reminder";

// Entry Action Configuration
export interface ITagAction {
  type: TagActionType;
  tagName: string;
  newTagName?: string; // Only for "change" type
}

export interface IEntryAction {
  tagAction: ITagAction;
}

// Node Configurations (discriminated union)
export type NodeConfig =
  | { type: "entry" }
  | {
      type: "condition";
      checkType: "email_opened" | "tag_changed";
      description?: string;
      /**
       * How long to wait for the email to be opened before taking the "no"
       * branch. Omitted on journeys saved before this was configurable — the
       * engine falls back to DEFAULT_OPEN_WINDOW.
       */
      waitFor?: {
        duration: number;
        unit: "minutes" | "hours" | "days";
      };
    }
  | {
      type: "delay";
      duration: number;
      unit: "minutes" | "hours" | "days";
    }
  | {
      type: "send_email";
      subject: string;
      /**
       * Rendered HTML. Written from `emailBlocks` on save when blocks exist;
       * for older journeys it is the only content there is.
       */
      emailContent: string;
      /** Structured content — the source of truth when present. */
      emailBlocks?: EmailBlock[];
      fromName?: string;
    }
  | {
      type: "trigger";
      waitForTag: string;
      description?: string;
    }
  | {
      type: "meeting_reminder";
      message: string;
      title?: string;
    }
  | {
      type: "sms_reminder";
      message: string;
    }
  | {
      type: "call_reminder";
      message: string;
      phoneNumber?: string;
    };

// Journey Node
export interface IJourneyNode {
  id: string; // Unique within this journey (e.g., "node_1", "node_2")
  type: NodeType;
  config: NodeConfig;
  position?: {
    x: number;
    y: number;
  };
}

// Journey Edge (connection between nodes)
export interface IJourneyEdge {
  id: string; // Unique edge ID
  source: string; // Source node ID
  target: string; // Target node ID
  label?: "yes" | "no"; // For conditional branches
}

// Return type for getNextNodes
export interface INextNode {
  node: IJourneyNode | undefined;
  label?: "yes" | "no";
}

// Return type for getEntryPointSignature
export interface IEntryPointSignature {
  admin: Schema.Types.ObjectId;
  contactType: ContactType;
  leadIntent: LeadIntent;
  tagActionType: TagActionType;
  tagName: string;
  newTagName: string | null;
}

// ======================
//  JOURNEY INTERFACE
// ======================
export interface IJourney extends Document {
  admin: Schema.Types.ObjectId;
  agent?: Schema.Types.ObjectId;

  // Basic Info
  name: string;
  contactType: ContactType;
  leadIntent: LeadIntent;

  // Entry Conditions
  entryAction: IEntryAction;

  // Workflow Structure
  nodes: IJourneyNode[];
  edges: IJourneyEdge[];
  entryNodeId: string; // ID of the starting node

  // Status
  isActive: boolean;
  isDraft: boolean;
  isBuiltIn: boolean,

  // Metadata
  description?: string;

  createdAt: Date;
  updatedAt: Date;

  // ======================
  //  INSTANCE METHODS
  // ======================
  activate(): Promise<this>;
  deactivate(): Promise<this>;
  getNodeById(nodeId: string): IJourneyNode | undefined;
  getNextNodes(nodeId: string): INextNode[];
  getEntryPointSignature(): IEntryPointSignature;
}

// ======================
//  MODEL STATICS INTERFACE
// ======================
export interface IJourneyModel extends Model<IJourney> {
  findDuplicateEntryPoint(
    adminId: string,
    contactType: ContactType,
    leadIntent: LeadIntent,
    tagAction: ITagAction,
    excludeJourneyId?: string,
  ): Promise<Pick<IJourney, "name" | "_id"> | null>;
}

// ======================
//  SCHEMA DEFINITION
// ======================
const JourneyNodeSchema = new Schema<IJourneyNode>(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "entry",
        "condition",
        "delay",
        "trigger",
        "send_email",
        "meeting_reminder",
        "sms_reminder",
        "call_reminder",
      ],
      required: true,
    },
    config: {
      type: Schema.Types.Mixed, // Flexible for different node types
      required: true,
    },
    position: {
      x: { type: Number },
      y: { type: Number },
    },
  },
  { _id: false },
);

const JourneyEdgeSchema = new Schema<IJourneyEdge>(
  {
    id: { type: String, required: true },
    source: { type: String, required: true },
    target: { type: String, required: true },
    label: {
      type: String,
      enum: ["yes", "no"],
    },
  },
  { _id: false },
);

const TagActionSchema = new Schema<ITagAction>(
  {
    type: {
      type: String,
      enum: ["assign", "change"],
      required: true,
    },
    tagName: { type: String, required: true, trim: true },
    newTagName: { type: String, trim: true },
  },
  { _id: false },
);

const EntryActionSchema = new Schema<IEntryAction>(
  {
    tagAction: { type: TagActionSchema, required: true },
  },
  { _id: false },
);

const JourneySchema = new Schema<IJourney, IJourneyModel>(
  {
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

    name: {
      type: String,
      required: true,
      trim: true,
    },

    contactType: {
      type: String,
      enum: ["Buyer", "Seller", "Inquiry"],
      required: true,
    },

    leadIntent: {
      type: String,
      enum: [
        "House Tour",
        "Mortgage Inquiry",
        "Buyer Guide",
        "Sell Call Appointment",
        "Home valuation",
        "General Inquiry",
      ],
      default: null,
    },

    entryAction: {
      type: EntryActionSchema,
      required: true,
    },

    nodes: {
      type: [JourneyNodeSchema],
      required: true,
      default: [],
    },

    edges: {
      type: [JourneyEdgeSchema],
      required: true,
      default: [],
    },

    entryNodeId: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: false,
      index: true,
    },

    isDraft: {
      type: Boolean,
      default: true,
    },

    isBuiltIn: {
      type: Boolean,
      default: true,
    },

    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// ======================
//  INDEXES
// ======================
JourneySchema.index({ admin: 1, isActive: 1 });
JourneySchema.index({ admin: 1, contactType: 1, leadIntent: 1 });
JourneySchema.index({ "entryAction.tagAction.tagName": 1, isActive: 1 });

// CRITICAL: Compound index to enforce unique entry points per admin
// This prevents duplicate active journeys with same entry conditions
JourneySchema.index(
  {
    admin: 1,
    contactType: 1,
    leadIntent: 1,
    "entryAction.tagAction.type": 1,
    "entryAction.tagAction.tagName": 1,
    "entryAction.tagAction.newTagName": 1,
    isActive: 1,
  },
  {
    name: "unique_entry_point",
    // Note: We don't use unique: true because we allow multiple inactive journeys
    // with same entry point. Uniqueness is enforced in application logic.
  },
);

// ======================
//  METHODS
// ======================
JourneySchema.methods.activate = function () {
  this.isActive = true;
  this.isDraft = false;
  return this.save();
};

JourneySchema.methods.deactivate = function () {
  this.isActive = false;
  return this.save();
};

JourneySchema.methods.getNodeById = function (
  nodeId: string,
): IJourneyNode | undefined {
  return this.nodes.find((node: IJourneyNode) => node.id === nodeId);
};

JourneySchema.methods.getNextNodes = function (nodeId: string): INextNode[] {
  return this.edges
    .filter((edge: IJourneyEdge) => edge.source === nodeId)
    .map((edge: IJourneyEdge) => ({
      node: this.getNodeById(edge.target),
      label: edge.label,
    }));
};

// Helper method to get entry point signature for uniqueness check
JourneySchema.methods.getEntryPointSignature =
  function (): IEntryPointSignature {
    const { type, tagName, newTagName } = this.entryAction.tagAction;
    return {
      admin: this.admin,
      contactType: this.contactType,
      leadIntent: this.leadIntent,
      tagActionType: type,
      tagName,
      newTagName: newTagName || null,
    };
  };

// ======================
//  STATICS
// ======================

// Find duplicate active journey with same entry point
JourneySchema.statics.findDuplicateEntryPoint = async function (
  adminId: string,
  contactType: ContactType,
  leadIntent: LeadIntent,
  tagAction: ITagAction,
  excludeJourneyId?: string,
) {
  const query: Record<string, any> = {
    admin: adminId,
    contactType,
    leadIntent,
    "entryAction.tagAction.type": tagAction.type,
    "entryAction.tagAction.tagName": tagAction.tagName,
    isActive: true,
  };

  // Handle newTagName (could be undefined or null)
  if (tagAction.type === "change") {
    query["entryAction.tagAction.newTagName"] = tagAction.newTagName || null;
  }

  // Exclude current journey when updating
  if (excludeJourneyId) {
    query._id = { $ne: excludeJourneyId };
  }

  return this.findOne(query).select("name _id");
};

// ======================
//  SAFE MODEL EXPORT
// ======================
clearModelInDev("Journey");

const Journey =
  (mongoose.models.Journey as IJourneyModel) ||
  mongoose.model<IJourney, IJourneyModel>("Journey", JourneySchema);

export default Journey;
