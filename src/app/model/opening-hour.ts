import mongoose, { Document, Schema, Model, models, model } from "mongoose";

interface ITimeSlot {
  from: string;
  to: string;
}

const timeSlotSchema = new Schema<ITimeSlot>({
  from: { type: String, required: true },
  to: { type: String, required: true },
});

export interface IOpeningHour extends Document {
  admin: mongoose.Types.ObjectId;
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
  admin: { type: Schema.Types.ObjectId, required: true, ref: "Admin" },
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

const OpeningHour: Model<IOpeningHour> =
  models.OpeningHour || model<IOpeningHour>("OpeningHour", openingHoursSchema);

export default OpeningHour;
