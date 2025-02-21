import mongoose, { Document, Schema, Model } from "mongoose";

interface ITimeSlot {
  from: string;
  to: string;
}

const timeSlotSchema = new Schema<ITimeSlot>({
  from: { type: String, required: true },
  to: { type: String, required: true },
});

interface IOpeningHour extends Document {
  admin: mongoose.Types.ObjectId;
  branch: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  monday: ITimeSlot[];
  tuesday: ITimeSlot[];
  wednesday: ITimeSlot[];
  thursday: ITimeSlot[];
  friday: ITimeSlot[];
  saturday: ITimeSlot[];
  sunday: ITimeSlot[];
  availability: "available" | "unavailable";
}

const openingHoursSchema = new Schema<IOpeningHour>({
  admin: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  branch: { type: Schema.Types.ObjectId, required: true, ref: "Branch" },
  owner: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  monday: { type: [timeSlotSchema], default: [] },
  tuesday: { type: [timeSlotSchema], default: [] },
  wednesday: { type: [timeSlotSchema], default: [] },
  thursday: { type: [timeSlotSchema], default: [] },
  friday: { type: [timeSlotSchema], default: [] },
  saturday: { type: [timeSlotSchema], default: [] },
  sunday: { type: [timeSlotSchema], default: [] },
  availability: {
    type: String,
    required: true,
    enum: ["available", "unavailable"],
    default: "available",
  },
});

const OpeningHour: Model<IOpeningHour> = mongoose.model<IOpeningHour>(
  "OpeningHour",
  openingHoursSchema
);

export default OpeningHour;
