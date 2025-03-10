import mongoose, { Schema, model, Document } from "mongoose";

// Define the Newsletter interface
export interface INewsletter extends Document {
  admin: mongoose.Types.ObjectId;
  email: string;
  createdAt: Date;
}

// Define the Schema
const newsletterSchema = new Schema<INewsletter>(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Admin",
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true, // Ensure emails are unique
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"], // Basic email validation
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

// Prevent OverwriteModelError
const Newsletter =
  mongoose.models.Newsletter ||
  model<INewsletter>("Newsletter", newsletterSchema);

export default Newsletter;
