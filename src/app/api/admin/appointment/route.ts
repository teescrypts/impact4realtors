import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import Appointment, { IAppointment } from "@/app/model/appointment";
import { NextRequest, NextResponse } from "next/server";
import { FilterQuery } from "mongoose";

export async function GET(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse;
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const isAgent = admin.agent?.isAgent === true;
  const isBroker = admin.isBroker;

  try {
    const searchParams = req.nextUrl.searchParams;
    const lastCreatedAt = searchParams.get("lastCreatedAt");
    const status = searchParams.get("status");

    // Safe and flexible query object
    const query: FilterQuery<IAppointment> = {
      [isAgent ? "agent" : "admin"]: admin._id,
      ...(isBroker && { agent: admin._id }),
    };

    if (lastCreatedAt) {
      query.createdAt = { $lt: new Date(lastCreatedAt) };
    }

    if (status) {
      query.status = status.trim();
    }

    const appointments = await Appointment.find(query)
      .sort({ createdAt: -1 })
      .limit(10)
      .populate({
        path: "propertyId",
        select: "propertyTitle price bedrooms bathrooms squareMeters location",
      });

    const hasMore = appointments.length === 10;

    return apiResponse(
      "Success",
      {
        appointments,
        hasMore,
        lastCreatedAt: appointments.at(-1)?.createdAt || null,
      },
      200
    );
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
