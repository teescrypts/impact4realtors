import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import Agent from "@/app/model/agent";
import Lead from "@/app/model/lead";
import Appointment from "@/app/model/appointment";
import { NextRequest, NextResponse } from "next/server";
import OpeningHour from "@/app/model/opening-hour";
import AgentForm from "@/app/model/agent-form";

export async function GET(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse;
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const agents = await Agent.find({ admin: admin._id })
      .select("firstName lastName email owner")
      .lean();

    const agentIds = agents.map((agent) => agent.owner);

    // Fetch leads counts
    const leads = await Lead.aggregate([
      { $match: { admin: admin._id, agent: { $in: agentIds } } },
      { $group: { _id: "$agent", count: { $sum: 1 } } },
    ]);

    const leadsMap = new Map(leads.map((l) => [String(l._id), l.count]));

    // Fetch pending appointments
    const appointments = await Appointment.aggregate([
      {
        $match: {
          admin: admin._id,
          agent: { $in: agentIds },
          status: "pending",
        },
      },
      { $group: { _id: "$agent", count: { $sum: 1 } } },
    ]);

    const appointmentMap = new Map(
      appointments.map((a) => [String(a._id), a.count])
    );

    // Fetch agent availability
    const openingHours = await OpeningHour.find({ agent: { $in: agentIds } })
      .select("agent availability")
      .lean();

    console.log(openingHours);

    const availabilityMap = new Map(
      openingHours.map((hour) => [String(hour.agent), hour.availability])
    );

    const result = agents.map((agent) => ({
      id: String(agent.owner),
      name: `${agent.firstName} ${agent.lastName}`,
      email: agent.email,
      availability:
        availabilityMap.get(String(agent.owner)) === "available"
          ? "Available"
          : "Busy",
      leads: leadsMap.get(String(agent.owner)) || 0,
      activeAppointments: appointmentMap.get(String(agent.owner)) || 0,
    }));

    const pendingForms = await AgentForm.countDocuments({ admin: admin._id });

    return apiResponse(
      "Fetched agents with stats",
      { result, pendingForms },
      200
    );
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unexpected error occurred",
      null,
      500
    );
  }
}
