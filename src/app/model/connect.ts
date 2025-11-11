import mongoose, { Schema, Document, Types } from "mongoose";

export type ConnectType = "seller" | "homeValuation";

export interface IConnect extends Document {
  admin: Schema.Types.ObjectId;
  type: ConnectType;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state: string;
  zipCode: string;
  matchedAgents: Types.ObjectId[];
  connectedAgent?: Types.ObjectId;

  // Home valuation–specific fields
  address?: string;
  bedrooms?: string;
  bathrooms?: string;
  yearBuilt?: string;
  squareFootage?: string;
  purpose?: string;

  createdAt: Date;
  updatedAt: Date;
}

const ConnectSchema = new Schema<IConnect>(
  {
    admin: { type: Schema.Types.ObjectId, required: true, ref: "Admin" },
    type: {
      type: String,
      enum: ["seller", "homeValuation"],
      required: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    matchedAgents: [
      { type: Schema.Types.ObjectId, ref: "Agent", required: true },
    ],
    connectedAgent: {
      type: Schema.Types.ObjectId,
      ref: "Agent",
      default: null,
    },

    // Optional — only used if type === "homeValuation"
    address: { type: String },
    bedrooms: { type: String },
    bathrooms: { type: String },
    yearBuilt: { type: String },
    squareFootage: { type: String },
    purpose: { type: String },
  },
  { timestamps: true }
);

// Optional conditional validation for home valuation fields
const homeValuationFields = [
  "address",
  "bedrooms",
  "bathrooms",
  "yearBuilt",
  "squareFootage",
];

homeValuationFields.forEach((field) => {
  ConnectSchema.path(field).validate(function (value: string) {
    if (this.type === "homeValuation" && !value) {
      return false;
    }
    return true;
  }, `${field} is required for home valuation.`);
});

const Connect =
  mongoose.models.Connect || mongoose.model<IConnect>("Connect", ConnectSchema);

export default Connect;
