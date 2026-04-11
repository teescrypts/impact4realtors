import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/lib/_middleware";
import { Journey } from "@/app/model/journey";
import {
  validateEntryPointUniqueness,
  formatEntryPointError,
} from "@/app/utils/journey-validation-utils";

/**
 * POST /api/journeys/[id]/activate
 * Activate a journey (make it live)
 *
 * STRICT MODE: Final validation of entry point uniqueness before activation
 * This is the last safety check to prevent duplicate active journeys
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

    let isAgent = false;

    if (admin.agent.isAgent) {
      isAgent = true;
    }

    const adminId = admin._id;
    const id = (await params).id;

    // Find journey
    const journey = await Journey.findOne({
      _id: id,
      [isAgent ? "agent" : "admin"]: admin._id,
    });

    if (!journey) {
      return NextResponse.json({ error: "Journey not found" }, { status: 404 });
    }

    // Check if already active
    if (journey.isActive) {
      return NextResponse.json(
        { error: "Journey is already active" },
        { status: 400 },
      );
    }

    // Validate journey has at least one node beyond entry
    if (journey.nodes.length < 2) {
      return NextResponse.json(
        {
          error: "Journey must have at least one action node",
          suggestion: "Add nodes to your journey before activating",
        },
        { status: 400 },
      );
    }

    // 🔒 CRITICAL: Final check for entry point uniqueness before activation
    // This is the last safety net to prevent duplicate active journeys
    const validationResult = await validateEntryPointUniqueness(
      isAgent ? admin.agent.admin!.toString() : (adminId as string),
      journey.contactType,
      journey.leadIntent,
      journey.entryAction.tagAction,
      isAgent,
      isAgent ? (adminId as string) : undefined,
      id, // Exclude current journey
    );

    if (!validationResult.isValid) {
      return NextResponse.json(
        {
          ...formatEntryPointError(validationResult),
          suggestion: `Deactivate journey "${validationResult.conflictingJourney?.name}" before activating this one`,
        },
        { status: 409 }, // 409 Conflict
      );
    }

    // Activate journey using model method
    await journey.activate();

    return NextResponse.json({
      success: true,
      data: journey,
      message: "Journey activated successfully",
    });
  } catch (error: any) {
    console.error("Error activating journey:", error);
    return NextResponse.json(
      { error: "Failed to activate journey", details: error.message },
      { status: 500 },
    );
  }
}
