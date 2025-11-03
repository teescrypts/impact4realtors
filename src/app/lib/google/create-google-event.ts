"use server"

import { DateTime } from "luxon";
import { getAuthorizedClient } from "./get-authorized-client";

interface EventDetails {
  summary: string;
  description?: string;
  start: DateTime;
  end: DateTime;
  attendeeEmail?: string;
}

export const createGoogleEvent = async (
  adminId: string,
  event: EventDetails
) => {
  const oauth2Client = await getAuthorizedClient(adminId);
  if (!oauth2Client) return null;

  // ✅ Dynamically import googleapis only when needed (server runtime only)
  const { google } = await import("googleapis");

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  try {
    const res = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: event.summary,
        description: event.description,
        start: {
          dateTime: event.start.toISO(),
          timeZone: event.start.zoneName,
        },
        end: {
          dateTime: event.end.toISO(),
          timeZone: event.end.zoneName,
        },
        attendees: event.attendeeEmail ? [{ email: event.attendeeEmail }] : [],
      },
    });

    return res.data;
  } catch (err) {
    console.error("❌ Google Calendar event creation error:", err);
    return null;
  }
};
