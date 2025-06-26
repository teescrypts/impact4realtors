import apiResponse from "@/app/lib/api-response";
import Agent from "@/app/model/agent";
import Connect from "@/app/model/connect";
import Notification from "@/app/model/notification";
import getAdmin from "@/app/utils/get-admin";
import { NextRequest } from "next/server";

const sanitize = (str: string) => str?.trim().replace(/\s+/g, " ");
const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdmin(req);
    const body = await req.json();
    let { firstName, lastName, email, phone, state, zipCode } = body;

    state = escapeRegex(sanitize(state));
    zipCode = sanitize(zipCode);

    // First: match by zip code
    let agents = await Agent.find({
      licensedStates: {
        $elemMatch: {
          postalCode: zipCode,
        },
      },
    });

    // Fuzzy state fallback
    if (agents.length === 0 && state) {
      agents = await Agent.find({
        licensedStates: {
          $elemMatch: {
            state: { $regex: state, $options: "i" },
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
