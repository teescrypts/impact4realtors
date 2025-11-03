"use server"

import Admin from "@/app/model/admin";

export const fetchGoogleBusyTimes = async (
  adminId: string,
  timeMin: string,
  timeMax: string
) => {
  try {
    const admin = await Admin.findById(adminId).select("google").lean();
    if (!admin?.google?.accessToken) return [];

    // ✅ Dynamically import googleapis only when needed (server-only)
    const { google } = await import("googleapis");

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/google/callback`
    );

    oauth2Client.setCredentials({
      access_token: admin.google.accessToken,
      refresh_token: admin.google.refreshToken,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const res = await calendar.freebusy.query({
      requestBody: {
        timeMin,
        timeMax,
        items: [{ id: "primary" }],
      },
    });

    const busySlots = res.data.calendars?.primary?.busy || [];

    return busySlots.filter(
      (b) =>
        b.start &&
        b.end &&
        typeof b.start === "string" &&
        typeof b.end === "string"
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Google Calendar freebusy error:", error.message);

      const message = error.message.toLowerCase();
      if (message.includes("invalid_grant")) {
        console.warn("⚠️ Access token invalid or revoked for admin:", adminId);
      }

      const code = (error as { code?: number }).code;
      if (code === 401) {
        console.warn("⚠️ Access token expired for admin:", adminId);
      }
    } else {
      console.error(
        "❌ Unknown error while fetching Google busy times:",
        error
      );
    }

    return [];
  }
};
