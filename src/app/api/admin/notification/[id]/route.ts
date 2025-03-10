import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/lib/_middleware";
import Notification from "@/app/model/notification";
import apiResponse from "@/app/lib/api-response";

// ✅ PATCH /api/notifications/[id]/read
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse; // Unauthorized

  const admin = authResponse;
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const _id = (await params).id;

    const notification = await Notification.findOne({
      _id,
      admin: admin._id,
    });

    if (!notification) {
      return apiResponse("Notification not found", null, 404);
    }

    notification.isRead = true;
    await notification.save();

    return apiResponse("Success", null, 201);
  } catch (error) {
    return apiResponse(
      error instanceof Error ? error.message : "An unknown error occurred",
      null,
      500
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse; // Unauthorized

  const admin = authResponse;
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const _id = (await params).id;
    const notification = await Notification.findOneAndDelete({
      _id,
      admin: admin._id,
    });

    if (!notification) {
      return apiResponse("Notification not found", null, 404);
    }

    return apiResponse("Notification deleted successfully", null, 200);
  } catch (error) {
    return apiResponse(
      error instanceof Error ? error.message : "An unknown error occurred",
      null,
      500
    );
  }
}
