import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/lib/_middleware";
import { Journey, LeadJourneyProgress } from "@/app/model/journey";


/**
 * POST /api/journeys/[id]/deactivate
 * Deactivate a journey (prevent new leads from entering)
 *
 * Query params:
 * - pauseActive: "true" to pause all active progresses (default: false)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResponse = await authMiddleware(req);
    if (authResponse instanceof NextResponse) return authResponse;

    const admin = authResponse; // Retrieve user ID
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let isAgent;

    if (admin.agent.isAgent) {
      isAgent = true;
    }

    const id = (await params).id;
    // Find journey
    const journey = await Journey.findOne({
      _id: id,
      [isAgent ? "agent" : "admin"]: admin._id,
    });

    if (!journey) {
      return NextResponse.json({ error: "Journey not found" }, { status: 404 });
    }

    // Check if already inactive
    if (!journey.isActive) {
      return NextResponse.json(
        { error: "Journey is already inactive" },
        { status: 400 },
      );
    }

    // Parse query params
    const { searchParams } = new URL(req.url);
    const pauseActive = searchParams.get("pauseActive") === "true";

    // Deactivate journey using model method
    await journey.deactivate();

    // Optionally pause all active progresses
    let pausedCount = 0;
    if (pauseActive) {
      const activeProgresses = await LeadJourneyProgress.find({
        journey: id,
        status: "active",
      });

      for (const progress of activeProgresses) {
        await progress.pause();
        pausedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      data: journey,
      message: "Journey deactivated successfully",
      pausedProgresses: pausedCount,
    });
  } catch (error: any) {
    console.error("Error deactivating journey:", error);
    return NextResponse.json(
      { error: "Failed to deactivate journey", details: error.message },
      { status: 500 },
    );
  }
}
