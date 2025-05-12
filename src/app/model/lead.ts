import mongoose, { Schema, model, Document } from "mongoose";

// Define the types of leads
export type LeadType =
  | "House Tour Leads"
  | "Home Seller Leads"
  | "Mortgage Inquiry Leads"
  | "General Inquiry Leads";

// Define the possible statuses for each lead type
export const LeadStatus = {
  "House Tour Leads": [
    "scheduled",
    "viewed property",
    "repeat visit",
    "offer made",
    "cold lead",
    "unresponsive",
  ] as const,
  "Home Seller Leads": [
    "scheduled a call",
    "call made",
    "considering",
    "request valuation report",
    "need guidance",
    "ready to list",
    "property listed",
    "lost lead",
    "cold lead",
  ] as const,
  "Mortgage Inquiry Leads": [
    "new lead",
    "engaged",
    "need pre-approval",
    "pre-approved",
    "ready to buy",
    "cold lead",
    "unresponsive",
  ] as const,
  "General Inquiry Leads": [
    "new lead",
    "scheduled",
    "general interest",
    "potential client",
    "active client",
    "cold lead",
    "lost lead",
  ] as const,
};

// Define the interface for a Lead document
export interface ILead extends Document {
  admin: Schema.Types.ObjectId;
  agent?: Schema.Types.ObjectId;
  type: LeadType;
  status: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyId?: mongoose.Types.ObjectId; // Only for house tours
  createdAt: Date;
  updatedAt: Date;
}

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
  },
  { timestamps: true }
);

// Prevent OverwriteModelError
const Lead = mongoose.models.Lead || model<ILead>("Lead", leadSchema);

export default Lead;
