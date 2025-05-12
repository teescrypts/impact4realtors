import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";

interface IAgentForm extends Document {
  admin: Schema.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const AgentFormSchema = new Schema<IAgentForm>(
  {
    admin: { type: Schema.Types.ObjectId, required: true, ref: "Admin" },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
  },
  { timestamps: true }
);

const AgentForm =
  mongoose.models.AgentForm ||
  mongoose.model<IAgentForm>("AgentForm", AgentFormSchema);

export default AgentForm;
