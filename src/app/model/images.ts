import mongoose, { Schema, Document, Model } from "mongoose";

// Define the Image document interface
export interface IImage extends Document {
  admin: Schema.Types.ObjectId;
  status: "uploaded" | "drafted";
  type: "listing" | "blog";
  filename?: string;
  contentType?: string;
  url: string; // Cloudinary image URL
  public_id: string; // Cloudinary public ID (needed for deletion)
}

// Define the Image schema
const ImageSchema = new Schema<IImage>(
  {
    admin: { type: Schema.Types.ObjectId, required: true, ref: "Admin" },
    status: {
      type: String,
      required: true,
      enum: ["uploaded", "drafted"],
      default: "drafted",
    },
    type: {
      type: String,
      required: true,
      enum: ["listing", "blog"],
    },
    filename: { type: String },
    contentType: { type: String },
    url: { type: String, required: true }, // Store Cloudinary image URL
    public_id: { type: String, required: true }, // Store Cloudinary public ID
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt fields
);

// Define the Image model
const Image: Model<IImage> =
  mongoose.models.Image || mongoose.model<IImage>("Image", ImageSchema);

export default Image;
