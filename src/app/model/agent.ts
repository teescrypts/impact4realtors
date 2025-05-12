import mongoose, { Schema, Document } from "mongoose";

interface ILicensedState {
  country: string;
  state: string;
  postalCode?: string;
}

interface IAgent extends Document {
  admin: Schema.Types.ObjectId;
  owner: Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  bio?: string;
  profilePictureUrl?: string;
  cloudinaryPublicId?: string;
  licensedStates?: ILicensedState[];
  createdAt: Date;
  updatedAt: Date;
}

const LicensedStateSchema = new Schema<ILicensedState>(
  {
    country: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String },
  },
  { _id: false }
);

const AgentSchema = new Schema<IAgent>(
  {
    admin: { type: Schema.Types.ObjectId, required: true, ref: "Admin" },
    owner: { type: Schema.Types.ObjectId, required: true, ref: "Admin" },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    bio: { type: String },
    profilePictureUrl: { type: String },
    cloudinaryPublicId: { type: String },
    licensedStates: { type: [LicensedStateSchema], default: [] },
  },
  { timestamps: true }
);

const Agent =
  mongoose.models.Agent || mongoose.model<IAgent>("Agent", AgentSchema);

export default Agent;
