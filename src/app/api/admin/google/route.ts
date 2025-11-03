import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";

export async function GET(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;
  const admin = authResponse;

  const url = new URL(req.url);
  const originUrl =
    url.searchParams.get("origin") ||
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_APP_URL;

  // Create a short-lived JWT to identify which admin is connecting
  const stateToken = jwt.sign(
    { _id: admin._id, originUrl }, // 👈 include originUrl in the token
    process.env.JWT_SECRET as string,
    { expiresIn: "5m" }
  );

  const oauth2Client = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri: `${process.env.NEXT_PUBLIC_API_URL}/api/admin/google/callback`,
  });

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar"],
    prompt: "consent",
    state: stateToken,
  });

  if (authUrl) {
    return apiResponse("Success", { url: authUrl, redirected: true });
  } else {
    return apiResponse("An unknown error occurred", { redirected: false });
  }
}
