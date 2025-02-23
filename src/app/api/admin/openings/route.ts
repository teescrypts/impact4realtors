import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import OpeningHour, { IOpeningHour } from "@/app/model/opening-hour";
import { revalidateTag } from "next/cache";

// Define the expected authentication response structure
interface AuthResponse {
  _id: mongoose.Types.ObjectId;
}

// Define valid days as keyof IOpeningHour
type DayKeys = keyof Pick<
  IOpeningHour,
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday"
>;

export async function POST(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse.status === 401) return authResponse; // Return if unauthorized

  const admin = authResponse as AuthResponse;
  if (!admin || !admin._id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { day, to, from } = await req.json();

    if (!to || !from) {
      return apiResponse("Please include hour", null, 400);
    }

    const validDays: DayKeys[] = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    if (!validDays.includes(day as DayKeys)) {
      return apiResponse("Invalid day specified", null, 400);
    }

    let extOpeningHour = await OpeningHour.findOne({ admin: admin._id });

    if (!extOpeningHour) {
      extOpeningHour = new OpeningHour({ admin: admin._id });
    }

    // Ensure TypeScript recognizes extOpeningHour[day] as an array of time slots
    const dayKey = day as DayKeys;
    if (!extOpeningHour[dayKey]) {
      extOpeningHour[dayKey] = [];
    }

    extOpeningHour[dayKey] = [...extOpeningHour[dayKey], { to, from }];

    await extOpeningHour.save();

    return apiResponse("Opening hour updated successfully", null, 200);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      400
    );
  }
}

export async function PATCH(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse.status === 401) return authResponse; // Return if unauthorized

  const admin = authResponse as AuthResponse;
  if (!admin || !admin._id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { availability } = await req.json();
    await OpeningHour.findOneAndUpdate({ admin: admin._id }, { availability });

    return apiResponse(`Availability set to ${availability}`, null, 201);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      400
    );
  }
}

type WeekDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

interface DeleteRequestBody {
  day: WeekDay;
  timeSlot: { from: string; to: string };
}

export async function DELETE(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse.status === 401) return authResponse;

  const admin = authResponse as AuthResponse;
  if (!admin || !admin._id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { day, timeSlot }: DeleteRequestBody = await req.json();
    const { from, to } = timeSlot;

    const openingHour = await OpeningHour.findOne({ admin: admin._id });

    if (!openingHour) {
      return apiResponse("Invalid Operation", null, 400);
    }

    const daySlots = openingHour[day];

    if (!daySlots) {
      return apiResponse("Invalid day", null, 400);
    }

    const updatedTimeSlots = daySlots.filter(
      (slot) => !(slot.from === from && slot.to === to)
    );

    if (updatedTimeSlots.length === daySlots.length) {
      return apiResponse("Time slot not found", null, 404);
    }

    openingHour[day] = updatedTimeSlots;
    await openingHour.save();

    return apiResponse("Time slot deleted successfully", null, 200);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}

export async function GET(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse.status === 401) return authResponse;

  const admin = authResponse as AuthResponse;
  if (!admin || !admin._id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let openingHour = await OpeningHour.findOne({ admin: admin._id });

    if (!openingHour) {
      openingHour = new OpeningHour({ admin: admin._id });
      const newOpeningHour = await openingHour.save();
      return apiResponse("success", { newOpeningHour }, 200);
    }

    return apiResponse("success", { openingHour }, 200);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
