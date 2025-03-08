import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
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
    if (!appointment) {
      return apiResponse("Invalid Operation", null, 401);
    }

    // Save previous appointment details
    const previousDateEntry = {
      date: appointment.date,
      bookedTime: appointment.bookedTime,
    };

    // Update appointment with new details
    appointment.reschedule.previousDates.push(previousDateEntry);
    appointment.reschedule.isRescheduled = true;
    appointment.date = newDate;
    appointment.bookedTime = newBookedTime;
    appointment.status = "rescheduled";

    await appointment.save();

    return apiResponse("Success", null, 201);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
