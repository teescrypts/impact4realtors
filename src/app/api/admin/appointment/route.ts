import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import Appointment, { IAppointment } from "@/app/model/appointment";
import { NextRequest, NextResponse } from "next/server";
import { FilterQuery } from "mongoose";
import { DateTime } from "luxon";

type AppointmentEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  type: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  status: "upcoming" | "completed" | "cancelled" | "rescheduled";
};

export async function GET(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse;
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const isAgent = admin.agent?.isAgent === true;
  const isBroker = admin.isBroker;

  try {
    const searchParams = req.nextUrl.searchParams;
    const lastCreatedAt = searchParams.get("lastCreatedAt");
    const status = searchParams.get("status");
    const start = searchParams.get("start");
    const end = searchParams.get("end");
    const viewType = searchParams.get("viewType");

    // Safe and flexible query object
    const query: FilterQuery<IAppointment> = {
      [isAgent ? "agent" : "admin"]: admin._id,
      ...(isBroker && { agent: admin._id }),
    };

    if (viewType === "calendar") {
      if (start && end) {
        query.datetime = {
          $gte: new Date(start),
          $lte: new Date(end),
        };
      }

      const appointments = await Appointment.find(query).populate({
        path: "customer",
        select: "fname lname email phone",
      });

      interface IBookedAppointmentwithId extends IAppointment {
        _id: string;
      }

      const mapped: AppointmentEvent[] = appointments.map(
        (apt: IBookedAppointmentwithId) => {
          const { type, status, _id, customer } = apt;

          const dateTimeStart = DateTime.fromISO(
            `${apt.date}T${apt.bookedTime.from}`,
            {
              zone: "America/New_York",
            }
          );
          const start = dateTimeStart.toISO();

          const dateTimeEnd = DateTime.fromISO(
            `${apt.date}T${apt.bookedTime.to}`,
            {
              zone: "America/New_York",
            }
          );
          const end = dateTimeEnd.toISO();

          return {
            id: _id.toString(),
            title:
              type === "call"
                ? `Call appointment with ${customer.firstName} ${customer.lastName}`
                : `House tour appointment with ${customer.firstName} ${customer.lastName}`,
            start: start!,
            end: end!,
            type: type,
            customer: customer,
            status,
          };
        }
      );

      return apiResponse("success", { appointments: mapped }, 200);
    } else {
      if (lastCreatedAt) {
        query.createdAt = { $lt: new Date(lastCreatedAt) };
      }

      if (status) {
        query.status = status.trim();
      }

      const appointments = await Appointment.find(query)
        .sort({ createdAt: -1 })
        .limit(10)
        .populate({
          path: "propertyId",
          select:
            "propertyTitle price bedrooms bathrooms squareMeters location",
        });

      const hasMore = appointments.length === 10;

      return apiResponse(
        "Success",
        {
          appointments,
          hasMore,
          lastCreatedAt: appointments.at(-1)?.createdAt || null,
        },
        200
      );
    }
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
