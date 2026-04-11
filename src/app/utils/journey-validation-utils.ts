/**
 * Validation utility for journey entry point uniqueness
 *
 * MVP: Strict mode - only ONE active journey per entry point
 * Future: Can be extended to support parallel journeys, priorities, etc.
 */

import { ObjectId } from "mongoose";
import { ContactType, ITagAction, Journey } from "../model/journey";
import { LeadIntent } from "../model/lead";

export interface EntryPointValidationResult {
  isValid: boolean;
  error?: string;
  conflictingJourney?: {
    _id: string;
    name: string;
  };
}

/**
 * Check if a journey's entry point conflicts with existing active journeys
 *
 * @param adminId - Admin ID
 * @param contactType - Contact type (buyer/seller)
 * @param leadIntent - Lead intent
 * @param tagAction - Tag action configuration
 * @param excludeJourneyId - Optional journey ID to exclude (for updates)
 * @returns Validation result with conflict details if any
 */
export async function validateEntryPointUniqueness(
  adminId: string,
  contactType: ContactType,
  leadIntent: LeadIntent,
  tagAction: ITagAction,
  isAgent: boolean,
  agent?: string,
  excludeJourneyId?: string,
): Promise<EntryPointValidationResult> {
  try {
    // Use the model's static method to find duplicates
    const duplicate = await Journey.findDuplicateEntryPoint(
      adminId,
      contactType,
      leadIntent,
      tagAction,
      // isAgent,
      excludeJourneyId,
      // isAgent ? agent : undefined,
    );

    if (duplicate) {
      const duplicateId = duplicate._id as ObjectId;

      return {
        isValid: false,
        error: `Another active journey "${duplicate.name}" already uses this entry point. Please deactivate it first or use different entry conditions.`,
        conflictingJourney: {
          _id: duplicateId.toString(),
          name: duplicate.name,
        },
      };
    }

    return { isValid: true };
  } catch (error: any) {
    console.error("Error validating entry point uniqueness:", error);
    throw new Error("Failed to validate entry point uniqueness");
  }
}

/**
 * Helper to build a human-readable description of entry point
 *
 * @param contactType - Contact type
 * @param leadIntent - Lead intent
 * @param tagAction - Tag action
 * @returns Readable description
 */
export function describeEntryPoint(
  contactType: ContactType,
  leadIntent: LeadIntent,
  tagAction: ITagAction,
): string {
  const actionDesc =
    tagAction.type === "assign"
      ? `when tag "${tagAction.tagName}" is assigned`
      : `when tag changes from "${tagAction.tagName}" to "${tagAction.newTagName}"`;

  return `${contactType}s with intent "${leadIntent}" ${actionDesc}`;
}

/**
 * Format validation error for API response
 */
export function formatEntryPointError(result: EntryPointValidationResult): {
  error: string;
  conflictingJourney?: { _id: string; name: string };
  suggestion: string;
} {
  return {
    error: result.error || "Entry point validation failed",
    conflictingJourney: result.conflictingJourney,
    suggestion: result.conflictingJourney
      ? `Deactivate journey "${result.conflictingJourney.name}" or modify your entry conditions`
      : "Use different entry conditions for this journey",
  };
}

// Future enhancement helpers (commented for MVP)
/*
export async function checkLeadJourneyConflict(
  leadId: string,
  journeyId: string
): Promise<boolean> {
  // Check if lead is already in an active journey
  // Used at execution time to prevent duplicate entries
  const activeProgress = await LeadJourneyProgress.findOne({
    lead: leadId,
    status: 'active',
    journey: { $ne: journeyId }
  });
  
  return !!activeProgress;
}

export async function getJourneyPriority(journeyId: string): Promise<number> {
  // Get journey priority for conflict resolution
  // Higher priority journeys win in case of conflicts
  const journey = await Journey.findById(journeyId).select('journeyPriority');
  return journey?.journeyPriority || 0;
}
*/
