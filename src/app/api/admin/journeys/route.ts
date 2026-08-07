import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/lib/_middleware";
import { Journey, IJourneyNode } from "@/app/model/journey";
import {
  validateEntryPointUniqueness,
  formatEntryPointError,
} from "@/app/utils/journey-validation-utils";
import { ObjectId } from "mongoose";
import { seedBuiltInJourneys } from "@/app/utils/seed-builtin-journeys";
import { seedSystemTags } from "@/app/utils/seed-system-tags";
import { sweepOverdueJourneys } from "@/app/lib/execution-engine/sweeper";
import { capitalizeFirst } from "@/app/utils/capitalize-first-letter";

/**
 * GET /api/journeys
 * Fetch all journeys for the authenticated admin
 *
 * Query params:
 * - status: "active" | "draft" | "all" (default: "all")
 * - contactType: "buyer" | "seller" (optional)
 * - leadIntent: LeadIntent (optional)
 */
export async function GET(req: NextRequest) {
  try {
    const authResponse = await authMiddleware(req);
    if (authResponse instanceof NextResponse) return authResponse;

    const admin = authResponse;
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const isAgent = admin.agent.isAgent;
    const adminId = admin._id as ObjectId;

    // Seeding is best-effort. It runs on every load for demo accounts, and a
    // failure here should not take down the automations page - existing
    // journeys are still perfectly readable without it.
    try {
      await seedSystemTags(
        isAgent,
        admin.isBroker,
        admin._id as string,
        admin.agent?.admin as string | undefined,
      );

      await seedBuiltInJourneys(
        isAgent ? admin.agent.admin!.toString() : adminId.toString(),
        isAgent,
        adminId.toString(),
      );
    } catch (seedError) {
      console.error("Seeding failed while loading journeys:", seedError);
    }

    // Opportunistic safety net. With no cron in this project, a timer email
    // that never arrives would leave a journey parked forever; this catches
    // those whenever an admin opens the dashboard. Throttled internally, and
    // never throws, so it cannot affect this response.
    void sweepOverdueJourneys();

    // Parse query params
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "all";
    const contactType = searchParams.get("contactType");
    const leadIntent = searchParams.get("leadIntent");

    // Build query
    const query: any = { [isAgent ? "agent" : "admin"]: adminId };

    // Filter by status
    if (status === "active") {
      query.isActive = true;
      query.isDraft = false;
    } else if (status === "draft") {
      query.isDraft = true;
    }

    // Filter by contact type
    if (contactType && (contactType === "buyer" || contactType === "seller")) {
      query.contactType = contactType;
    }

    // Filter by lead intent
    if (leadIntent) {
      query.leadIntent = leadIntent;
    }

    // Fetch journeys
    const journeys = await Journey.find(query).sort({ updatedAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      data: journeys,
      count: journeys.length,
    });
  } catch (error: any) {
    console.error("Error fetching journeys:", error);
    return NextResponse.json(
      { error: "Failed to fetch journeys", details: error.message },
      { status: 500 },
    );
  }
}

/**
 * POST /api/journeys
 * Create a new journey
 *
 * STRICT MODE: Validates entry point uniqueness - only ONE active journey
 * per unique entry point is allowed.
 *
 * Body:
 * {
 *   name: string;
 *   contactType: ContactType;
 *   leadIntent: LeadIntent;
 *   entryAction: IEntryAction;
 *   nodes?: IJourneyNode[];
 *   edges?: IJourneyEdge[];
 *   entryNodeId?: string;
 *   description?: string;
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const authResponse = await authMiddleware(req);
    if (authResponse instanceof NextResponse) return authResponse;

    const admin = authResponse;
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const isAgent = admin.agent.isAgent;
    const adminId = admin._id;

    // Parse request body
    const body = await req.json();
    const {
      name,
      contactType,
      leadIntent,
      entryAction,
      nodes,
      edges,
      entryNodeId,
      description,
    } = body;

    // Validation
    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Journey name is required" },
        { status: 400 },
      );
    }

    if (!contactType || !["buyer", "seller"].includes(contactType)) {
      return NextResponse.json(
        { error: "Valid contact type is required (buyer or seller)" },
        { status: 400 },
      );
    }

    if (!leadIntent) {
      return NextResponse.json(
        { error: "Lead intent is required" },
        { status: 400 },
      );
    }

    if (!entryAction?.tagAction?.tagName) {
      return NextResponse.json(
        { error: "Entry action with tag name is required" },
        { status: 400 },
      );
    }

    // If tag action type is "change", newTagName is required
    if (
      entryAction.tagAction.type === "change" &&
      !entryAction.tagAction.newTagName?.trim()
    ) {
      return NextResponse.json(
        { error: "New tag name is required for tag change action" },
        { status: 400 },
      );
    }

    // 🔒 CRITICAL: Check entry point uniqueness (MVP Strict Mode)
    // This prevents creating journeys with duplicate entry points
    const validationResult = await validateEntryPointUniqueness(
      isAgent ? admin.agent.admin!.toString() : (adminId as string),
      contactType,
      leadIntent,
      entryAction.tagAction,
      isAgent,
      isAgent ? (adminId as string) : undefined,
    );

    if (!validationResult.isValid) {
      return NextResponse.json(
        formatEntryPointError(validationResult),
        { status: 409 }, // 409 Conflict
      );
    }

    // Create default entry node if none provided
    const defaultNodes: IJourneyNode[] = nodes || [
      {
        id: "entry_1",
        type: "entry",
        config: { type: "entry" },
        position: { x: 250, y: 50 },
      },
    ];

    const defaultEntryNodeId = entryNodeId || "entry_1";

    // Validate entry node exists
    const entryNodeExists = defaultNodes.some(
      (node) => node.id === defaultEntryNodeId,
    );

    if (!entryNodeExists) {
      return NextResponse.json(
        { error: "Entry node ID must reference an existing node" },
        { status: 400 },
      );
    }

    // Create journey (always starts as inactive draft)
    const journey = await Journey.create({
      admin: isAgent ? admin.agent.admin : adminId,
      ...((isAgent || admin.isBroker) && { agent: admin._id }),
      name: name.trim(),
      contactType: capitalizeFirst(contactType),
      leadIntent,
      entryAction,
      nodes: defaultNodes,
      edges: edges || [],
      entryNodeId: defaultEntryNodeId,
      description: description?.trim(),
      isActive: false, // Always start inactive
      isDraft: true,
      isBuiltIn: false,
    });

    return NextResponse.json(
      {
        success: true,
        data: journey,
        message: "Journey created successfully",
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating journey:", error);

    // Handle MongoDB duplicate key errors (shouldn't happen with our validation, but safety net)
    if (error.code === 11000) {
      return NextResponse.json(
        {
          error: "A journey with this entry point already exists",
          suggestion:
            "Please use different entry conditions or deactivate the existing journey",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create journey", details: error.message },
      { status: 500 },
    );
  }
}
