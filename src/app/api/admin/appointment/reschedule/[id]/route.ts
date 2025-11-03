// app/api/appointment/[id]/reschedule/route.ts
import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import { updateGoogleEvent } from "@/app/lib/google/update-google-event";
import Appointment from "@/app/model/appointment";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
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
    const { newDate, newBookedTime } = await req.json();

    const appointment = await Appointment.findById(_id);
    if (!appointment) return apiResponse("Invalid Operation", null, 401);

    // ✅ Track previous appointment info
    appointment.reschedule.previousDates.push({
      date: appointment.date,
      bookedTime: appointment.bookedTime,
    });

    // ✅ Update local data
    appointment.reschedule.isRescheduled = true;
    appointment.date = newDate;
    appointment.bookedTime = newBookedTime;
    appointment.status = "rescheduled";

    // datetime auto-updates via your pre-save hook 👍

    // ✅ Update Google Calendar (if event exists)
    if (appointment.googleEventId) {
      await updateGoogleEvent(admin._id as string, {
        eventId: appointment.googleEventId,
        newDate,
        newBookedTime,
        description: `${appointment.customer.firstName} ${appointment.customer.lastName} — rescheduled.`,
      });
    }

    await appointment.save();

    return apiResponse("Appointment rescheduled successfully", null, 201);
  } catch (e) {
    console.error("Reschedule error:", e);
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
