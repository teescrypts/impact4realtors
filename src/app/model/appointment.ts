import mongoose, { Schema, model, models, Document } from "mongoose";

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
  type: (typeof APPOINTMENT_TYPES)[number]; // "call" or "house_touring"
  status: (typeof APPOINTMENT_STATUS)[number]; // "upcoming", "completed", "cancelled"
  date: string;
  bookedTime: { from: string; to: string };
  customer: ICustomer;
  propertyId?: mongoose.Types.ObjectId; // Optional for calls
  houseTouringType?: (typeof HOUSE_TOURING_TYPES)[number]; // "for_sale" or "for_rent"
  callReason?: (typeof CALL_REASONS)[number]; // "selling", "mortgage_enquiry", "general_enquiry"
  propertyTypeToSell?: string; // Only for selling calls
  reschedule: {
    isRescheduled: boolean;
    previousDates: [{ date: string; bookedTime: { from: string; to: string } }];
  };
}

// Define Schema
const appointmentSchema = new Schema<IAppointment>(
  {
    admin: { type: Schema.Types.ObjectId, required: true, ref: "Admin" },
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
      from: {
        type: String,
        required: true,
      },
      to: {
        type: String,
        required: true,
      },
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
    reschedule: {
      isRescheduled: {
        type: Boolean,
        required: true,
        default: false,
      },
      previousDates: [
        {
          date: String,
          bookedTime: {
            from: {
              type: String,
            },
            to: {
              type: String,
            },
          },
        },
      ],
    },
  },
  { timestamps: true }
);

// Prevent OverwriteModelError
const Appointment =
  models.Appointment || model<IAppointment>("Appointment", appointmentSchema);

export default Appointment;
