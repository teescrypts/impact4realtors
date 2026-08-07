import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import { LeadJourneyProgress } from "@/app/model/journey";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/admin/lead/[id]/journey/stop
 *
 * Stop the automation running for a lead. Used when an agent has made contact
 * themselves and does not want the drip to continue.
 *
 * Terminal by design - see the note on ProgressStatus. To start a lead on an
 * automation again, re-tag them.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse;
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const leadId = (await params).id;
    const isAgent = admin.agent?.isAgent;

    // Scope the lookup to the caller so one admin cannot stop another's
    // automation by guessing a lead id.
    const progress = await LeadJourneyProgress.findOne({
      lead: leadId,
      [isAgent ? "agent" : "admin"]: admin._id,
      status: { $in: ["active", "paused"] },
    });

    if (!progress)
      return apiResponse("No running automation found for this lead", null, 404);

    // Written out here rather than via a schema method on purpose.
    //
    // The model is cached as `mongoose.models.X || mongoose.model(...)`, and in
    // development the Node process survives hot reloads - so a method added to
    // the schema after the model was first compiled is silently dropped, and
    // calling it throws "is not a function" until the dev server is restarted.
    // Assigning fields directly has no such dependency.
    progress.status = "cancelled";
    progress.waitingFor = undefined;
    progress.lastActivityAt = new Date();

    // Leaves a mark in the activity feed showing when it was stopped. Any
    // timer already in flight still fires but hits the `status === "active"`
    // guard in the resume paths and does nothing.
    progress.executionHistory.push({
      nodeId: progress.currentNodeId,
      nodeType: "cancelled",
      status: "skipped",
      result: { error: "Stopped by agent" },
      executedAt: new Date(),
    });

    await progress.save();

    return apiResponse("Automation stopped", { status: progress.status }, 200);
  } catch (e) {
    console.error("Error stopping journey:", e);
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500,
    );
  }
}
