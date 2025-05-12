import mongoose, { Schema, Document, Types } from "mongoose";

interface IConnect extends Document {
  admin: Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state: string;
  zipCode: string;
  matchedAgents: Types.ObjectId[]; // All possible agent matches
  connectedAgent?: Types.ObjectId; // Final agent that connects
  createdAt: Date;
  updatedAt: Date;
}

const ConnectSchema = new Schema<IConnect>(
  {
    admin: { type: Schema.Types.ObjectId, required: true, ref: "Admin" },
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
      default: null, // If null, no one has connected yet
    },
  },
  { timestamps: true }
);

const Connect =
  mongoose.models.Connect || mongoose.model<IConnect>("Connect", ConnectSchema);

export default Connect;
