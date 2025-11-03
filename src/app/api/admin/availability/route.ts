import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import { fetchGoogleBusyTimes } from "@/app/lib/google/fetch-google-busy-times";
import Appointment from "@/app/model/appointment";
import OpeningHour, { IOpeningHour } from "@/app/model/opening-hour";
import { DateTime, Interval } from "luxon";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const authResponse = await authMiddleware(req);
    if (authResponse instanceof NextResponse) return authResponse;

    const admin = authResponse;
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const isAgent = admin.agent?.isAgent === true;
    const isBroker = admin.isBroker;

    const openingHours = await OpeningHour.findOne({
      [isAgent ? "agent" : "admin"]: admin._id,
      ...(isBroker && { agent: admin._id }),
      availability: "available",
    });

    const searchParams = req.nextUrl.searchParams;
    const appointmentType = searchParams.get("type");

    if (!openingHours)
      return apiResponse(
        "You are currently unavailable. Kindly update your availability to reschedule an appointment",
        null,
        200
      );

    const paddingBefore = appointmentType === "call" ? 5 : 15;
    const paddingAfter = appointmentType === "call" ? 5 : 15;

    const leadTimeHours = 1;
    const timeZone = "America/New_York";

    const durationInMinutes = appointmentType === "call" ? 30 : 45;

    const startDateParam =
      searchParams.get("startDate") === "undefined"
        ? undefined
        : searchParams.get("startDate");

    const startDate = startDateParam
      ? DateTime.fromISO(startDateParam, { zone: timeZone })
      : DateTime.now().setZone(timeZone).plus({ hours: leadTimeHours });

    const endDate = startDate.plus({ days: 7 });

    const appointments = await Appointment.find({
      [isAgent ? "agent" : "admin"]: admin._id,
      ...(isBroker && { agent: admin._id }),
      status: { $nin: ["completed", "cancelled"] },
      date: { $gte: startDate.toISODate(), $lte: endDate.toISODate() },
    }).select("date bookedTime");

    const timeMin = startDate.startOf("day").toISO()!;
    const timeMax = endDate.endOf("day").toISO()!;
    const googleBusy = await fetchGoogleBusyTimes(
      admin._id as string,
      timeMin,
      timeMax
    );

    console.log(googleBusy);

    const availability = [];

    for (
      let day = startDate.startOf("day");
      day < endDate;
      day = day.plus({ days: 1 })
    ) {
      const dayName = day.toFormat("cccc").toLowerCase();
      const timeSlots = openingHours[dayName as keyof IOpeningHour];

      if (!timeSlots || timeSlots.length === 0) {
        availability.push({ date: day.toISODate(), slots: [] });
        continue;
      }

      const dailyAvailability: string[] = [];

      for (const slot of timeSlots) {
        const slotStart = DateTime.fromISO(`${day.toISODate()}T${slot.from}`, {
          zone: timeZone,
        });
        const slotEnd = DateTime.fromISO(`${day.toISODate()}T${slot.to}`, {
          zone: timeZone,
        });

        let currentStart = slotStart;

        while (currentStart.plus({ minutes: durationInMinutes }) <= slotEnd) {
          const proposedInterval = Interval.fromDateTimes(
            currentStart,
            currentStart.plus({ minutes: durationInMinutes })
          );

          const isConflict =
            appointments.some((appointment) => {
              const appointmentStart = DateTime.fromISO(
                `${appointment.date}T${appointment.bookedTime.from}`,
                { zone: timeZone }
              ).minus({ minutes: paddingBefore || 0 });

              const appointmentEnd = DateTime.fromISO(
                `${appointment.date}T${appointment.bookedTime.to}`,
                { zone: timeZone }
              ).plus({ minutes: paddingAfter || 0 });

              const appointmentInterval = Interval.fromDateTimes(
                appointmentStart,
                appointmentEnd
              );

              return proposedInterval.overlaps(appointmentInterval);
            }) ||
            googleBusy.some((busy) => {
              if (!busy.start || !busy.end) return false; // skip invalid entries

              const busyStart = DateTime.fromISO(busy.start).setZone(timeZone);
              const busyEnd = DateTime.fromISO(busy.end).setZone(timeZone);

              if (!busyStart.isValid || !busyEnd.isValid) return false;

              const busyInterval = Interval.fromDateTimes(busyStart, busyEnd);
              return proposedInterval.overlaps(busyInterval);
            });

          if (!isConflict) {
            dailyAvailability.push(currentStart.toFormat("HH:mm"));
          }

          currentStart = currentStart.plus({ minutes: 15 });
        }
      }

      availability.push({
        date: day.toISODate(),
        slots: dailyAvailability,
      });
    }

    const initialRequest = !startDateParam;

    return apiResponse(
      "Success",
      {
        availability,
        timeZone,
        nextStartDate: initialRequest
          ? endDate.plus({ days: 1 }).toISODate() // first load, skip last day
          : endDate.toISODate(), // subsequent loads, normal behavior
      },
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
