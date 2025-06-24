import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import Agent from "@/app/model/agent";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse;

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!admin.isBroker) {
    return apiResponse("Invalid Operation", null, 400);
  }

  try {
    let agent = await Agent.findOne({ owner: admin._id });

    if (!agent) {
      agent = await Agent.create({
        admin: admin._id,
        owner: admin._id,
        firstName: admin.fname,
        lastName: admin.lname,
        email: admin.email,
        phone: "12345678810",
        licenseNumber: "LCI-123456",
      });
      
      return apiResponse("Agent profile created", { agent }, 201);
    }

    return apiResponse("Agent profile retrieved", { agent }, 200);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
