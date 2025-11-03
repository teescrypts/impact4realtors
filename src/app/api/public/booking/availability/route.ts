import apiResponse from "@/app/lib/api-response";
import { fetchGoogleBusyTimes } from "@/app/lib/google/fetch-google-busy-times";
import Appointment from "@/app/model/appointment";
import OpeningHour, { IOpeningHour } from "@/app/model/opening-hour";
import getAdmin from "@/app/utils/get-admin";
import { DateTime, Interval } from "luxon";
import { NextRequest } from "next/server";

const TIME_ZONE = "America/New_York";
const LEAD_TIME_HOURS = 1;

const DURATION = {
  call: 30,
  tour: 45,
} as const;

const PADDING = {
  call: 5,
  tour: 15,
} as const;

type AppointmentType = "call" | "tour";

interface DailyAvailability {
  date: string;
  slots: string[];
}

// interface GoogleBusySlot {
//   start: string | null | undefined;
//   end: string | null | undefined;
// }

/**
 * Type guard ensuring Google busy slot has valid string start/end.
 */
// function isBusySlot(
//   busy: GoogleBusySlot
// ): busy is { start: string; end: string } {
//   return typeof busy.start === "string" && typeof busy.end === "string";
// }

function hasOverlap(interval: Interval, others: Interval[]): boolean {
  return others.some((other) => interval.overlaps(other));
}

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdmin(req);
    const params = req.nextUrl.searchParams;

    const appointmentType = (params.get("type") as AppointmentType) || "call";
    const agent = params.get("agent");
    // get raw param
    const rawStartDate = params.get("startDate");

    // respect literal string "undefined" coming from some frontends
    const startDateParam =
      rawStartDate === "undefined" ? undefined : rawStartDate ?? undefined;

    // Build startDate with Luxon and validate
    const startDate = startDateParam
      ? DateTime.fromISO(startDateParam, { zone: TIME_ZONE })
      : DateTime.now().setZone(TIME_ZONE).plus({ hours: LEAD_TIME_HOURS });

    // Defensive check: if parsing failed, return a helpful response
    if (!startDate.isValid) {
      console.error("Invalid startDateParam:", startDateParam);
      return apiResponse(
        "Invalid startDate provided",
        { availability: [], timeZone: TIME_ZONE, nextStartDate: null },
        400
      );
    }

    const endDate = startDate.plus({ days: 7 });

    // Filters
    const openingHrFilter = agent
      ? { agent, availability: "available" }
      : { admin, availability: "available" };

    const appointmentFilter = {
      [agent ? "agent" : "admin"]: agent ?? admin,
      status: { $nin: ["completed", "cancelled"] },
      date: { $gte: startDate.toISODate(), $lte: endDate.toISODate() },
    };

    // Fetch data in parallel
    const [openingHours, appointments, googleBusy] = await Promise.all([
      OpeningHour.findOne(openingHrFilter),
      Appointment.find(appointmentFilter).select("date bookedTime"),
      fetchGoogleBusyTimes(
        String(agent ? agent : admin),
        startDate.startOf("day").toISO()!,
        endDate.endOf("day").toISO()!
      ),
    ]);

    if (!openingHours) {
      return apiResponse(
        "We're still getting things ready—please check back later",
        null,
        200
      );
    }

    // ✅ Convert Google busy times to intervals (strictly typed)
    const googleBusyIntervals = (
      (googleBusy as { start?: string; end?: string }[]) ?? []
    )
      .filter((b): b is { start: string; end: string } => !!b.start && !!b.end)
      .map((b) =>
        Interval.fromDateTimes(
          DateTime.fromISO(b.start!, { zone: "utc" }).setZone(TIME_ZONE),
          DateTime.fromISO(b.end!, { zone: "utc" }).setZone(TIME_ZONE)
        )
      );

    // ✅ Convert appointments to intervals
    const appointmentIntervals = (appointments ?? []).map((a) =>
      Interval.fromDateTimes(
        DateTime.fromISO(`${a.date}T${a.bookedTime.from}`, {
          zone: TIME_ZONE,
        }).minus({
          minutes: PADDING[appointmentType],
        }),
        DateTime.fromISO(`${a.date}T${a.bookedTime.to}`, {
          zone: TIME_ZONE,
        }).plus({
          minutes: PADDING[appointmentType],
        })
      )
    );

    const availability: DailyAvailability[] = [];

    for (
      let day = startDate.startOf("day");
      day < endDate;
      day = day.plus({ days: 1 })
    ) {
      const dayName = day.toFormat("cccc").toLowerCase();
      const timeSlots = openingHours[dayName as keyof IOpeningHour];

      if (!timeSlots || timeSlots.length === 0) {
        availability.push({ date: day.toFormat("yyyy-MM-dd"), slots: [] });
        continue;
      }

      const dailySlots: string[] = [];

      for (const slot of timeSlots) {
        const slotStart = DateTime.fromISO(
          `${day.toFormat("yyyy-MM-dd")}T${slot.from}`,
          { zone: TIME_ZONE }
        );
        const slotEnd = DateTime.fromISO(
          `${day.toFormat("yyyy-MM-dd")}T${slot.to}`,
          { zone: TIME_ZONE }
        );

        let currentStart = slotStart;

        while (
          currentStart.plus({ minutes: DURATION[appointmentType] }) <= slotEnd
        ) {
          const proposed = Interval.fromDateTimes(
            currentStart,
            currentStart.plus({ minutes: DURATION[appointmentType] })
          );

          const conflict =
            hasOverlap(proposed, appointmentIntervals) ||
            hasOverlap(proposed, googleBusyIntervals);

          if (!conflict) dailySlots.push(currentStart.toFormat("HH:mm"));

          currentStart = currentStart.plus({ minutes: 15 });
        }
      }

      availability.push({
        date: day.toFormat("yyyy-MM-dd"),
        slots: dailySlots,
      });
    }

    const nextStartDate = startDateParam
      ? endDate.toISODate()
      : endDate.plus({ days: 1 }).toISODate();

    return apiResponse(
      "Success",
      { availability, timeZone: TIME_ZONE, nextStartDate },
      201
    );
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
