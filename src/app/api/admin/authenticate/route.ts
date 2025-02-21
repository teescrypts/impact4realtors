import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import { connectToDB } from "@/app/lib/mongoosejs";
import Admin from "@/app/model/admin";
import { NextRequest, NextResponse, userAgent } from "next/server";

export async function GET(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse.status === 401) return authResponse; // Return if unauthorized

  const admin = authResponse; // Retrieve user ID
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectToDB();
    const user = await Admin.findById(admin._id);
    if (!user) return apiResponse("Authorization failed", null, 401);

    return apiResponse("Authentication successful", { user });
  } catch (e) {
    return apiResponse("Authorization failed", null, 401);
  }
}
