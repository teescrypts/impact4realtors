import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import Lead, { ILead } from "@/app/model/lead";
import { NextRequest, NextResponse } from "next/server";

const ITEMS_PER_PAGE = 10;

export async function GET(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse; // Retrieve user ID
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const searchParams = req.nextUrl.searchParams;
    const lastCreatedAt = searchParams.get("lastCreatedAt");
    const type = searchParams.get("type");

    // Ensure admin is always included in the query
    const query: { admin: string; createdAt?: { $lt: Date }; type?: string } = {
      admin: admin._id as string,
    };

    if (lastCreatedAt) {
      query.createdAt = { $lt: new Date(lastCreatedAt) }; // Load older leads
    }

    if (!type)
      return apiResponse("Type of lead to fetch is required", null, 401);

    query.type = type;

    const leads: ILead[] = await Lead.find(query)
      .sort({ createdAt: -1 }) // Newest first
      .limit(ITEMS_PER_PAGE);

    const leadsCount = await Lead.countDocuments({ admin: admin._id, type });

    // Check if more leads exist
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
