import { NextRequest, NextResponse } from "next/server";
import Property from "@/app/model/property";
import apiResponse from "@/app/lib/api-response";
import { authMiddleware } from "@/app/lib/_middleware";

export async function GET(req: NextRequest) {
  // Auth check
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse;
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("query")?.trim() || "";

    if (!query) {
      return apiResponse("Query is required", { properties: [] }, 200);
    }

    // Split query into words and escape regex special chars
    const words = query
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

    const isAgent = admin.agent?.isAgent;
    const isBroker = admin.isBroker;

    const baseFilter: Record<string, unknown> = {
      [isAgent ? "agent" : "admin"]: admin._id,
    };

    // If broker wants only their listings
    if (isBroker && searchParams.get("status") === "yourListings") {
      baseFilter.agent = admin._id;
    }

    // Build robust $and filter for multiple words
    const searchFilter = words.length
      ? {
          $and: words.map((word) => ({
            $or: [
              { propertyTitle: { $regex: word, $options: "i" } },
              { "location.cityName": { $regex: word, $options: "i" } },
              { "location.stateName": { $regex: word, $options: "i" } },
            ],
          })),
        }
      : {};

    const finalFilter = { ...baseFilter, ...searchFilter };

    const properties = await Property.find(finalFilter)
      .select({
        _id: 1,
        propertyTitle: 1,
        location: 1,
      })
      .limit(10)
      .sort({ createdAt: -1 });

    // Map location to single string for frontend
    const results = properties.map((prop) => ({
      _id: prop._id,
      propertyTitle: prop.propertyTitle,
      location: `${prop.location.addressLine1}, ${prop.location.cityName}, ${prop.location.stateName}`,
    }));

    return apiResponse("Properties fetched", { properties: results }, 200);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
