import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import Appointment from "@/app/model/appointment";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse;
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const searchParams = req.nextUrl.searchParams;
    const lastCreatedAt = searchParams.get("lastCreatedAt");
    const status = searchParams.get("status"); // Get the status query param

    const query: { admin: string; createdAt?: { $lt: Date }; status?: string } =
      {
        admin: admin._id as string,
      };

    if (lastCreatedAt) {
      query.createdAt = { $lt: new Date(lastCreatedAt) };
    }

    if (status) {
      query.status = status.trim(); // Ensure it's a clean string
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
