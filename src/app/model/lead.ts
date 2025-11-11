import mongoose, { Schema, model, Document } from "mongoose";

// ======================
//  LEAD TYPES
// ======================
export type LeadType =
  | "House Tour Leads"
  | "Home Seller Leads"
  | "Mortgage Inquiry Leads"
  | "General Inquiry Leads";

// ======================
//  LEAD STATUS / JOURNEYS
// ======================
export const LeadStatus = {
  "House Tour Leads": [
    "new lead",
    "contacted",
    "scheduled viewing",
    "viewed property",
    "follow-up sent",
    "second viewing scheduled",
    "offer made",
    "under negotiation",
    "closed deal",
    "lost lead",
    "cold lead",
  ] as const,

  "Home Seller Leads": [
    "new lead",
    "contacted",
    "needs valuation",
    "valuation report sent",
    "considering listing",
    "ready to list",
    "staging & photography",
    "property listed",
    "offer received",
    "under contract",
    "sold",
    "lost lead",
    "cold lead",
  ] as const,

  "Mortgage Inquiry Leads": [
    "new lead",
    "contacted",
    "needs consultation",
    "pre-approval in progress",
    "pre-approved",
    "actively searching",
    "offer made",
    "closed deal",
    "unresponsive",
    "cold lead",
  ] as const,

  "General Inquiry Leads": [
    "new lead",
    "contacted",
    "needs info",
    "qualified",
    "active client",
    "closed deal",
    "cold lead",
    "lost lead",
  ] as const,
};

// ======================
//  LEAD INTERFACE
// ======================
export interface ILead extends Document {
  admin: Schema.Types.ObjectId;
  agent?: Schema.Types.ObjectId;
  type: LeadType;
  status: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyId?: mongoose.Types.ObjectId; // For house tour leads
  source?: string; // e.g. website form, social media
  notes?: string; // agent’s internal comments
  createdAt: Date;
  updatedAt: Date;
}

// ======================
//  SCHEMA DEFINITION
// ======================
const leadSchema = new Schema<ILead>(
  {
    admin: { type: Schema.Types.ObjectId, required: true, ref: "Admin" },
    agent: { type: Schema.Types.ObjectId, ref: "Admin" },

    type: {
      type: String,
      enum: [
        "House Tour Leads",
        "Home Seller Leads",
        "Mortgage Inquiry Leads",
        "General Inquiry Leads",
      ],
      required: true,
    },

    status: {
      type: String,
      required: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: function () {
        return this.type === "House Tour Leads";
      },
    },

    // ======================
    //  OPTIONAL CRM FIELDS
    // ======================
    source: {
      type: String,
      default: "website form",
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Prevent OverwriteModelError (Next.js dev reload safe)
const Lead = mongoose.models.Lead || model<ILead>("Lead", leadSchema);

export default Lead;
