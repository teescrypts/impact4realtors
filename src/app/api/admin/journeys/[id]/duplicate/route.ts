/**
 * POST /api/admin/journeys/[id]/duplicate
 *
 * Duplicates a journey (built-in or custom)
 * - Copies all nodes, edges, and configuration
 * - Sets isBuiltIn: false, isEditable: true, isActive: false
 * - Renames to "[Original Name] (Copy)"
 */

import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/lib/_middleware";
import mongoose from "mongoose";
import { Journey } from "@/app/model/journey";



export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResponse = await authMiddleware(req);
    if (authResponse instanceof NextResponse) return authResponse;

    const admin = authResponse;
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let isAgent;

    if (admin.agent.isAgent) {
      isAgent = true;
    }

    const id = (await params).id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid journey ID" },
        { status: 400 },
      );
    }

    // Find the journey to duplicate
    const originalJourney = await Journey.findOne({
      _id: id,
      $or: [
        {
          [isAgent ? "agent" : "admin"]: admin._id,
        }, // User's own journey
        { isBuiltIn: true }, // Or built-in journey
      ],
    });

    if (!originalJourney) {
      return NextResponse.json(
        { error: "Journey not found or access denied" },
        { status: 404 },
      );
    }

    // Parse request body for optional custom name
    const body = await req.json().catch(() => ({}));
    const customName = body.newName;

    // Create duplicate with modifications
    const duplicateData = {
      admin: isAgent ? admin.agent.admin : admin._id, // Assign to current admin
      ...(isAgent && { agent: admin._id }),
      name: customName || `${originalJourney.name} (Copy)`,
      contactType: originalJourney.contactType,
      leadIntent: originalJourney.leadIntent,
      entryAction: originalJourney.entryAction,
      nodes: originalJourney.nodes,
      edges: originalJourney.edges,
      entryNodeId: originalJourney.entryNodeId,

      // ✅ Override built-in fields
      isBuiltIn: false, // Now a custom journey
      isEditable: true, // Can be edited
      isActive: false, // Starts inactive (prevents duplicate entry point conflict)

      // Don't copy builtInCategory for duplicates
      builtInCategory: undefined,
    };

    // Create the duplicate
    const duplicate = await Journey.create(duplicateData);

    console.log(
      `✅ Journey duplicated: ${originalJourney.name} → ${duplicate.name}`,
    );

    return NextResponse.json(
      {
        success: true,
        data: duplicate,
        message: `Journey duplicated successfully. Activate it when ready.`,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error duplicating journey:", error);

    // Handle duplicate entry point error
    if (error.message?.includes("entry point")) {
      return NextResponse.json(
        {
          error: "Cannot activate - entry point conflict",
          details: error.message,
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Failed to duplicate journey", details: error.message },
      { status: 500 },
    );
  }
}
