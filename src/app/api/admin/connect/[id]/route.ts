import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import Connect from "@/app/model/connect";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import HomeValuationRequest from "@/app/model/home-valuation-request";
import Lead, { LeadStatus } from "@/app/model/lead";

// PATCH /api/agent/connects/[id]/accept
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse;
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const agentId = admin._id as string;
  const isAgent = admin.isBroker ? true : admin.agent?.isAgent;

  if (!isAgent) {
    return apiResponse("Only agents can perform this action", null, 403);
  }

  const connectId = (await params).id;

  if (!mongoose.Types.ObjectId.isValid(connectId)) {
    return apiResponse("Invalid connect ID", null, 400);
  }

  try {
    const connect = await Connect.findOne({ _id: connectId });

    if (!connect) {
      return apiResponse("Connect request not found", null, 404);
    }

    if (connect.connectedAgent) {
      return apiResponse(
        "This connect request has already been accepted",
        null,
        409
      );
    }

    // Check if this agent is in matchedAgents
    const isMatched = connect.matchedAgents.some(
      (id: string) => id.toString() === agentId.toString()
    );

    if (!isMatched) {
      if (admin.isBroker) {
        connect.connectedAgent = agentId;
        const newConnect = await connect.save();

        if (newConnect.type === "homeValuation") {
          await HomeValuationRequest.create({
            admin,
            address: newConnect.address,
            bedrooms: newConnect.bedrooms,
            bathrooms: newConnect.bathrooms,
            yearBuilt: newConnect.yearBuilt,
            squareFootage: newConnect.squareFootage,
            purpose: newConnect.purpose,
            firstName: newConnect.firstName,
            lastName: newConnect.lastName,
            email: newConnect.email,
            phone: newConnect.phone,
            status: "Pending",
          });
        }

        return apiResponse("Connect request accepted", null, 200);
      }

      return apiResponse(
        "You are not matched to this connect request",
        null,
        403
      );
    }

    connect.connectedAgent = agentId;
    const newConnect = await connect.save();

    if (newConnect.type === "homeValuation") {
      await HomeValuationRequest.create({
        admin,
        address: newConnect.address,
        bedrooms: newConnect.bedrooms,
        bathrooms: newConnect.bathrooms,
        yearBuilt: newConnect.yearBuilt,
        squareFootage: newConnect.squareFootage,
        purpose: newConnect.purpose,
        firstName: newConnect.firstName,
        lastName: newConnect.lastName,
        email: newConnect.email,
        phone: newConnect.phone,
        status: "Pending",
      });
    }

    if (newConnect.type === "seller") {
      // ✅ Create lead
      const newLead = new Lead({
        admin: admin.agent.isAgent ? admin.agent.admin : admin,
        ...(admin.agent.isAgent && { agent: admin }),
        type: "Home Seller Leads",
        status: LeadStatus["Home Seller Leads"][0],
        firstName: newConnect.firstName,
        lastName: newConnect.lastName,
        email: newConnect.email,
        phone: newConnect.phone,
      });

      await newLead.save();
    }

    return apiResponse("Connect request accepted", null, 200);
  } catch (err) {
    return apiResponse(
      err instanceof Error ? err.message : "An unknown error occurred",
      null,
      500
    );
  }
}
