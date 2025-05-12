import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import Connect from "@/app/model/connect";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

const ITEMS_PER_PAGE = 10;

export async function GET(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse;
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const agentId = new mongoose.Types.ObjectId(admin._id as string);
  const searchParams = req.nextUrl.searchParams;
  const status = searchParams.get("status");
  const lastCreatedAt = searchParams.get("lastCreatedAt");

  const query: Partial<{
    matchedAgents: object;
    connectedAgent: object | null;
    createdAt: { $lt: Date };
  }> = {};

  try {
    if (status === "pending") {
      query.matchedAgents = agentId;
      query.connectedAgent = null;
    } else if (status === "accepted") {
      query.connectedAgent = agentId;
    } else if (status === "unmatched") {
      query.matchedAgents = { $size: 0 };
      query.connectedAgent = null;
    } else {
      return apiResponse("Invalid status", null, 400);
    }

    if (lastCreatedAt) {
      query.createdAt = { $lt: new Date(lastCreatedAt) };
    }

    const connects = await Connect.find(query)
      .sort({ createdAt: -1 })
      .limit(ITEMS_PER_PAGE);

    const hasMore = connects.length === ITEMS_PER_PAGE;

    return apiResponse(
      "Success",
      {
        connects,
        hasMore,
        lastCreatedAt: connects.at(-1)?.createdAt || null,
      },
      200
    );
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
