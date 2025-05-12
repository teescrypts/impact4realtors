import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import Lead, { ILead } from "@/app/model/lead";
import { NextRequest, NextResponse } from "next/server";
import { FilterQuery } from "mongoose";

const ITEMS_PER_PAGE = 10;

export async function GET(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse;
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const isAgent = admin.agent?.isAgent === true;

  try {
    const searchParams = req.nextUrl.searchParams;
    const lastCreatedAt = searchParams.get("lastCreatedAt");
    const type = searchParams.get("type");

    if (!type)
      return apiResponse("Type of lead to fetch is required", null, 401);

    // Define query type using Mongoose FilterQuery
    const query: FilterQuery<ILead> = {
      [isAgent ? "agent" : "admin"]: admin._id,
      type,
    };

    if (lastCreatedAt) {
      query.createdAt = { $lt: new Date(lastCreatedAt) };
    }

    const leads: ILead[] = await Lead.find(query)
      .sort({ createdAt: -1 })
      .limit(ITEMS_PER_PAGE);

    const leadsCount = await Lead.countDocuments({
      [isAgent ? "agent" : "admin"]: admin._id,
      type,
    });

    const hasMore =
      leads.length === ITEMS_PER_PAGE && leads.length < leadsCount;

    return apiResponse(
      "Success",
      {
        leads,
        hasMore,
        lastCreatedAt: leads.at(-1)?.createdAt || null,
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
