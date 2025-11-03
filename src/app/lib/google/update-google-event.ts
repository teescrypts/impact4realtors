"use server"

import { DateTime } from "luxon";
import { getAuthorizedClient } from "./get-authorized-client";

const TIME_ZONE = "America/New_York";

interface UpdateEventDetails {
  eventId: string;
  newDate: string;
  newBookedTime: { from: string; to: string };
  description?: string;
}

export const updateGoogleEvent = async (
  adminId: string,
  details: UpdateEventDetails
) => {
  const oauth2Client = await getAuthorizedClient(adminId);
  if (!oauth2Client) return null;

  // ✅ Dynamically import googleapis
  const { google } = await import("googleapis");

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const eventStart = DateTime.fromISO(
    `${details.newDate}T${details.newBookedTime.from}`,
    { zone: TIME_ZONE }
  );
  const eventEnd = DateTime.fromISO(
    `${details.newDate}T${details.newBookedTime.to}`,
    { zone: TIME_ZONE }
  );

  try {
    const res = await calendar.events.patch({
      calendarId: "primary",
      eventId: details.eventId,
      requestBody: {
        start: {
          dateTime: eventStart.toISO(),
          timeZone: TIME_ZONE,
        },
        end: {
          dateTime: eventEnd.toISO(),
          timeZone: TIME_ZONE,
        },
        description: details.description,
      },
    });

    return res.data;
  } catch (err) {
    console.error("❌ Google Calendar event update failed:", err);
    return null;
  }
};
