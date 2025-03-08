import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import Appointment from "@/app/model/appointment";
import { NextRequest, NextResponse } from "next/server";

const VALID_STATUSES = ["upcoming", "completed", "cancelled", "rescheduled"];

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

    appointment.status = status;
    await appointment.save();

    return apiResponse(`Appointment marked ${status}`, null, 200);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
