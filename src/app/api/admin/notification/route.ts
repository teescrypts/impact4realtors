import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import Notification, { INotification } from "@/app/model/notification";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse;
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAgent = admin.agent?.isAgent;
  const searchParams = req.nextUrl.searchParams;
  const lastCreatedAt = searchParams.get("lastCreatedAt");

  try {
    const query: Record<string, unknown> = {};

    // Filter by agent or admin
    if (admin.isBroker) {
      query.agent = new mongoose.Types.ObjectId(admin._id as string);
    } else {
      query[isAgent ? "agent" : "admin"] = new mongoose.Types.ObjectId(
        admin._id as string
      );
    }

    // Handle pagination via createdAt
    if (lastCreatedAt) {
      const parsedDate = new Date(lastCreatedAt);
      if (!isNaN(parsedDate.getTime())) {
        query.createdAt = { $lt: parsedDate };
      }
    }

    const notifications: INotification[] = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(5);

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
