import apiResponse from "@/app/lib/api-response";
import Agent from "@/app/model/agent";
import Connect from "@/app/model/connect";
import Notification from "@/app/model/notification";
import getAdmin from "@/app/utils/get-admin";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdmin(req);
    const body = await req.json();
    const { firstName, lastName, email, phone, state, zipCode } = body;

    // First: match by zip code
    let agents = await Agent.find({
      licensedStates: {
        $elemMatch: {
          postalCode: zipCode,
        },
      },
    });

    // If no ZIP matches, fall back to state match
    if (agents.length === 0) {
      agents = await Agent.find({
        licensedStates: {
          $elemMatch: {
            state,
          },
        },
      });
    }

    // Create connect document
    const matchedAgentIds = agents.map((a) => a.owner);
    await Connect.create({
      admin,
      firstName,
      lastName,
      email,
      phone,
      state,
      zipCode,
      matchedAgents: matchedAgentIds,
    });

    // Notify each matched agent
    const notifications = agents.map((agent) => ({
      admin,
      agent: agent.owner,
      recipientType: "admin",
      type: "new_connect",
      message: `New connection request in your area from ${firstName} ${lastName}.`,
    }));

    await Notification.insertMany(notifications);

    return apiResponse("Sell request sent", null, 201);
  } catch (e) {
    console.error(e);
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
