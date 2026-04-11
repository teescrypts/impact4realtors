import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import { LeadJourneyProgress, ScheduledAction } from "@/app/model/journey";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse;
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  //   const isAgent = admin.agent?.isAgent === true;

  try {
    const searchParams = req.nextUrl.searchParams;
    const leadId = searchParams.get("leadId");

    const progress = await LeadJourneyProgress.findOne({ lead: leadId })
      .populate("journey")
      .lean();

    const nextScheduledAction = await ScheduledAction.findOne({
      lead: leadId,
      status: "pending",
    }).lean();

    return apiResponse("success", { progress, nextScheduledAction }, 200);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500,
    );
  }
}
