import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import Admin from "@/app/model/admin";
import Agent from "@/app/model/agent";
import Appointment from "@/app/model/appointment";
import Lead from "@/app/model/lead";
import Notification from "@/app/model/notification";
import Property from "@/app/model/property";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse;
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = (await params).id;

  try {
    // Delete agent (assuming 1-to-1 mapping with Admin)
    const deletedAdmin = await Admin.findByIdAndDelete(id);
    if (!deletedAdmin) {
      return apiResponse("Admin not found", null, 404);
    }

    // Parallel cleanup (faster than awaiting each one)
    await Promise.all([
      Agent.findOneAndDelete({ owner: id }),
      Appointment.deleteMany({ agent: id }),
      Lead.deleteMany({ agent: id }),
      Property.deleteMany({ agent: id }),
      Notification.deleteMany({ agent: id }),
    ]);

    return apiResponse("Agent and associated data deleted", null, 200);
  } catch (error) {
    console.error("Error deleting agent:", error);
    return apiResponse(
      error instanceof Error ? error.message : "Server error",
      null,
      500
    );
  }
}
