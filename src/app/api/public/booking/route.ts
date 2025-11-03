import { NextRequest } from "next/server";
import apiResponse from "@/app/lib/api-response";
import Appointment from "@/app/model/appointment";
import Lead, { LeadType, LeadStatus } from "@/app/model/lead";
import Notification from "@/app/model/notification";
import getAdmin from "@/app/utils/get-admin";
import Admin from "@/app/model/admin";
import { DateTime } from "luxon";
import { createGoogleEvent } from "@/app/lib/google/create-google-event";

// Define TypeScript Interfaces for Request Data
interface AppointmentRequestBody {
  type: "house_touring" | "call";
  callReason?: "selling" | "mortgage_enquiry" | "general_enquiry";
  date: string;
  bookedTime: { from: string; to: string };
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  agent?: string;
  propertyId?: string;
}

// Helper function to determine lead type
const getLeadType = (type: string, callReason?: string): LeadType | null => {
  if (type === "house_touring") return "House Tour Leads";
  if (type === "call") {
    switch (callReason) {
      case "selling":
        return "Home Seller Leads";
      case "mortgage_enquiry":
        return "Mortgage Inquiry Leads";
      case "general_enquiry":
        return "General Inquiry Leads";
    }
  }
  return null;
};

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdmin(req);
    const body: AppointmentRequestBody = await req.json();

    if (!admin) return apiResponse("Admin Required", null, 401);

    const agent = body?.agent;

    // Check if selected time slot is already booked
    const existingAppointment = await Appointment.findOne({
      admin,
      ...(agent && { agent }),
      date: body.date,
      "bookedTime.from": body.bookedTime.from,
      "bookedTime.to": body.bookedTime.to,
      status: { $nin: ["completed", "cancelled"] },
    });

    if (existingAppointment)
      return apiResponse(
        "Sorry, selected Time slot is no longer available",
        null,
        409
      );

    const leadType = getLeadType(body.type, body.callReason);
    if (!leadType) return apiResponse("Invalid appointment type", null, 400);

    // ✅ Create appointment
    const appointment = new Appointment({ admin, ...body });

    const adminObj = await Admin.findById(agent ? agent : admin)
      .select("google")
      .lean();

    if (!adminObj) return apiResponse("Admin Required", null, 401);

    // ✅ If Google calendar is connected, create event
    if (adminObj.google?.accessToken) {
      const eventStart = DateTime.fromISO(
        `${body.date}T${body.bookedTime.from}`,
        { zone: "America/New_York" }
      );
      const eventEnd = DateTime.fromISO(`${body.date}T${body.bookedTime.to}`, {
        zone: "America/New_York",
      });

      const googleEvent = await createGoogleEvent(admin, {
        summary: `${body.type === "call" ? "Call" : "House Tour"} with ${
          body.customer.firstName
        } ${body.customer.lastName}`,
        description: `Customer: ${body.customer.firstName} ${body.customer.lastName}\nPhone: ${body.customer.phone}\nEmail: ${body.customer.email}`,
        start: eventStart,
        end: eventEnd,
        attendeeEmail: body.customer.email,
      });

      // ✅ Save Google event ID if created successfully
      if (googleEvent?.id) {
        appointment.googleEventId = googleEvent.id;
      }
    }

    await appointment.save();

    // ✅ Create lead
    const newLead = new Lead({
      admin,
      ...(agent && { agent }),
      type: leadType,
      status: LeadStatus[leadType][0],
      firstName: body.customer.firstName,
      lastName: body.customer.lastName,
      email: body.customer.email,
      phone: body.customer.phone,
      ...(leadType === "House Tour Leads" && { propertyId: body.propertyId }),
    });

    await newLead.save();

    // ✅ Create notification
    const notification = new Notification({
      admin,
      ...(agent && { agent }),
      recipientType: "admin",
      type: "new_appointment",
      message: `${body.customer.firstName} ${
        body.customer.lastName
      } just booked a ${
        body.type === "call" ? "call" : "house touring"
      } appointment.`,
    });

    await notification.save();

    return apiResponse("Appointment booked successfully", null, 201);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
