/**
 * PATCH /api/admin/journeys/[id]
 *
 * Update a journey
 * - Blocks editing of built-in journeys (except isActive)
 * - Allows activation/deactivation
 * - Validates entry point uniqueness
 */

import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/lib/_middleware";
import mongoose, { ObjectId } from "mongoose";
import { validateEntryPointUniqueness } from "@/app/utils/journey-validation-utils";
import {
  checkJourneyProtection,
  canModifyJourney,
} from "@/app/lib/journey-protection";
import { Journey } from "@/app/model/journey";



export async function PATCH(
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

    const id = (await params).id;

    const isAgent = admin.agent.isAgent;
    const adminId = admin._id as ObjectId;

    // ✅ Check journey protection
    const protection = await checkJourneyProtection(
      id,
      adminId.toString(),
      "edit",
      isAgent,
    );

    if (protection.isProtected) {
      return protection.error!;
    }

    const journey = protection.journey;
    const updates = await req.json();

    // ✅ For built-in journeys, only allow isActive changes
    if (journey.isBuiltIn) {
      const canModify = canModifyJourney(journey, updates);
      if (!canModify.allowed) {
        return NextResponse.json(
          {
            error: canModify.error,
            isBuiltIn: true,
            suggestion: "Duplicate this journey to create an editable copy.",
          },
          { status: 403 },
        );
      }
    }

    // Validate entry point if being activated or if entry point changed
    if (
      (updates.isActive === true && !journey.isActive) ||
      updates.contactType ||
      updates.leadIntent ||
      updates.entryAction
    ) {
      const contactType = updates.contactType || journey.contactType;
      const leadIntent =
        updates.leadIntent !== undefined
          ? updates.leadIntent
          : journey.leadIntent;
      const tagAction =
        updates.entryAction?.tagAction || journey.entryAction.tagAction;

      const validation = await validateEntryPointUniqueness(
        isAgent ? admin.agent.admin!.toString() : adminId.toString(),
        contactType,
        leadIntent,
        tagAction,
        isAgent,
        isAgent ? adminId.toString() : undefined,
        id,
      );

      if (!validation.isValid) {
        return NextResponse.json(
          {
            error: validation.error,
            conflictingJourney: validation.conflictingJourney,
          },
          { status: 409 },
        );
      }
    }

    // Apply updates
    Object.assign(journey, updates);
    await journey.save();

    console.log(`✅ Journey updated: ${journey.name}`);

    return NextResponse.json({
      success: true,
      data: journey,
      message: "Journey updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating journey:", error);

    if (error.message?.includes("Built-in journeys cannot be modified")) {
      return NextResponse.json(
        {
          error: error.message,
          isBuiltIn: true,
          suggestion: "Duplicate this journey to create an editable copy.",
        },
        { status: 403 },
      );
    }

    return NextResponse.json(
      { error: "Failed to update journey", details: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(
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

    const id = (await params).id;
    const { searchParams } = new URL(req.url);
    const force = searchParams.get("force") === "true";

    const adminId = admin._id as ObjectId;
    const isAgent = admin.agent.isAgent;

    // ✅ Check journey protection
    const protection = await checkJourneyProtection(
      id,
      adminId.toString(),
      "delete",
      isAgent,
    );

    console.log("here", protection.isProtected)

    if (protection.isProtected) {
      return protection.error!;
    }

    const journey = protection.journey;

    // Check for active progresses
    const JourneyProgress = mongoose.model("LeadJourneyProgress");
    const activeProgresses = await JourneyProgress.countDocuments({
      journey: id,
      status: { $in: ["active", "paused"] },
    });

    if (activeProgresses > 0 && !force) {
      return NextResponse.json(
        {
          error: "Cannot delete journey with active progresses",
          activeProgresses,
          suggestion: "Use force=true to cancel all progresses and delete",
        },
        { status: 400 },
      );
    }

    // Cancel progresses if force=true
    if (force && activeProgresses > 0) {
      await JourneyProgress.updateMany(
        {
          journey: id,
          status: { $in: ["active", "paused"] },
        },
        {
          $set: {
            status: "cancelled",
            cancelledAt: new Date(),
            cancelReason: "Journey deleted by admin",
          },
        },
      );
      console.log(
        `⚠️ Cancelled ${activeProgresses} active progresses for journey: ${journey.name}`,
      );
    }

    // Delete the journey
    await Journey.deleteOne({ _id: id });

    console.log(`✅ Journey deleted: ${journey.name}`);

    return NextResponse.json({
      success: true,
      message: "Journey deleted successfully",
      cancelledProgresses: force ? activeProgresses : 0,
    });
  } catch (error: any) {
    console.error("Error deleting journey:", error);

    if (error.message?.includes("Built-in journeys cannot be deleted")) {
      return NextResponse.json(
        {
          error: error.message,
          isBuiltIn: true,
          suggestion: "Built-in journeys are permanent and cannot be deleted.",
        },
        { status: 403 },
      );
    }

    return NextResponse.json(
      { error: "Failed to delete journey", details: error.message },
      { status: 500 },
    );
  }
}
