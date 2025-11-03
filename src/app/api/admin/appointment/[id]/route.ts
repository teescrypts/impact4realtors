// app/api/appointment/[id]/route.ts
import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import { deleteGoogleEvent } from "@/app/lib/google/delete-google-event";
import Appointment from "@/app/model/appointment";
import { DateTime } from "luxon";
import { NextRequest, NextResponse } from "next/server";

const VALID_STATUSES = ["completed", "cancelled"];
const TIME_ZONE = "America/New_York";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResponse = await authMiddleware(req);
    if (authResponse instanceof NextResponse) return authResponse;

    const admin = authResponse;
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const _id = (await params).id;

    const apt = await Appointment.findById(_id).populate({
      path: "propertyId",
      select: "propertyTitle price bedrooms bathrooms squareMeters location",
    });

    return apiResponse("success", apt, 201);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResponse = await authMiddleware(req);
    if (authResponse instanceof NextResponse) return authResponse;

    const admin = authResponse;
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const _id = (await params).id;
    const { status } = await req.json();

    if (!VALID_STATUSES.includes(status)) {
      return apiResponse("Invalid Operation", null, 400);
    }

    const appointment = await Appointment.findById(_id);
    if (!appointment) {
      return apiResponse("Invalid Operation", null, 400);
    }

    // ✅ If "completed", ensure the appointment time has passed
    if (status === "completed") {
      const now = DateTime.now().setZone(TIME_ZONE);
      const appointmentEnd = DateTime.fromISO(
        `${appointment.date}T${appointment.bookedTime.to}`,
        { zone: TIME_ZONE }
      );

      if (appointmentEnd > now) {
        return apiResponse(
          "Appointment cannot be marked as completed before it ends",
          null,
          400
        );
      }
    }

    // ✅ If "cancelled", delete Google Calendar event (if exists)
    if (status === "cancelled" && appointment.googleEventId) {
      await deleteGoogleEvent(admin._id as string, appointment.googleEventId);
    }

    appointment.status = status;
    await appointment.save();

    return apiResponse(`Appointment marked ${status}`, null, 200);
  } catch (e) {
    console.error("PATCH error:", e);
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
