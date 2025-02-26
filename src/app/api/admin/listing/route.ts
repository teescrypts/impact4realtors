import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import Image from "@/app/model/images";
import Property from "@/app/model/property";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse.status === 401) return authResponse; // Return if unauthorized

  const admin = authResponse; // Retrieve user ID
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const property = new Property({ ...body, admin: admin._id });
    await property.save();
    await Image.updateMany(
      { admin: admin._id, status: "drafted", type: "listing" },
      { status: "uploaded" }
    );
    return apiResponse("Property Listed", null, 201);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}

export async function GET(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse.status === 401) return authResponse;

  const admin = authResponse;
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 6;
    const skip = (page - 1) * limit;

    const status = searchParams.get("status");
    const searchQuery = searchParams.get("query");

    // Construct filter object
    const filter: any = { admin: admin._id };

    if (status && status.trim() !== "") {
      filter.status = status;
    }

    if (searchQuery && searchQuery.trim() !== "") {
      filter.$or = [
        { propertyTitle: { $regex: searchQuery, $options: "i" } },
        { "location.stateName": { $regex: searchQuery, $options: "i" } },
        { "location.stateCode": { $regex: searchQuery, $options: "i" } },
        {
          bedrooms: !isNaN(parseInt(searchQuery))
            ? parseInt(searchQuery)
            : undefined,
        },
        {
          bathrooms: !isNaN(parseInt(searchQuery))
            ? parseInt(searchQuery)
            : undefined,
        },
        {
          squareMeters: !isNaN(parseInt(searchQuery))
            ? parseInt(searchQuery)
            : undefined,
        },
      ].filter((condition) => condition !== undefined);
    }

    const properties = await Property.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const totalCount = await Property.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    return apiResponse(
      "Fetch successful",
      {
        properties,
        pagination: { totalCount, totalPages, currentPage: page },
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
