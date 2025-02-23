import mongoose, { Schema, Document, Model } from "mongoose";

// Define the Image document interface
export interface IImage extends Document {
  admin: Schema.Types.ObjectId;
  status: "uploaded" | "drafted";
  type: "listing" | "blog";
  filename?: string;
  contentType?: string;
  data: Buffer;
}

// Define the Image schema
const ImageSchema = new Schema<IImage>(
  {
    admin: { type: Schema.Types.ObjectId, required: true, ref: "Admin" },
    status: {
      type: String,
      required: true,
      enum: ["uploaded", "drafted"], // Fixed typo
      default: "drafted",
    },
    type: {
      type: String,
      required: true,
      enum: ["listing", "blog"], // Fixed typo
    },
    filename: { type: String },
    contentType: { type: String },
    data: { type: Buffer, required: true },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt fields
);

// Define the Image model
const Image: Model<IImage> =
  mongoose.models.Image || mongoose.model<IImage>("Image", ImageSchema);

export default Image;
