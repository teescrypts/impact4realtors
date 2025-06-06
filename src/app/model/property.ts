import mongoose, { Schema, Document } from "mongoose";

interface IProperty extends Document {
  admin: mongoose.Types.ObjectId;
  agent?: mongoose.Types.ObjectId;
  propertyTitle: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareMeters: number;
  description: string;
  category: "For Sale" | "For Rent";
  propertyType: string;
  status: "Active" | "Rented" | "Sold";
  location: {
    addressLine1: string;
    addressLine2?: string;
    countryName: string;
    countryCode: string;
    stateName: string;
    stateCode: string;
    cityName: string;
    postalCode?: string;
  };
  features: string[];
  images: { url: string; fileName: string; imageId: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<IProperty>(
  {
    admin: { type: Schema.Types.ObjectId, required: true, ref: "Admin" },
    agent: { type: Schema.Types.ObjectId, ref: "Admin" },
    propertyTitle: { type: String, required: true },
    price: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    squareMeters: { type: Number, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["For Sale", "For Rent"],
      required: true,
    },
    propertyType: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Rented", "Sold"],
      required: true,
      default: "Active",
    },
    location: {
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      countryName: { type: String, required: true },
      countryCode: { type: String, required: true },
      stateName: { type: String, required: true },
      stateCode: { type: String, required: true },
      cityName: { type: String, required: true },
      postalCode: { type: String },
    },
    features: { type: [String], default: [] },
    images: [
      {
        url: { type: String },
        fileName: { type: String },
        imageId: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Property =
  mongoose.models.Property ||
  mongoose.model<IProperty>("Property", PropertySchema);

export default Property;
