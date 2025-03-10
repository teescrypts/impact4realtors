import mongoose, { Schema, model, Document } from "mongoose";

// Define Notification Types
export const NOTIFICATION_TYPES = [
  "new_appointment",
  "new_newsletter",
] as const;

export interface INotification extends Document {
  admin: mongoose.Types.ObjectId; 
  recipientType: "admin" | "user"; // Specifies if it's for an admin or user
  type: (typeof NOTIFICATION_TYPES)[number]; // Type of notification
  message: string; // Notification content
  isRead: boolean; // Read status
  createdAt: Date; // Timestamp
}

const notificationSchema = new Schema<INotification>(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Admin",
    },
    recipientType: {
      type: String,
      required: true,
      enum: ["admin", "user"],
    },
    type: {
      type: String,
      enum: NOTIFICATION_TYPES,
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false, // Default to unread
    },
  },
  { timestamps: true }
);

// Prevent OverwriteModelError
const Notification =
  mongoose.models.Notification ||
  model<INotification>("Notification", notificationSchema);

export default Notification;
