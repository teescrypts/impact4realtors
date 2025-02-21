import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse.status === 401) return authResponse; // Return if unauthorized

  const admin = authResponse; // Retrieve user ID
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();

  console.log(body);

  return apiResponse("success");
}
