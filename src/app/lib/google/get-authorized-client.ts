"use server"

import Admin from "@/app/model/admin";

/**
 * Returns an authorized OAuth2 client for a given admin,
 * automatically refreshing and persisting new tokens.
 */
export async function getAuthorizedClient(adminId: string) {
  const admin = await Admin.findById(adminId);
  if (!admin?.google?.accessToken || !admin.google.refreshToken) return null;

  // ✅ Dynamically import googleapis to avoid bundling
  const { google } = await import("googleapis");

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/google/callback`
  );

  oauth2Client.setCredentials({
    access_token: admin.google.accessToken,
    refresh_token: admin.google.refreshToken,
    expiry_date: admin.google.tokenExpiry
      ? new Date(admin.google.tokenExpiry).getTime()
      : undefined,
  });

  // ✅ Automatically handle token refresh
  oauth2Client.on("tokens", async (tokens) => {
    if (tokens.access_token) admin.google.accessToken = tokens.access_token;
    if (tokens.expiry_date)
      admin.google.tokenExpiry = new Date(tokens.expiry_date);
    await admin.save();
  });

  return oauth2Client;
}
