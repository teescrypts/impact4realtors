import mongoose, { Schema, model, Document } from "mongoose";
import { clearModelInDev } from "@/app/lib/register-model";

// ======================
//  LEAD CATEGORY
// ======================
export type LeadCategory = "Buyer" | "Seller" | "Inquiry";

// ======================
//  LEAD INTENT (HOW LEAD CAME IN)
// ======================
export type LeadIntent =
  | "House Tour"
  | "Mortgage Inquiry"
  | "Buyer Guide"
  | "Sell Call Appointment"
  | "Home valuation"
  | "General Inquiry";

// ======================
//  BUYER PROFILE (WHO THEY ARE)
// ======================
export type BuyerProfile = "First-Time Buyer" | "Repeat Buyer" | "Investor";

// ======================
//  LEAD INTERFACE
// ======================
export interface ILead extends Document {
  admin: Schema.Types.ObjectId;
  agent?: Schema.Types.ObjectId;

  category: LeadCategory;
  intent: LeadIntent;

  buyerProfile?: BuyerProfile; // Buyer-only segmentation

  status: string;

  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  propertyId?: mongoose.Types.ObjectId; // Optional, mainly for buyers
  appointmentId?: mongoose.Types.ObjectId;
  source?: string;
  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

// ======================
//  SCHEMA DEFINITION
// ======================
const leadSchema = new Schema<ILead>(
  {
    admin: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    agent: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },

    category: {
      type: String,
      enum: ["Buyer", "Seller", "Inquiry"],
      required: true,
    },

    intent: {
      type: String,
      enum: [
        "House Tour",
        "Mortgage Inquiry",
        "Buyer Guide",
        "Sell Call Appointment",
        "General Inquiry",
        "Home valuation",
      ],
      required: true,
    },

    buyerProfile: {
      type: String,
      enum: ["First-Time Buyer", "Repeat Buyer", "Investor"],
      // required: function () {
      //   return this.category === "Buyer";
      // },
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
    },

    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
    },

    source: {
      type: String,
      default: "website",
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

// ======================
//  SAFE MODEL EXPORT
// ======================
clearModelInDev("Lead");

const Lead = mongoose.models.Lead || model<ILead>("Lead", leadSchema);

export default Lead;
