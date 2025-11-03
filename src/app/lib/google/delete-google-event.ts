"use server"

import { getAuthorizedClient } from "./get-authorized-client";

/**
 * Deletes a Google Calendar event using the stored event ID.
 * Automatically handles token refresh via getAuthorizedClient().
 */
export const deleteGoogleEvent = async (adminId: string, eventId: string) => {
  const oauth2Client = await getAuthorizedClient(adminId);
  if (!oauth2Client) return null;

  // ✅ Dynamically import googleapis at runtime (server-only)
  const { google } = await import("googleapis");

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  try {
    await calendar.events.delete({
      calendarId: "primary",
      eventId,
    });

    console.log(`🗑️ Successfully deleted Google Calendar event: ${eventId}`);
    return true;
  } catch (err) {
    console.error("❌ Error deleting Google Calendar event:", err);
    return false;
  }
};
