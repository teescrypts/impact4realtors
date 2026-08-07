import mongoose, { Schema, model, models, Document } from "mongoose";
import { clearModelInDev } from "@/app/lib/register-model";

// Define Appointment Types
const APPOINTMENT_TYPES = ["call", "house_touring"] as const;
const HOUSE_TOURING_TYPES = ["For Sale", "For Rent"] as const;
const CALL_REASONS = [
  "selling",
  "mortgage_enquiry",
  "general_enquiry",
] as const;
const APPOINTMENT_STATUS = [
  "upcoming",
  "completed",
  "cancelled",
  "rescheduled",
] as const;

// Define TypeScript Interfaces
interface ICustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface IAppointment extends Document {
  admin: { type: Schema.Types.ObjectId; required: true; ref: "Admin" };
  agent: { type: Schema.Types.ObjectId; ref: "Admin" };
  type: (typeof APPOINTMENT_TYPES)[number];
  status: (typeof APPOINTMENT_STATUS)[number];
  date: string;
  bookedTime: { from: string; to: string };
  customer: ICustomer;
  propertyId?: mongoose.Types.ObjectId;
  houseTouringType?: (typeof HOUSE_TOURING_TYPES)[number];
  callReason?: (typeof CALL_REASONS)[number];
  propertyTypeToSell?: string;
  datetime?: Date;
  reschedule: {
    isRescheduled: boolean;
    previousDates: [{ date: string; bookedTime: { from: string; to: string } }];
  };
  googleEventId?: string; // ✅ Added — store Google Calendar event ID
}

// Define Schema
const appointmentSchema = new Schema<IAppointment>(
  {
    admin: { type: Schema.Types.ObjectId, required: true, ref: "Admin" },
    agent: { type: Schema.Types.ObjectId, ref: "Admin" },
    type: {
      type: String,
      enum: APPOINTMENT_TYPES,
      required: true,
    },
    status: {
      type: String,
      enum: APPOINTMENT_STATUS,
      default: "upcoming",
    },
    date: {
      type: String,
      required: true,
    },
    bookedTime: {
      from: { type: String, required: true },
      to: { type: String, required: true },
    },
    customer: {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, required: true, trim: true },
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: function () {
        return this.type === "house_touring";
      },
    },
    houseTouringType: {
      type: String,
      enum: HOUSE_TOURING_TYPES,
      required: function () {
        return this.type === "house_touring";
      },
    },
    callReason: {
      type: String,
      enum: CALL_REASONS,
      required: function () {
        return this.type === "call";
      },
    },
    propertyTypeToSell: {
      type: String,
      required: function () {
        return this.callReason === "selling";
      },
      trim: true,
    },
    datetime: { type: Date, index: true },
    reschedule: {
      isRescheduled: { type: Boolean, required: true, default: false },
      previousDates: [
        {
          date: String,
          bookedTime: {
            from: { type: String },
            to: { type: String },
          },
        },
      ],
    },
    googleEventId: {
      type: String,
      trim: true,
      default: null, // ✅ Optional for backward compatibility
    },
  },
  { timestamps: true }
);

// ✅ Pre-save hook to generate datetime from date + bookedTime.from
appointmentSchema.pre("save", function (next) {
  const appointment = this as IAppointment;

  if (appointment.date && appointment.bookedTime?.from) {
    const isoString = `${appointment.date}T${appointment.bookedTime.from}:00`;
    appointment.datetime = new Date(isoString);
  }

  next();
});

// Prevent OverwriteModelError
clearModelInDev("Appointment");

const Appointment =
  models.Appointment || model<IAppointment>("Appointment", appointmentSchema);

export default Appointment;
