import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import Admin from "@/app/model/admin";
import Notification from "@/app/model/notification";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse; // Retrieve user ID
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const isAgent = admin.agent.isAgent;

  try {
    const user = await Admin.findById(admin._id);
    if (!user) return apiResponse("Authorization failed", null, 401);
    
    const unreadNotifictaionsCount = await Notification.countDocuments({
      [isAgent ? "agent" : "admin"]: admin._id,
      ...(admin.isBroker && { agent: admin._id }),
      isRead: false,
    });

    return apiResponse(
      "Authentication successful",
      {
        user,
        unreadNotifictaionsCount,
      },
      201
    );
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
