import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import Appointment from "@/app/model/appointment";
import Lead, { LeadStatus } from "@/app/model/lead";
import Property from "@/app/model/property";
import { DateTime } from "luxon";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse; // Retrieve user ID
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") as string, 10) || 7;

    if (![7, 14, 30].includes(days)) {
      return apiResponse("Invalid Operation", null, 400);
    }

    const startDate = DateTime.utc().minus({ days }).startOf("day").toJSDate();

    // Fetch data in parallel for better performance
    const [
      totalListings,
      totalUpcomingAppointments,
      totalNewLeads,
      leadChartData,
    ] = await Promise.all([
      Property.countDocuments({ admin: admin._id }),
      Appointment.countDocuments({ status: "upcoming", admin: admin._id }),
      Lead.countDocuments({
        status: { $in: Object.values(LeadStatus).map((s) => s[0]) },
        admin: admin._id,
      }),
      Lead.aggregate([
        {
          $match: {
            admin: admin._id,
            createdAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    // Generate date labels and values for chart
    const labels: string[] = [];
    const values: number[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = DateTime.utc().minus({ days: i }).toFormat("MMM d"); // e.g., Mar 5
      const formattedDate = DateTime.utc()
        .minus({ days: i })
        .toFormat("yyyy-MM-dd");
      const leadEntry = leadChartData.find((l) => l._id === formattedDate);
      labels.push(date);
      values.push(leadEntry ? leadEntry.count : 0);
    }

    return apiResponse(
      "Success",
      {
        totalListings,
        totalUpcomingAppointments,
        totalNewLeads,
        leadChartData: { labels, values },
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
