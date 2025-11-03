import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { connectToDB } from "@/app/lib/mongoosejs";
import Admin from "@/app/model/admin";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (!code || !state) {
      return NextResponse.json(
        { error: "Missing code or state" },
        { status: 400 }
      );
    }

    // ✅ Decode state to get adminId and originUrl
    const decoded = jwt.verify(state, process.env.JWT_SECRET as string) as {
      _id: string;
      originUrl?: string;
    };

    const adminId = decoded._id;
    const originUrl = decoded.originUrl || process.env.NEXT_PUBLIC_APP_URL;

    // ✅ Initialize OAuth client
    const oauth2Client = new google.auth.OAuth2({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectUri: `${process.env.NEXT_PUBLIC_API_URL}/api/admin/google/callback`,
    });

    // ✅ Exchange the code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    if (!tokens.access_token || !tokens.refresh_token) {
      return NextResponse.json(
        { error: "Failed to get tokens from Google" },
        { status: 400 }
      );
    }

    // ✅ Save tokens to DB
    await connectToDB();

    const admin = await Admin.findById(adminId);
    if (!admin)
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });

    admin.google = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      tokenExpiry: tokens.expiry_date
        ? new Date(tokens.expiry_date)
        : undefined,
      calendarSyncEnabled: true,
    };
    await admin.save();

    // ✅ Redirect back to the original domain (demo or client site)
    return NextResponse.redirect(
      new URL("/dashboard/appointment?sync=success", originUrl)
    );
  } catch (error) {
    console.error("Google callback error:", error);
    return NextResponse.json(
      { error: "OAuth callback failed" },
      { status: 500 }
    );
  }
}
