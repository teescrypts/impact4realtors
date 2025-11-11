import mongoose, { Schema, Document } from "mongoose";

interface IHomeValuationRequest extends Document {
  address: string;
  bedrooms?: number;
  bathrooms?: number;
  yearBuilt?: number;
  squareFootage?: number;
  purpose:
    | "selling"
    | "buying"
    | "refinancing"
    | "investment"
    | "curiosity"
    | "other";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: "Pending" | "Done";
  admin?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const HomeValuationRequestSchema = new Schema<IHomeValuationRequest>(
  {
    admin: { type: Schema.Types.ObjectId, ref: "Admin" },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    bedrooms: {
      type: Number,
      min: 0,
    },

    bathrooms: {
      type: Number,
      min: 0,
    },

    yearBuilt: {
      type: Number,
      min: 1800,
      max: new Date().getFullYear(),
    },

    squareFootage: {
      type: Number,
      min: 0,
    },

    purpose: {
      type: String,
      enum: [
        "selling",
        "buying",
        "refinancing",
        "investment",
        "curiosity",
        "other",
      ],
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

    status: {
      type: String,
      enum: ["Pending", "Done"],
      default: "Pending",
      required: true,
    },
  },
  { timestamps: true }
);

const HomeValuationRequest =
  mongoose.models.HomeValuationRequest ||
  mongoose.model<IHomeValuationRequest>(
    "HomeValuationRequest",
    HomeValuationRequestSchema
  );

export default HomeValuationRequest;
