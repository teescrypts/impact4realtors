import apiResponse from "@/app/lib/api-response";
import Agent from "@/app/model/agent";
import Connect, { IConnect, ConnectType } from "@/app/model/connect";
import Notification from "@/app/model/notification";
import getAdmin from "@/app/utils/get-admin";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

const sanitize = (str: string) => str?.trim().replace(/\s+/g, " ");
const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdmin(req);
    const adminId =
      admin && mongoose.Types.ObjectId.isValid(admin)
        ? new mongoose.Types.ObjectId(admin)
        : null;

    const body = await req.json();

    const {
      type = "seller",
      firstName,
      lastName,
      email,
      phone,
      state,
      zipCode,
      address,
      bedrooms,
      bathrooms,
      yearBuilt,
      squareFootage,
      purpose,
    } = body as Partial<IConnect> & { type?: ConnectType };

    const istate = escapeRegex(sanitize(state || ""));
    const izipCode = sanitize(zipCode || "");

    let agents = await Agent.find({
      licensedStates: { $elemMatch: { postalCode: izipCode } },
    });

    if (agents.length === 0 && state) {
      agents = await Agent.find({
        licensedStates: {
          $elemMatch: { state: { $regex: istate, $options: "i" } },
        },
      });
    }

    const matchedAgentIds = agents.map((a) => a.owner);

    const connectData = {
      admin: adminId!,
      type,
      firstName: firstName || "",
      lastName: lastName || "",
      email: email || "",
      phone: phone || "",
      state: state || "",
      zipCode: zipCode || "",
      matchedAgents: matchedAgentIds,
      connectedAgent: undefined,
    };

    if (type === "homeValuation") {
      Object.assign(connectData, {
        address: address || "",
        bedrooms: bedrooms || "",
        bathrooms: bathrooms || "",
        yearBuilt: yearBuilt || "",
        squareFootage: squareFootage || "",
        purpose: purpose || "",
      });
    }

    await Connect.create(connectData);

    const notifications = agents.map((agent) => ({
      admin: adminId,
      agent: agent.owner,
      recipientType: "admin",
      type: "new_connect",
      message:
        type === "homeValuation"
          ? `New home valuation request from ${firstName} ${lastName}.`
          : `New seller request in your area from ${firstName} ${lastName}.`,
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    return apiResponse(
      type === "homeValuation"
        ? "Home valuation request sent"
        : "Sell request sent",
      null,
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
