import { NextRequest } from "next/server";
import Agent from "@/app/model/agent";
import apiResponse from "@/app/lib/api-response";
import getAdmin from "@/app/utils/get-admin";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdmin(req);
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "6");

    const skip = (page - 1) * limit;

    const [agents, total] = await Promise.all([
      Agent.find({ admin })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("firstName lastName email phone profilePictureUrl owner"),
      Agent.countDocuments(),
    ]);

    return apiResponse(
      "Success",
      {
        agents,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
      200
    );
  } catch (e) {
    console.error("Error fetching agents:", e);
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
