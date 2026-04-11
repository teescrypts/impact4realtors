/**
 * Journey Protection Middleware
 *
 * Prevents editing and deletion of built-in journeys
 * Use in PATCH and DELETE endpoints
 */

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Journey } from "../model/journey";

export interface ProtectionCheckResult {
  isProtected: boolean;
  error?: NextResponse;
  journey?: any;
}

/**
 * Check if a journey is protected (built-in) and prevent modification
 *
 * @param journeyId - Journey ID to check
 * @param adminId - Admin ID requesting the action
 * @param action - Action being attempted ("edit" or "delete")
 * @returns Protection check result
 */
export async function checkJourneyProtection(
  journeyId: string,
  adminId: string,
  action: "edit" | "delete",
  isAgent: boolean,
): Promise<ProtectionCheckResult> {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(journeyId)) {
      return {
        isProtected: true,
        error: NextResponse.json(
          { error: "Invalid journey ID" },
          { status: 400 },
        ),
      };
    }

    // Find the journey
    const journey = await Journey.findOne({
      _id: journeyId,
      $or: [{ [isAgent ? "agent" : "admin"]: adminId }],
    });

    if (!journey) {
      return {
        isProtected: true,
        error: NextResponse.json(
          { error: "Journey not found or access denied" },
          { status: 404 },
        ),
      };
    }

    // Check if journey is built-in
    if (journey.isBuiltIn) {
      const actionText = action === "edit" ? "edited" : "deleted";
      const suggestion =
        action === "edit"
          ? "Duplicate this journey to create an editable copy."
          : "Built-in journeys are permanent and cannot be deleted.";

      return {
        isProtected: true,
        error: NextResponse.json(
          {
            error: `Built-in journeys cannot be ${actionText}`,
            isBuiltIn: true,
            journeyName: journey.name,
            suggestion,
          },
          { status: 403 },
        ),
      };
    }

    // Journey is not protected
    return {
      isProtected: false,
      journey,
    };
  } catch (error: any) {
    console.error("Error checking journey protection:", error);
    return {
      isProtected: true,
      error: NextResponse.json(
        {
          error: "Failed to verify journey permissions",
          details: error.message,
        },
        { status: 500 },
      ),
    };
  }
}

/**
 * Check if user can modify journey fields
 * Allows activation/deactivation of built-in journeys
 *
 * @param journey - Journey document
 * @param updates - Proposed updates
 * @returns true if updates are allowed
 */
export function canModifyJourney(
  journey: any,
  updates: Record<string, any>,
): { allowed: boolean; error?: string } {
  // If not built-in, allow all modifications
  if (!journey.isBuiltIn) {
    return { allowed: true };
  }

  // For built-in journeys, only allow isActive changes
  const updateKeys = Object.keys(updates);
  const allowedKeys = ["isActive"];

  const unauthorizedKeys = updateKeys.filter(
    (key) => !allowedKeys.includes(key),
  );

  if (unauthorizedKeys.length > 0) {
    return {
      allowed: false,
      error: `Built-in journeys can only be activated/deactivated. Cannot modify: ${unauthorizedKeys.join(", ")}`,
    };
  }

  return { allowed: true };
}
