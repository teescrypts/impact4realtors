import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import Notification, { INotification } from "@/app/model/notification";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse;
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const searchParams = req.nextUrl.searchParams;
    const lastCreatedAt = searchParams.get("lastCreatedAt");

    // Query object
    const query: { admin: mongoose.Types.ObjectId; createdAt?: { $lt: Date } } =
      {
        admin: admin._id as mongoose.Types.ObjectId, // Admin ID from authMiddleware
      };

    if (lastCreatedAt) {
      const parsedDate = new Date(lastCreatedAt);
      if (!isNaN(parsedDate.getTime())) {
        query.createdAt = { $lt: parsedDate }; // Fetch notifications older than lastCreatedAt
      }
    }

    // Fetch the latest 10 notifications
    const notifications: INotification[] = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(5);

    // Check if there are more notifications
    const hasMore = notifications.length === 5;

    return apiResponse(
      "Success",
      {
        notifications,
        hasMore,
        lastCreatedAt: notifications.at(-1)?.createdAt || null,
      },
      200
    );
  } catch (error) {
    return apiResponse(
      error instanceof Error ? error.message : "An unknown error occurred",
      null,
      500
    );
  }
}




